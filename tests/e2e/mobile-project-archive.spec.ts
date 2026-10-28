import { mkdir } from "node:fs/promises";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { getFeaturedProjects } from "../../content/projects";
import { translator } from "../../i18n/getDictionary";
import type { Project } from "../../types/services";

const archiveProjects = getFeaturedProjects();
const pixardia = archiveProjects.find(({ slug }) => slug === "pixardia-digital-studio")!;
const nordmarkt = archiveProjects.find(({ slug }) => slug === "nordmarkt-commerce")!;
const t = translator("en");
const screenshotDirectory = "/tmp/pixardia-mobile-archive";
const viewports = [
    { width: 375, height: 667 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
];

function modal(page: Page) {
    return page.locator("[data-mobile-project-modal]");
}

async function revealProject(page: Page, project: Project) {
    const archive = page.locator('[data-mobile-section="archive"]');
    const trigger = archive.locator(`#project-modal-trigger-${project.slug}`);
    while (await trigger.count() === 0) {
        await archive.getByRole("button", { name: t("Show more"), exact: true }).click();
    }
    await trigger.scrollIntoViewIfNeeded();
    await expect(trigger).toBeInViewport();
    return trigger;
}

async function openProject(page: Page, project: Project) {
    const trigger = await revealProject(page, project);
    await trigger.click();
    const dialog = modal(page);
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog.locator("[data-mobile-project-content]")).toHaveAttribute("data-project-slug", project.slug);
    await expect(dialog.getByRole("heading", { level: 1 })).toContainText(project.title);
    await expect(dialog.locator("[data-project-gallery]")).toHaveAttribute("data-gallery-index", "0");
    await expect.poll(() => dialog.locator("[data-mobile-project-scroll]").evaluate((element) => element.scrollTop)).toBe(0);
    return { dialog, trigger };
}

async function expectNoOverflow(page: Page) {
    const dimensions = await page.evaluate(() => [
        document.documentElement,
        document.querySelector("[data-mobile-project-modal]")!,
        document.querySelector("[data-mobile-project-scroll]")!,
        document.querySelector("[data-mobile-project-content]")!,
    ].map((element) => ({ clientWidth: element.clientWidth, scrollWidth: element.scrollWidth })));
    for (const size of dimensions) expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth + 1);
}

async function saveScreenshot(page: Page, name: string) {
    await mkdir(screenshotDirectory, { recursive: true });
    await page.screenshot({ path: `${screenshotDirectory}/${name}.png`, animations: "disabled", scale: "css" });
}

async function expectProjectContent(dialog: Locator, project: Project) {
    await expect(dialog).toContainText(project.caseStudy.identifier);
    await expect(dialog).toContainText(project.caseStudy.subtitle.en);
    await expect(dialog).toContainText(project.description.en);
    if (project.challenge) await expect(dialog).toContainText(project.challenge.en);
    if (project.solution) await expect(dialog).toContainText(project.solution.en);
    if (project.caseStudy.category) await expect(dialog).toContainText(project.caseStudy.category.en);
    if (project.caseStudy.role) await expect(dialog).toContainText(project.caseStudy.role.en);
    if (project.caseStudy.engagement) await expect(dialog).toContainText(project.caseStudy.engagement.en);
    if (project.caseStudy.architecture) await expect(dialog).toContainText(project.caseStudy.architecture.en);
    if (project.caseStudy.capabilitiesNote) await expect(dialog).toContainText(project.caseStudy.capabilitiesNote.en);
    for (const capability of project.caseStudy.capabilities ?? []) await expect(dialog).toContainText(capability.en);
    for (const group of project.caseStudy.featureGroups ?? []) {
        await expect(dialog).toContainText(group.label.en);
        for (const item of group.items) await expect(dialog).toContainText(item.en);
    }
    for (const item of project.caseStudy.scope ?? []) await expect(dialog).toContainText(item.en);
    for (const fact of project.caseStudy.facts ?? []) {
        await expect(dialog).toContainText(fact.label.en);
        await expect(dialog).toContainText(fact.value.en);
    }
    for (const technology of project.technologies) await expect(dialog).toContainText(technology);
    await expect(dialog).toContainText(project.caseStudy.visualSystem.typeface);
    for (const color of project.caseStudy.visualSystem.colors) await expect(dialog).toContainText(color.value);
    if (project.caseStudy.commercialCta) {
        await expect(dialog.getByRole("link", { name: project.caseStudy.commercialCta.label.en, exact: true }))
            .toHaveAttribute("href", `/en${project.caseStudy.commercialCta.href}`);
    }
}

