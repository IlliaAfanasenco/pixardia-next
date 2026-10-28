import { expect, test, type Page } from "@playwright/test";

const completionKey = "pixardia:mobile-intro:complete";
const heroSelector = '[data-mobile-section="hero"]';
const characterSelector = "[data-hero-characters]";
const assetSelector = `${characterSelector} img`;
const description = "We design, build and scale digital products that move businesses forward.";
const viewports = [
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 480, height: 960 },
];

async function holdHeroImage(page: Page) {
    let release = () => {};
    const released = new Promise<void>((resolve) => { release = resolve; });
    // Matches both the raw nested asset path and Next.js optimizer URLs.
    await page.route((url) => url.href.includes("hero-handshake"), async (route) => {
        await released;
        await route.continue();
    });
    return release;
}

async function holdStartupScripts(page: Page) {
    let release = () => {};
    const released = new Promise<void>((resolve) => { release = resolve; });
    await page.route((url) => url.pathname.startsWith("/_next/") && url.pathname.endsWith(".js"), async (route) => {
        await released;
        await route.continue();
    });
    return release;
}

async function trackOverlay(page: Page) {
    await page.addInitScript(() => {
        Reflect.set(window, "__mobileIntroSeen", false);
        Reflect.set(window, "__mobileIntroCount", 0);
        new MutationObserver((records) => {
            for (const record of records) {
                for (const node of record.addedNodes) {
                    if (node instanceof Element && (
                        node.matches("[data-mobile-intro]") ||
                        node.querySelector("[data-mobile-intro]")
                    )) {
                        Reflect.set(window, "__mobileIntroSeen", true);
                        Reflect.set(window, "__mobileIntroCount", Reflect.get(window, "__mobileIntroCount") + 1);
                    }
                }
            }
        }).observe(document, { childList: true, subtree: true });
    });
}

async function expectReady(page: Page, timeout = 7_000) {
    await expect(page.locator(heroSelector)).toHaveAttribute("data-mobile-intro-state", "ready", { timeout });
    await expect(page.locator("[data-mobile-intro]")).toHaveCount(0);
    await expect(page.locator("#mobile-main")).not.toHaveAttribute("inert", "");
    await expect(page.locator("#mobile-main")).not.toHaveAttribute("aria-busy", "true");
    await expect(page.locator("[data-mobile-section][inert]")).toHaveCount(0);
    await expect(page.locator("[data-mobile-footer]")).not.toHaveAttribute("inert", "");
    const restored = await page.evaluate(() => ({
        root: document.documentElement.style.overflow,
        body: document.body.style.overflow,
        position: getComputedStyle(document.querySelector("[data-hero-characters]")!).position,
    }));
    expect(restored).toEqual({ root: "", body: "", position: "relative" });
}

async function expectNoOverflow(page: Page) {
    const dimensions = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width + 1);
}

async function heroGeometry(page: Page) {
    await expect.poll(() => page.locator(assetSelector).evaluate(
        (image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
    )).toBe(true);
    return page.locator(heroSelector).evaluate((hero, descriptionText) => {
        const elements = [
            { name: "characters", element: hero.querySelector("[data-hero-characters]")! },
            { name: "image", element: hero.querySelector("[data-hero-characters] img")! },
            { name: "heading", element: hero.querySelector("h1")! },
            { name: "description", element: [...hero.querySelectorAll("p")].find((p) => p.textContent?.trim() === descriptionText)! },
            { name: "stats", element: hero.querySelector("[data-hero-stats]")! },
            { name: "contact", element: hero.querySelector('a[href$="/contact"]')! },
            { name: "header", element: document.querySelector("[data-mobile-header]")! },
        ];
        return elements.map(({ name, element }) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
                name, x: rect.x, y: rect.y, width: rect.width, height: rect.height,
                right: rect.right, bottom: rect.bottom,
                opacity: style.opacity, transform: style.transform, position: style.position,
            };
        });
    }, description);
}

