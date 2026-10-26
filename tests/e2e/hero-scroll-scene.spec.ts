import { expect, test, type Page } from "@playwright/test";

const selectors = {
    hero: "#hero",
    eyebrow: '[data-cinematic-element="hero-eyebrow"]',
    title: "#hero-title",
    canvas: "[data-hero-handshake]",
    visual: "[data-hero-visual]",
    glow: "[data-hero-contact-glow]",
};

// Measured original frame-engine ranges at these viewports. These baselines
// deliberately do not derive expected playback from the new effects timeline.
const desktop = { width: 1440, height: 900, frameEnd: 645.6713 };
const touchViewports = [
    { name: "tablet", width: 768, height: 1024, frameEnd: 306 },
    { name: "phone", width: 390, height: 844, frameEnd: 191 },
];

async function openHero(page: Page, viewport: { width: number; height: number }) {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(selectors.canvas)).toHaveAttribute("data-frame", "1");
    await expect(page.locator("html")).toHaveAttribute("data-motion-runtime", "ready");
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    // Tablet's existing entrance completes before measuring the scroll-only pose.
    await expect.poll(() => page.locator(selectors.eyebrow).evaluate((element) => {
        const style = getComputedStyle(element);
        const y = style.transform === "none" ? 0 : new DOMMatrixReadOnly(style.transform).m42;
        return style.opacity === "1" && Math.abs(y) < 0.01;
    })).toBe(true);
}

async function scrollTo(page: Page, y: number) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(y, 0);
}

async function scene(page: Page, measureInk = false) {
    return page.evaluate(({ selectors, measureInk }) => {
        const get = <T extends HTMLElement>(selector: string) => {
            const element = document.querySelector<T>(selector);
            if (!element) throw new Error(`Missing Hero element: ${selector}`);
            return element;
        };
        const box = (element: HTMLElement) => {
            const rect = element.getBoundingClientRect();
            return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
        };
        const canvas = get<HTMLCanvasElement>(selectors.canvas);
        const visual = get(selectors.visual);
        const transform = getComputedStyle(visual).transform;
        let ink = null;
        if (measureInk) {
            const pixels = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data;
            let left = canvas.width, right = -1, top = canvas.height, bottom = -1;
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    if (pixels[(y * canvas.width + x) * 4 + 3] <= 16) continue;
                    left = Math.min(left, x);
                    right = Math.max(right, x);
                    top = Math.min(top, y);
                    bottom = Math.max(bottom, y);
                }
            }
            const rect = canvas.getBoundingClientRect();
            if (right >= 0) ink = {
                left: rect.left + left / canvas.width * rect.width,
                right: rect.left + (right + 1) / canvas.width * rect.width,
                top: rect.top + top / canvas.height * rect.height,
                bottom: rect.top + (bottom + 1) / canvas.height * rect.height,
            };
        }
        const next = document.querySelector<HTMLElement>('[data-cinematic-scene="crafting"]');
        return {
            y: window.scrollY,
            hero: box(get(selectors.hero)),
            eyebrow: box(get(selectors.eyebrow)),
            header: box(get("[data-site-header]")),
            frame: Number(canvas.dataset.frame),
            scale: transform === "none" ? 1 : new DOMMatrixReadOnly(transform).a,
            titleOpacity: Number(getComputedStyle(get(selectors.title)).opacity),
            glowOpacity: Number(getComputedStyle(get(selectors.glow)).opacity),
            next: next ? box(next) : null,
            ink,
            width: window.innerWidth,
            height: window.innerHeight,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
    }, { selectors, measureInk });
}

async function expectFrame(page: Page, frameEnd: number) {
    await expect.poll(async () => {
        const current = await scene(page);
        const progress = Math.max(0, Math.min(1, current.y / frameEnd));
        return current.frame - (Math.round(progress * 64) + 1);
    }).toBe(0);
}

async function expectEffects(page: Page, scale: number, titleOpacity: number) {
    await expect.poll(async () => (await scene(page)).scale).toBeCloseTo(scale, 3);
    await expect.poll(async () => (await scene(page)).titleOpacity).toBeCloseTo(titleOpacity, 2);
}

test("desktop Hero pins immediately and preserves forward/reverse frame playback", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"), "Desktop pointer and viewport contract.");
    await openHero(page, desktop);
    const initial = await scene(page);
    expect(initial.scale).toBeCloseTo(1, 3);
    expect(initial.titleOpacity).toBe(1);
    expect(initial.glowOpacity).toBe(0);

    for (const y of [1, 20, 40, 80]) {
        await scrollTo(page, y);
        await expectFrame(page, desktop.frameEnd);
        await expect.poll(async () => (await scene(page)).eyebrow.top)
            .toBeCloseTo(initial.eyebrow.top, 0);
        const current = await scene(page);
        expect(current.hero.top).toBeCloseTo(initial.hero.top, 0);
        expect(current.eyebrow.top).toBeGreaterThanOrEqual(current.header.bottom - 1);
    }

    await scrollTo(page, Math.round(desktop.frameEnd / 2));
    await expectFrame(page, desktop.frameEnd);
    const middle = await scene(page);
    expect(middle.frame).toBe(33);
    expect(middle.scale).toBeCloseTo(1.06, 3);
    expect(middle.titleOpacity).toBeLessThan(0.6);
    expect(middle.titleOpacity).toBeGreaterThan(0.3);

    await scrollTo(page, Math.ceil(desktop.frameEnd));
    await expectFrame(page, desktop.frameEnd);
    await expectEffects(page, 1.12, 0.08);
    expect((await scene(page)).glowOpacity).toBeGreaterThan(0);
    await expect(page.locator(".pin-spacer")).toHaveCount(1);

    await scrollTo(page, Math.ceil(desktop.frameEnd) + 80);
    await expectFrame(page, desktop.frameEnd);
    await expectEffects(page, 1.12, 0.08);
    await scrollTo(page, Math.round(desktop.frameEnd / 2));
    await expectFrame(page, desktop.frameEnd);
    await expect.poll(async () => (await scene(page)).scale).toBeCloseTo(middle.scale, 3);
    await scrollTo(page, 0);
    await expectFrame(page, desktop.frameEnd);
    await expectEffects(page, 1, 1);
    expect((await scene(page)).glowOpacity).toBe(0);
});