async function swipe(page: Page, gallery: Locator, horizontal: boolean) {
    const box = await gallery.boundingBox();
    expect(box).not.toBeNull();
    const start = { x: box!.x + box!.width * 0.75, y: box!.y + box!.height * 0.7 };
    const end = horizontal
        ? { x: box!.x + box!.width * 0.25, y: start.y - 4 }
        : { x: start.x - 50, y: box!.y + box!.height * 0.15 };
    const session = await page.context().newCDPSession(page);
    try {
        await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
        for (let step = 1; step <= 6; step++) {
            await session.send("Input.dispatchTouchEvent", {
                type: "touchMove",
                touchPoints: [{
                    x: start.x + (end.x - start.x) * step / 6,
                    y: start.y + (end.y - start.y) * step / 6,
                }],
            });
        }
        await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    } finally {
        await session.detach();
    }
}

test.describe("mobile project archive modal", () => {
    test.beforeEach(async ({ page }, testInfo) => {
        test.skip(!testInfo.project.name.includes("mobile"), "The dedicated modal belongs to mobile-preview.");
        await page.addInitScript(() => sessionStorage.setItem("pixardia:mobile-intro:complete", "1"));
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto("/mobile-preview");
    });

    test("opens Pixardia locally, scrolls its complete case study and restores the same archive position", async ({ page, browserName }) => {
        const trigger = await revealProject(page, pixardia);
        const main = await page.locator("#mobile-main").elementHandle();
        const before = await page.evaluate(() => ({ url: location.href, history: history.length, scrollY }));
        await trigger.click();
        const dialog = modal(page);
        await expect(dialog).toBeVisible();
        await expectProjectContent(dialog, pixardia);
        expect(await page.evaluate(() => ({ url: location.href, history: history.length })))
            .toEqual({ url: before.url, history: before.history });
        expect(await main!.evaluate((element) => element === document.querySelector("#mobile-main"))).toBe(true);
        await saveScreenshot(page, "pixardia-390-initial");
        const scroller = dialog.locator("[data-mobile-project-scroll]");
        await scroller.evaluate((element) => { element.scrollTop = element.scrollHeight / 2; });
        await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBeGreaterThan(200);
        await saveScreenshot(page, "pixardia-390-middle");
        await scroller.evaluate((element) => { element.scrollTop = element.scrollHeight; });
        await expect.poll(() => scroller.evaluate((element) => Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop))).toBeLessThanOrEqual(1);
        const header = dialog.locator("[data-mobile-project-header]");
        await expect(header).toBeInViewport();
        await expect(dialog.getByRole("button", { name: t("Close project dialog"), exact: true })).toBeInViewport();
        await expectNoOverflow(page);
        await saveScreenshot(page, "pixardia-390-bottom");
        const locked = await page.locator("#mobile-main").evaluate((element) => element.getBoundingClientRect().top);
        if (browserName === "webkit") {
            await page.keyboard.press("PageDown");
        } else {
            await page.mouse.move(5, 5);
            await page.mouse.wheel(0, 800);
        }
        expect(await page.locator("#mobile-main").evaluate((element) => element.getBoundingClientRect().top)).toBeCloseTo(locked, 0);
        await dialog.getByRole("button", { name: t("Close project dialog"), exact: true }).click();
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(before.scrollY, 0);
        expect(await page.evaluate(() => ({ url: location.href, history: history.length })))
            .toEqual({ url: before.url, history: before.history });
        expect(await main!.evaluate((element) => element.isConnected)).toBe(true);
        await main!.dispose();
    });

    test("keeps gallery images, captions, counter, keyboard and directional touch gestures in sync", async ({ page }) => {
        const { dialog } = await openProject(page, pixardia);
        const gallery = dialog.locator("[data-project-gallery]");
        const caption = dialog.locator("[data-project-gallery-caption]");
        const slides = pixardia.caseStudy.gallery!;
        await expect(gallery).toHaveAttribute("data-gallery-count", String(slides.length));
        for (const [index, slide] of slides.entries()) {
            await expect(gallery).toHaveAttribute("data-gallery-index", String(index));
            await expect(caption).toContainText(slide.title.en);
            await expect(caption).toContainText(slide.description.en);
            const image = gallery.getByRole("img", { name: slide.media.alt.en, exact: true });
            await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
            await expect(image).toHaveCSS("object-fit", "contain");
            await dialog.getByRole("button", { name: t("Show next project image"), exact: true }).click();
        }
        await expect(gallery).toHaveAttribute("data-gallery-index", "0");
        await dialog.getByRole("button", { name: t("Show previous project image"), exact: true }).click();
        await expect(gallery).toHaveAttribute("data-gallery-index", String(slides.length - 1));
        await gallery.focus();
        await page.keyboard.press("ArrowRight");
        await expect(gallery).toHaveAttribute("data-gallery-index", "0");
        await swipe(page, gallery, true);
        await expect(gallery).toHaveAttribute("data-gallery-index", "1");
        await expect(caption).toContainText(slides[1].title.en);
        await saveScreenshot(page, "pixardia-390-gallery-second-image");
        await swipe(page, gallery, false);
        await expect(gallery).toHaveAttribute("data-gallery-index", "1");
        await expect.poll(() => dialog.locator("[data-mobile-project-scroll]").evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    });

    test("loads each archive record independently and preserves revealed cards across close and reopen", async ({ page }) => {
        test.setTimeout(60_000);
        for (const project of archiveProjects) {
            const trigger = await revealProject(page, project);
            const scrollBefore = await page.evaluate(() => window.scrollY);
            await trigger.click();
            const dialog = modal(page);
            await expect(dialog).toBeVisible();
            await expect(dialog.locator("[data-mobile-project-content]")).toHaveAttribute("data-project-slug", project.slug);
            await expectProjectContent(dialog, project);
            const gallery = dialog.locator("[data-project-gallery]");
            await expect(gallery).toHaveAttribute("data-gallery-count", String(project.caseStudy.gallery!.length));
            await expect(gallery).toHaveAttribute("data-gallery-index", "0");
            await expect(dialog.locator("[data-project-gallery-caption]")).toContainText(project.caseStudy.gallery![0].title.en);
            if (project.slug === nordmarkt.slug) await saveScreenshot(page, "nordmarkt-390-initial");
            await dialog.getByRole("button", { name: t("Show next project image"), exact: true }).click();
            await expect(gallery).toHaveAttribute("data-gallery-index", "1");
            await page.keyboard.press("Escape");
            await expect(dialog).toHaveCount(0);
            await expect(trigger).toBeFocused();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(scrollBefore, 0);
        }
        await expect(page.locator('[data-mobile-section="archive"] [data-archive-card]')).toHaveCount(archiveProjects.length);
        const { dialog } = await openProject(page, pixardia);
        await expect(dialog.locator("[data-project-gallery]")).toHaveAttribute("data-gallery-index", "0");
        await expect(page).toHaveURL(/\/mobile-preview$/);
    });

    test("traps keyboard focus, supports Escape and follows the real enquiry CTA", async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        const { dialog, trigger } = await openProject(page, nordmarkt);
        const close = dialog.getByRole("button", { name: t("Close project dialog"), exact: true });
        await close.focus();
        await page.keyboard.press("Shift+Tab");
        expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
        await page.keyboard.press("Tab");
        await expect(close).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await trigger.click();
        await expect(dialog).toBeVisible();
        const cta = dialog.getByRole("link", { name: nordmarkt.caseStudy.commercialCta!.label.en, exact: true });
        await cta.scrollIntoViewIfNeeded();
        await cta.click();
        await expect(page).toHaveURL(/\/en\/contact\?project=nordmarkt-commerce$/);
        await expect(modal(page)).toHaveCount(0);
        expect(await page.evaluate(() => document.body.style.position)).toBe("");
        expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
    });

    for (const viewport of viewports) {
        test(`${viewport.width}px: fits the viewport with a readable gallery and accessible header throughout scrolling`, async ({ page }) => {
            await page.setViewportSize(viewport);
            const { dialog } = await openProject(page, nordmarkt);
            await expectNoOverflow(page);
            const wordFragments = await dialog.getByRole("heading", { level: 1 }).evaluate((element) => {
                const node = element.firstChild!;
                return Array.from(element.textContent!.matchAll(/\S+/g), (match) => {
                    const range = document.createRange();
                    range.setStart(node, match.index!);
                    range.setEnd(node, match.index! + match[0].length);
                    return range.getClientRects().length;
                });
            });
            expect(wordFragments.every((count) => count === 1)).toBe(true);
            const bounds = await dialog.boundingBox();
            expect(bounds!.width).toBeCloseTo(viewport.width, 0);
            expect(bounds!.height).toBeCloseTo(viewport.height, 0);
            const image = dialog.locator("[data-project-gallery] img");
            await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
            const geometry = await image.evaluate((element: HTMLImageElement) => {
                const frame = element.closest("[data-project-gallery]")!.getBoundingClientRect();
                return { width: frame.width, height: frame.height, ratio: element.naturalWidth / element.naturalHeight };
            });
            expect(geometry.width).toBeGreaterThan(viewport.width * 0.8);
            expect(Math.abs(geometry.width / geometry.height - geometry.ratio)).toBeLessThan(0.03);
            const close = dialog.getByRole("button", { name: t("Close project dialog"), exact: true });
            expect((await close.boundingBox())!.height).toBeGreaterThanOrEqual(44);
            await saveScreenshot(page, `nordmarkt-${viewport.width}-initial`);
            await dialog.locator("[data-mobile-project-scroll]").evaluate((element) => { element.scrollTop = element.scrollHeight; });
            await expect(close).toBeInViewport();
            await expectNoOverflow(page);
            await page.setViewportSize({ width: viewport.width, height: viewport.height - 100 });
            await expect(close).toBeInViewport();
            await expectNoOverflow(page);
            await close.click();
            await expect(dialog).toHaveCount(0);
        });
    }
});