async function expectHeroComposition(page: Page) {
    const hero = page.locator(heroSelector);
    await expect(hero.getByRole("heading", { name: "DIGITAL AGENCY", exact: true })).toBeVisible();
    await expect(hero.getByText(description, { exact: true })).toBeVisible();
    await expect(hero.getByRole("button", { name: /^Explore services$/i })).toHaveCount(0);
    await expect(hero.locator("[data-hero-explore]")).toHaveCount(0);
    await expect(hero.locator('a[href$="/contact"]')).toHaveAccessibleName(/let's build\s+something great/i);
    await expect(hero.locator('[src*="AstronautAlienMobileHero"]')).toHaveCount(0);
    await expect(page.locator(assetSelector)).toHaveCount(1);
    await expect(page.locator(assetSelector)).toHaveAttribute("src", /hero-handshake/);

    const geometry = await heroGeometry(page);
    const characters = geometry.find((rect) => rect.name === "characters")!;
    const overlaps = (rect: typeof characters) => (
        Math.min(characters.right, rect.right) - Math.max(characters.x, rect.x) > 1 &&
        Math.min(characters.bottom, rect.bottom) - Math.max(characters.y, rect.y) > 1
    );
    for (const name of ["description", "stats", "contact", "header"]) {
        expect(overlaps(geometry.find((rect) => rect.name === name)!), `Characters overlap ${name}`).toBe(false);
    }
    const heading = geometry.find((rect) => rect.name === "heading")!;
    const copy = geometry.find((rect) => rect.name === "description")!;
    const stats = geometry.find((rect) => rect.name === "stats")!;
    const contact = geometry.find((rect) => rect.name === "contact")!;
    expect(copy.y).toBeGreaterThanOrEqual(heading.bottom - 1);
    expect(characters.y).toBeGreaterThanOrEqual(copy.bottom - 1);
    expect(stats.y).toBeGreaterThanOrEqual(characters.bottom - 1);
    expect(contact.y).toBeGreaterThanOrEqual(stats.bottom - 1);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    const previousCharacterWidth = Math.min(264, Math.max(218, viewportWidth * 0.62));
    expect(characters.width).toBeGreaterThanOrEqual(previousCharacterWidth * 1.2 - 1);
    const statAlignment = await hero.locator("[data-hero-stats] > div").evaluateAll((columns) => columns.map((column) => {
        const rect = column.getBoundingClientRect();
        const textCenter = (element: Element) => {
            const range = document.createRange();
            range.selectNodeContents(element);
            const text = range.getBoundingClientRect();
            return text.x + text.width / 2;
        };
        return {
            y: rect.y,
            center: rect.x + rect.width / 2,
            valueCenter: textCenter(column.querySelector("[data-hero-stat]")!),
            labelCenter: textCenter(column.querySelector("p")!),
        };
    }));
    expect(statAlignment).toHaveLength(2);
    expect(Math.abs(statAlignment[0].y - statAlignment[1].y)).toBeLessThanOrEqual(0.5);
    for (const stat of statAlignment) {
        expect(Math.abs(stat.center - stat.valueCenter)).toBeLessThanOrEqual(1);
        expect(Math.abs(stat.center - stat.labelCenter)).toBeLessThanOrEqual(1);
    }
    await expectNoOverflow(page);
    return geometry;
}

test.describe("mobile arrival intro", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        test.skip(!testInfo.project.name.includes("mobile"), "The intro belongs to the mobile preview.");
        await page.emulateMedia({ reducedMotion: "no-preference" });
    });

    test("with delayed startup scripts, keeps the header stable and hides the final scene before starting arrival", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await trackOverlay(page);
        const releaseScripts = await holdStartupScripts(page);
        const releaseImage = await holdHeroImage(page);
        try {
            await page.goto("/mobile-preview", { waitUntil: "commit" });
            await expect(page.locator("html")).toHaveAttribute("data-mobile-intro-boot", "pending");
            await expect(page.locator(characterSelector)).toHaveCSS("opacity", "0");
            await expect(page.locator(`${heroSelector} h1`)).toHaveCSS("opacity", "0");
            await expect(page.locator(`${heroSelector} a[href$="/contact"]`)).toHaveCSS("visibility", "hidden");
            await expect(page.locator("[data-mobile-header]")).toBeVisible();
            await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeEnabled();
            const image = await page.locator(assetSelector).elementHandle();
            const frames = await page.evaluate(() => new Promise<{ opacity: string; header: number[] }[]>((resolve) => {
                const frames: { opacity: string; header: number[] }[] = [];
                const started = performance.now();
                const sample = () => {
                    const header = document.querySelector("[data-mobile-header]")!.getBoundingClientRect();
                    frames.push({
                        opacity: getComputedStyle(document.querySelector("[data-hero-characters]")!).opacity,
                        header: [header.x, header.y, header.width, header.height],
                    });
                    if (performance.now() - started >= 500) resolve(frames);
                    else requestAnimationFrame(sample);
                };
                requestAnimationFrame(sample);
            }));
            expect(frames.length).toBeGreaterThan(2);
            expect(frames.every((frame) => frame.opacity === "0")).toBe(true);
            for (let dimension = 0; dimension < 4; dimension++) {
                expect(Math.max(...frames.map((frame) => Math.abs(frame.header[dimension] - frames[0].header[dimension])))).toBeLessThanOrEqual(0.5);
            }
            await expect(page.locator("[data-mobile-intro]")).toHaveCount(0);
            releaseScripts();
            await expect(page.locator("[data-mobile-intro]")).toHaveAttribute("data-phase", "loading");
            await expect(page.locator(characterSelector)).toHaveCSS("opacity", "0");
            releaseImage();
            await expect(page.locator("[data-mobile-intro]")).toHaveAttribute("data-phase", "arrival");
            await expectReady(page);
            expect(await image!.evaluate((image) => image === document.querySelector("[data-hero-characters] img"))).toBe(true);
            await image!.dispose();
            expect(await page.evaluate(() => Reflect.get(window, "__mobileIntroSeen"))).toBe(true);
            await expectHeroComposition(page);
        } finally {
            releaseScripts();
            releaseImage();
        }
    });

    test("reveals a usable Hero after the startup timeout and skips arrival when hydration finally finishes", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await trackOverlay(page);
        const releaseScripts = await holdStartupScripts(page);
        try {
            await page.goto("/mobile-preview", { waitUntil: "commit" });
            await expect(page.locator("html")).toHaveAttribute("data-mobile-intro-boot", "pending");
            await expect(page.locator(characterSelector)).toHaveCSS("opacity", "0");
            const header = await page.locator("[data-mobile-header]").boundingBox();
            await expect(page.locator("html")).toHaveAttribute("data-mobile-intro-boot", "expired", { timeout: 7_000 });
            await expect(page.locator(characterSelector)).toHaveCSS("opacity", "1");
            await expectHeroComposition(page);
            await expect(page.locator("[data-mobile-intro]")).toHaveCount(0);
            expect(await page.locator("[data-mobile-header]").boundingBox()).toEqual(header);
            releaseScripts();
            await expectReady(page);
            expect(await page.evaluate(() => Reflect.get(window, "__mobileIntroSeen"))).toBe(false);
            expect(await page.evaluate((key) => sessionStorage.getItem(key), completionKey)).toBeNull();
            await expectHeroComposition(page);
        } finally {
            releaseScripts();
        }
    });

    test("renders the complete mobile Hero and native contact link with JavaScript disabled", async ({ browser, baseURL }) => {
        const context = await browser.newContext({
            baseURL, javaScriptEnabled: false,
            viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true,
        });
        try {
            const page = await context.newPage();
            await page.goto("/mobile-preview");
            await expect(page.locator("html")).not.toHaveAttribute("data-mobile-intro-boot", /./);
            await expect(page.locator("[data-mobile-intro]")).toHaveCount(0);
            await expect(page.locator(characterSelector)).toHaveCSS("opacity", "1");
            await expect(page.locator(`${heroSelector} h1`)).toHaveCSS("opacity", "1");
            await expectHeroComposition(page);
            await page.locator(`${heroSelector} a[href="/en/contact"]`).click();
            await expect(page).toHaveURL(/\/en\/contact$/);
        } finally {
            await context.close();
        }
    });

    test("moves one visible desktop character image continuously into the reserved Hero stage", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const errors: string[] = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
        const release = await holdHeroImage(page);
        try {
            await page.goto("/mobile-preview", { waitUntil: "domcontentloaded" });
            await expect(page.locator("[data-mobile-intro]")).toHaveAttribute("data-phase", "loading");
            await expect(page.locator(heroSelector)).toHaveAttribute("inert", "");
            await expect(page.locator("#mobile-main")).not.toHaveAttribute("inert", "");
            await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeEnabled();
            expect(await page.evaluate((key) => sessionStorage.getItem(key), completionKey)).toBeNull();
            await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
            const reservedHeight = await page.locator(heroSelector).evaluate((hero) => hero.getBoundingClientRect().height);
            const frameTracker = await page.evaluateHandle(() => {
                const characters = document.querySelector<HTMLElement>("[data-hero-characters]")!;
                const originalImage = characters.querySelector("img")!;
                const state = {
                    originalImage,
                    frames: [] as {
                        phase: string | undefined; x: number; y: number; width: number;
                        opacity: number; visible: boolean; decoded: boolean;
                        imageCount: number; sameImage: boolean; source: string;
                        headerX: number; headerY: number; headerWidth: number; headerHeight: number;
                    }[],
                };
                const sample = () => {
                    const overlay = document.querySelector<HTMLElement>("[data-mobile-intro]");
                    const rect = characters.getBoundingClientRect();
                    const style = getComputedStyle(characters);
                    const imageStyle = getComputedStyle(originalImage);
                    const header = document.querySelector("[data-mobile-header]")!.getBoundingClientRect();
                    state.frames.push({
                        phase: overlay?.dataset.phase,
                        x: rect.x, y: rect.y, width: rect.width,
                        opacity: Number(style.opacity) * Number(imageStyle.opacity),
                        visible: style.visibility === "visible" && imageStyle.visibility === "visible" && rect.width > 0 && rect.height > 0,
                        decoded: originalImage.complete && originalImage.naturalWidth > 0,
                        imageCount: document.querySelectorAll("[data-hero-characters] img").length,
                        sameImage: originalImage.isConnected && characters.querySelector("img") === originalImage,
                        source: originalImage.currentSrc || originalImage.src,
                        headerX: header.x, headerY: header.y, headerWidth: header.width, headerHeight: header.height,
                    });
                    if (overlay) requestAnimationFrame(sample);
                };
                requestAnimationFrame(sample);
                return state;
            });
            release();
            await expect(page.locator("[data-mobile-intro]")).toHaveAttribute("data-phase", "arrival");
            await expectNoOverflow(page);
            await expectReady(page);
            expect(await page.evaluate((key) => sessionStorage.getItem(key), completionKey)).toBe("1");
            const finalHeight = await page.locator(heroSelector).evaluate((hero) => hero.getBoundingClientRect().height);
            expect(Math.abs(finalHeight - reservedHeight)).toBeLessThanOrEqual(0.5);
            const frames = await frameTracker.evaluate((state) => state.frames);
            const arrivalFrames = frames.filter((frame) => frame.phase === "arrival");
            expect(arrivalFrames.length).toBeGreaterThan(2);
            expect(frames.every((frame) => frame.sameImage && frame.imageCount === 1)).toBe(true);
            expect(arrivalFrames.every((frame) => frame.visible && frame.decoded && frame.opacity > 0)).toBe(true);
            expect(new Set(arrivalFrames.map((frame) => frame.source)).size).toBe(1);
            const travel = Math.max(
                ...arrivalFrames.map((frame) => Math.abs(frame.y - arrivalFrames[0].y)),
                ...arrivalFrames.map((frame) => Math.abs(frame.width - arrivalFrames[0].width)),
            );
            expect(travel).toBeGreaterThan(5);
            for (const dimension of ["headerX", "headerY", "headerWidth", "headerHeight"] as const) {
                expect(Math.max(...frames.map((frame) => Math.abs(frame[dimension] - frames[0][dimension])))).toBeLessThanOrEqual(0.5);
            }
            expect(await frameTracker.evaluate((state) => (
                state.originalImage === document.querySelector("[data-hero-characters] img")
            ))).toBe(true);
            await expectHeroComposition(page);
            expect(errors).toEqual([]);
            await frameTracker.dispose();
        } finally {
            release();
        }
    });

    for (const viewport of viewports) {
        test(`${viewport.width}×${viewport.height}: preserves final layout and skips a completed session`, async ({ page }, testInfo) => {
            await page.setViewportSize(viewport);
            await trackOverlay(page);
            await page.goto("/mobile-preview");
            await expectReady(page);
            expect(await page.evaluate(() => Reflect.get(window, "__mobileIntroSeen"))).toBe(true);
            const arrived = await expectHeroComposition(page);
            if (viewport.width === 375 || viewport.width === 430) {
                const path = testInfo.outputPath(`mobile-hero-${viewport.width}.png`);
                await page.locator("[data-mobile-header]").locator("..").screenshot({ path, animations: "disabled" });
                await testInfo.attach(`mobile-hero-${viewport.width}`, {
                    path,
                    contentType: "image/png",
                });
            }
            await page.reload();
            await expectReady(page);
            expect(await page.evaluate(() => Reflect.get(window, "__mobileIntroSeen"))).toBe(false);
            const revisited = await expectHeroComposition(page);
            for (let index = 0; index < arrived.length; index++) {
                expect(revisited[index].name).toBe(arrived[index].name);
                for (const dimension of ["x", "y", "width", "height"] as const) {
                    expect(Math.abs(revisited[index][dimension] - arrived[index][dimension])).toBeLessThanOrEqual(0.5);
                }
                expect(revisited[index].opacity).toBe(arrived[index].opacity);
                expect(revisited[index].transform).toBe(arrived[index].transform);
                expect(revisited[index].position).toBe(arrived[index].position);
            }
        });
    }

    test("finishes when sessionStorage is unavailable", async ({ page }) => {
        await page.addInitScript(() => {
            Object.defineProperty(window, "sessionStorage", {
                get() { throw new DOMException("Storage is blocked", "SecurityError"); },
            });
        });
        const release = await holdHeroImage(page);
        try {
            await page.goto("/mobile-preview", { waitUntil: "domcontentloaded" });
            await expect(page.locator("[data-mobile-intro]")).toHaveAttribute("data-phase", "loading");
            release();
            await expectReady(page);
            await expectHeroComposition(page);
        } finally {
            release();
        }
    });

    test("shows the final Hero immediately for reduced motion without a transient overlay", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await trackOverlay(page);
        await page.goto("/mobile-preview");
        await expectReady(page);
        expect(await page.evaluate(() => Reflect.get(window, "__mobileIntroSeen"))).toBe(false);
        await expectHeroComposition(page);
    });

    test("releases the page after an image failure without storing completion", async ({ page }) => {
        await page.route((url) => url.href.includes("hero-handshake"), (route) => route.abort());
        await page.goto("/mobile-preview", { waitUntil: "domcontentloaded" });
        await expectReady(page);
        expect(await page.evaluate((key) => sessionStorage.getItem(key), completionKey)).toBeNull();
        await page.getByRole("button", { name: "Open menu", exact: true }).click();
        await expect(page.getByRole("dialog", { name: "Main navigation" })).toBeVisible();
    });

    test("keeps the header menu available while loading and cancels the intro on interaction", async ({ page }) => {
        const release = await holdHeroImage(page);
        try {
            await page.goto("/mobile-preview", { waitUntil: "domcontentloaded" });
            await expect(page.locator("[data-mobile-intro]")).toHaveAttribute("data-phase", "loading");
            await expect(page.locator(heroSelector)).toHaveAttribute("inert", "");
            const openMenu = page.getByRole("button", { name: "Open menu", exact: true });
            await expect(openMenu).toBeEnabled();
            await openMenu.click();
            const menu = page.getByRole("dialog", { name: "Main navigation" });
            await expect(menu).toBeVisible();
            await expect(page.locator("[data-mobile-intro]")).toHaveCount(0);
            await expect(page.locator(heroSelector)).toHaveAttribute("data-mobile-intro-state", "ready");
            await expect(page.locator("[data-mobile-section][inert]")).toHaveCount(0);
            await expect(page.locator("[data-mobile-footer]")).not.toHaveAttribute("inert", "");
            await expect(page.locator("#mobile-main")).not.toHaveAttribute("aria-busy", "true");
            await page.getByRole("button", { name: "Close menu", exact: true }).click();
            await expect(menu).toBeHidden();
            await expectReady(page);
            release();
            await expectHeroComposition(page);
            expect(await page.evaluate((key) => sessionStorage.getItem(key), completionKey)).toBeNull();
            await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
        } finally {
            release();
        }
    });

    test("times out a stalled image and ignores its late completion", async ({ page }) => {
        const release = await holdHeroImage(page);
        try {
            await page.goto("/mobile-preview", { waitUntil: "domcontentloaded" });
            await expect(page.locator("[data-mobile-intro]")).toHaveAttribute("data-phase", "loading");
            await expectReady(page, 12_000);
            expect(await page.evaluate((key) => sessionStorage.getItem(key), completionKey)).toBeNull();
            await expect(page.locator(`${heroSelector} a[href$="/contact"]`)).toBeEnabled();
            release();
            await expectHeroComposition(page);
            await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
            await expect(page.locator("[data-mobile-intro]")).toHaveCount(0);
            expect(await page.evaluate((key) => sessionStorage.getItem(key), completionKey)).toBeNull();
        } finally {
            release();
        }
    });

    test("aborts safely when the viewport rotates during arrival", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const release = await holdHeroImage(page);
        try {
            await page.goto("/mobile-preview", { waitUntil: "domcontentloaded" });
            await expect(page.locator("[data-mobile-intro]")).toHaveAttribute("data-phase", "loading");
            release();
            await expect(page.locator("[data-mobile-intro]")).toHaveAttribute("data-phase", "arrival");
            await page.setViewportSize({ width: 844, height: 390 });
            await expectReady(page);
            expect(await page.evaluate((key) => sessionStorage.getItem(key), completionKey)).toBeNull();
            await expectNoOverflow(page);
            await page.setViewportSize({ width: 390, height: 844 });
            await expectReady(page);
            await expectHeroComposition(page);
        } finally {
            release();
        }
    });

    test("honors a reduced motion preference enabled during arrival", async ({ page }) => {
        const release = await holdHeroImage(page);
        try {
            await page.goto("/mobile-preview", { waitUntil: "domcontentloaded" });
            await expect(page.locator("[data-mobile-intro]")).toHaveAttribute("data-phase", "loading");
            release();
            await expect(page.locator("[data-mobile-intro]")).toHaveAttribute("data-phase", "arrival");
            await page.emulateMedia({ reducedMotion: "reduce" });
            await expectReady(page);
            expect(await page.evaluate((key) => sessionStorage.getItem(key), completionKey)).toBeNull();
            await expectHeroComposition(page);
        } finally {
            release();
        }
    });

    test("restores scrolling, menu navigation, and the Hero contact action without replaying", async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await trackOverlay(page);
        await page.goto("/mobile-preview");
        await expectReady(page);
        await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
        await expectReady(page);
        expect(await page.evaluate(() => Reflect.get(window, "__mobileIntroCount"))).toBe(1);
        await page.getByRole("button", { name: "Open menu", exact: true }).click();
        const menu = page.getByRole("dialog", { name: "Main navigation" });
        await expect(menu).toBeVisible();
        await page.getByRole("button", { name: "Close menu", exact: true }).click();
        await expect(menu).toBeHidden();
        await expect(page.locator("#mobile-main")).not.toHaveAttribute("inert", "");
        await page.locator(`${heroSelector} a[href="/en/contact"]`).click();
        await expect(page).toHaveURL(/\/en\/contact$/);
        await page.goBack();
        await expectReady(page);
        await page.getByRole("button", { name: "Open menu", exact: true }).click();
        await page.getByRole("dialog", { name: "Main navigation" }).getByRole("link", { name: /Services/ }).click();
        await expect(page).toHaveURL(/\/en\/services$/);
        await page.goBack();
        await expectReady(page);
    });
});