for (const viewport of touchViewports) {
    test(`${viewport.name} preserves the original frame range, contains the zoom, and releases the pin`, async ({ page }, testInfo) => {
        test.skip(!testInfo.project.name.includes("mobile"), "Touch layout contract.");
        await openHero(page, viewport);
        const initial = await scene(page);

        await scrollTo(page, Math.round(viewport.frameEnd / 2));
        await expectFrame(page, viewport.frameEnd);
        const middle = await scene(page);
        expect(middle.frame).toBe(33);
        expect(middle.hero.top).toBeCloseTo(initial.hero.top, 0);
        expect(middle.eyebrow.top).toBeCloseTo(initial.eyebrow.top, 0);
        expect(middle.scale).toBeCloseTo(1.06, 3);

        await scrollTo(page, viewport.frameEnd);
        await expectFrame(page, viewport.frameEnd);
        await expectEffects(page, 1.12, 0.08);
        const end = await scene(page, true);
        expect(end.hero.top).toBeCloseTo(initial.hero.top, 0);
        expect(end.overflow).toBeLessThanOrEqual(1);
        expect(end.ink).not.toBeNull();
        expect(end.ink!.left).toBeGreaterThanOrEqual(-1);
        expect(end.ink!.right).toBeLessThanOrEqual(end.width + 1);
        expect(end.ink!.top).toBeGreaterThanOrEqual(end.header.bottom - 1);
        expect(end.ink!.bottom).toBeLessThanOrEqual(Math.min(end.hero.bottom, end.height) + 1);

        await scrollTo(page, viewport.frameEnd + 60);
        await expectFrame(page, viewport.frameEnd);
        await expectEffects(page, 1.12, 0.08);
        const released = await scene(page);
        expect(released.hero.top).toBeCloseTo(end.hero.top - 60, 0);
        expect(released.next).not.toBeNull();
        expect(released.next!.top).toBeGreaterThanOrEqual(released.hero.bottom - 1);
        await expect(page.locator(".pin-spacer")).toHaveCount(1);

        await scrollTo(page, Math.round(viewport.frameEnd / 2));
        await expectFrame(page, viewport.frameEnd);
        expect((await scene(page)).hero.top).toBeCloseTo(initial.hero.top, 0);
        await scrollTo(page, 0);
        await expectFrame(page, viewport.frameEnd);
        await expectEffects(page, 1, 1);
    });
}

test("tablet height resize reconciles its pin without duplicate spacers", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("mobile"), "Touch layout contract.");
    const tablet = touchViewports[0];
    await openHero(page, tablet);
    for (let repeat = 0; repeat < 2; repeat++) {
        // Width stays inside the same tablet media query; only scene fit changes.
        await page.setViewportSize({ width: tablet.width, height: 700 });
        await expect(page.locator(".pin-spacer")).toHaveCount(0);
        const flowing = await scene(page);
        await scrollTo(page, 40);
        await expect.poll(async () => (await scene(page)).hero.top)
            .toBeCloseTo(flowing.hero.top - 40, 0);
        await scrollTo(page, 0);
        await page.setViewportSize(tablet);
        await expect(page.locator(".pin-spacer")).toHaveCount(1);
        await scrollTo(page, 40);
        await expectFrame(page, tablet.frameEnd);
        await expect.poll(async () => (await scene(page)).hero.top).toBeCloseTo(0, 0);
        await scrollTo(page, 0);
    }
    await expectEffects(page, 1, 1);
});

test("reduced motion retains the original poster and removes scene effects and pins", async ({ page }, testInfo) => {
    const viewport = testInfo.project.name.includes("mobile") ? touchViewports[1] : desktop;
    await openHero(page, viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator(selectors.canvas)).toHaveAttribute("data-frame", "1");
    await expectEffects(page, 1, 1);
    expect((await scene(page)).glowOpacity).toBe(0);
    await page.evaluate(() => window.scrollTo({ top: 100, behavior: "instant" }));
    // The unchanged Header may compact in normal document flow and adjust the
    // native scroll offset. Reduced motion only promises a stationary poster.
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(page.locator(selectors.canvas)).toHaveAttribute("data-frame", "1");
    await expectEffects(page, 1, 1);

    await scrollTo(page, 0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    await scrollTo(page, Math.round(viewport.frameEnd / 2));
    await expectFrame(page, viewport.frameEnd);
    await expect.poll(async () => (await scene(page)).scale).toBeCloseTo(1.06, 3);
});