test("desktop project pages keep the canonical localized content and gallery", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium-desktop", "Desktop smoke coverage runs once.");
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const locale of ["en", "de"] as const) {
        for (const project of [pixardia, nordmarkt]) {
            await page.goto(`/${locale}/projects/${project.slug}`);
            const content = page.locator('[data-project-case-study-variant="page"]');
            await expect(content.getByRole("heading", { level: 1 })).toHaveText(project.title);
            await expect(content).toContainText(project.description[locale]);
            await expect(content).toContainText(project.challenge![locale]);
            await expect(content).toContainText(project.solution![locale]);
            await expect(page.getByRole("dialog")).toHaveCount(0);
            for (const slide of project.caseStudy.gallery!) {
                await expect(content.getByRole("img", { name: slide.media.alt[locale], exact: true })).toHaveCount(1);
                await expect(content).toContainText(slide.description[locale]);
            }
        }
    }
});

test("desktop intercepted case studies retain their existing panels, localized gallery and close behavior", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium-desktop", "Desktop intercepted dialogs are covered once.");
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const locale of ["en", "de"] as const) {
        const labels = translator(locale);
        await page.goto(`/${locale}/projects`);
        const trigger = page.locator(`#project-modal-trigger-${pixardia.slug}`);
        await trigger.scrollIntoViewIfNeeded();
        await trigger.click();
        await expect(page).toHaveURL(new RegExp(`/${locale}/projects/${pixardia.slug}$`));
        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();
        await expect(modal(page)).toHaveCount(0);
        await expect(dialog.locator('[data-project-case-study-variant="modal"]')).toHaveAttribute("data-project-slug", pixardia.slug);
        const panels = dialog.locator("[data-project-modal-panel]");
        await expect(panels).toHaveCount(2);
        for (const panel of await panels.all()) await expect(panel).toHaveCSS("background-color", "rgb(252, 252, 252)");
        const gallery = dialog.locator("[data-project-gallery]");
        const caption = dialog.locator("[data-project-gallery-caption]");
        const slides = pixardia.caseStudy.gallery!;
        await expect(gallery).toHaveAttribute("data-gallery-count", String(slides.length));
        await expect(gallery).toHaveAttribute("data-gallery-index", "0");
        await expect(caption).toContainText(slides[0].title[locale]);
        await expect(caption).toContainText(slides[0].description[locale]);
        await gallery.getByRole("button", { name: labels("Show next project image"), exact: true }).click();
        await expect(gallery).toHaveAttribute("data-gallery-index", "1");
        await expect(caption).toContainText(slides[1].title[locale]);
        await expect(caption).toContainText(slides[1].description[locale]);
        await expect(gallery.getByRole("img", { name: slides[1].media.alt[locale], exact: true })).toBeVisible();
        await gallery.getByRole("button", { name: labels("Show previous project image"), exact: true }).click();
        await expect(gallery).toHaveAttribute("data-gallery-index", "0");
        await expect(caption).toContainText(slides[0].title[locale]);
        await dialog.getByRole("button", { name: labels("Close project dialog"), exact: true }).click();
        await expect(dialog).toHaveCount(0);
        await expect(page).toHaveURL(new RegExp(`/${locale}/projects$`));
        await expect(trigger).toBeFocused();
    }
});
