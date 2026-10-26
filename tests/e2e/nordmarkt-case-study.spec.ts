import { expect, test } from "@playwright/test";
import { projectClassificationLabels, projects } from "../../content/projects";
import { translator } from "../../i18n/getDictionary";
import type { Project } from "../../types/services";

const allProjects: readonly Project[] = projects;
const project = allProjects.find(({ slug }) => slug === "nordmarkt-commerce")!;
const gallery = project.caseStudy.gallery!;
const viewports = [
    { name: "desktop-1920", width: 1920, height: 1080 },
    { name: "desktop", width: 1440, height: 900 },
    { name: "compact-desktop", width: 1280, height: 800 },
    { name: "short-desktop", width: 1440, height: 760 },
    { name: "low-desktop", width: 1280, height: 700 },
    { name: "tablet-landscape", width: 1024, height: 768 },
    { name: "tablet", width: 900, height: 1024 },
    { name: "mobile", width: 390, height: 844 },
];

for (const locale of ["en", "de"] as const) {
    for (const viewport of viewports) {
        test(`${locale} NORDMARKT ${viewport.name}: archive diagram, five-view gallery, captions and contact CTA`, async ({ page }, testInfo) => {
            test.skip(testInfo.project.name !== "chromium-desktop", "Explicit viewports are covered once in the desktop browser project.");
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            const t = translator(locale);

            await page.goto(`/${locale}/projects/nordmarkt-commerce`);
            await expect(page.getByRole("dialog")).toHaveCount(0);
            const canonical = page.locator('[data-project-case-study-variant="page"]');
            await expect(canonical.getByRole("heading", { level: 1 })).toHaveText(project.title);
            await expect(canonical.locator("img")).toHaveCount(5);
            for (const slide of gallery) {
                await expect(canonical.getByRole("img", { name: slide.media.alt[locale], exact: true })).toHaveCount(1);
                await expect(canonical).toContainText(slide.description[locale]);
            }
            expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);

            await page.goto(`/${locale}`);
            const cinematicViewport = viewport.width >= 1280 && viewport.height >= 800;
            if (cinematicViewport) {
                await expect(page.locator("html")).toHaveAttribute("data-cinematic-runtime", "ready");
            }

            // Restored archive preview: technical diagram + technology labels, never a gallery screenshot.
            const card = page.locator('[data-archive-card]').filter({ has: page.locator("#project-modal-trigger-nordmarkt-commerce") }).first();
            await card.scrollIntoViewIfNeeded();
            await expect(card.locator('[data-project-visual-scene="nordmarkt"] svg:visible').first()).toBeVisible();
            await expect(card.locator('img[src*="/images/projects/nordmarkt/"]')).toHaveCount(0);
            for (const technology of project.technologies) {
                await expect(card.getByRole("img", { name: technology, exact: true }).first()).toBeAttached();
            }

            await page.locator("#project-modal-trigger-nordmarkt-commerce").click();
            const dialog = page.getByRole("dialog");
            await expect(dialog).toBeVisible();
            await expect(dialog).toContainText(projectClassificationLabels.studio_concept[locale]);
            await expect(dialog).toContainText(project.description[locale]);
            await expect(dialog).toContainText(project.caseStudy.capabilitiesNote![locale]);
            for (const group of project.caseStudy.featureGroups!) {
                for (const item of group.items) await expect(dialog).toContainText(item[locale]);
            }
            await expect(dialog.locator("[data-project-technology]")).toHaveCount(project.technologies.length);
            await expect(dialog.getByRole("heading", { name: t("Proposed stack"), exact: true })).toHaveCount(1);
            await expect(dialog.getByRole("heading", { name: t("Performance Audit"), exact: true })).toHaveCount(0);

            const frame = dialog.locator("[data-project-gallery]");
            const caption = dialog.locator("[data-project-gallery-caption]");
            await expect(frame).toHaveAttribute("data-gallery-count", "5");

            // Widescreen frame: ~16:9 and the full content width of the left column.
            const geometry = await frame.evaluate((element) => {
                const panel = element.closest("[data-project-modal-panel]") as HTMLElement;
                const style = getComputedStyle(panel);
                const content = panel.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
                const box = element.getBoundingClientRect();
                return { ratio: box.width / box.height, width: box.width, content };
            });
            expect(Math.abs(geometry.ratio - 16 / 9)).toBeLessThan(0.02);
            expect(geometry.width).toBeGreaterThanOrEqual(geometry.content - 2);

            for (const [index, slide] of gallery.entries()) {
                await expect(frame).toHaveAttribute("data-gallery-index", String(index));
                await expect(caption).toContainText(slide.title[locale]);
                await expect(caption).toContainText(slide.description[locale]);
                const image = frame.getByRole("img", { name: slide.media.alt[locale], exact: true });
                await expect(image).toBeVisible();
                await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);

                // The frame matches the asset ratio, so the contained image fills it: no side gaps, no crop.
                const fit = await image.evaluate((element: HTMLImageElement) => {
                    const box = element.getBoundingClientRect();
                    const frameRatio = box.width / box.height;
                    return { frameRatio, imageRatio: element.naturalWidth / element.naturalHeight, fit: getComputedStyle(element).objectFit };
                });
                expect(fit.fit).toBe("contain");
                expect(Math.abs(fit.frameRatio - fit.imageRatio)).toBeLessThan(0.02);

                await frame.getByRole("button", { name: t("Show next project image") }).click();
            }
            await expect(frame).toHaveAttribute("data-gallery-index", "0");
            await frame.focus();
            await page.keyboard.press("ArrowLeft");
            await expect(frame).toHaveAttribute("data-gallery-index", "4");
            await expect(caption).toContainText(gallery[4].title[locale]);
            await frame.getByRole("button", { name: t("Show image {index} of {count}", { index: 1, count: 5 }) }).click();
            await expect(frame).toHaveAttribute("data-gallery-index", "0");

            if (viewport.name === "mobile") {
                await frame.evaluate((element) => {
                    const start = new Event("touchstart", { bubbles: true });
                    Object.defineProperty(start, "touches", { value: [{ clientX: 280 }] });
                    element.dispatchEvent(start);
                    const end = new Event("touchend", { bubbles: true });
                    Object.defineProperty(end, "changedTouches", { value: [{ clientX: 120 }] });
                    element.dispatchEvent(end);
                });
                await expect(frame).toHaveAttribute("data-gallery-index", "1");
            }

            const panels = dialog.locator("[data-project-modal-panel]");
            const dimensions = await panels.evaluateAll((elements) => elements.map((panel) => ({
                width: panel.clientWidth,
                scrollWidth: panel.scrollWidth,
                height: panel.clientHeight,
                scrollHeight: panel.scrollHeight,
            })));
            for (const panel of dimensions) expect(panel.scrollWidth).toBeLessThanOrEqual(panel.width + 1);

            const cta = dialog.getByRole("link", { name: project.caseStudy.commercialCta!.label[locale], exact: true });
            await expect(cta).toHaveAttribute("href", `/${locale}/contact?project=nordmarkt-commerce`);
            const cinematic = await page.locator("html").getAttribute("data-cinematic-runtime") === "ready";
            if (cinematic) {
                // Wheel input is locked while the cinematic runtime runs, so both panels must fit.
                for (const panel of dimensions) expect(panel.scrollHeight).toBeLessThanOrEqual(panel.height + 1);
            } else {
                await cta.scrollIntoViewIfNeeded();
            }
            await expect(cta).toBeInViewport();
            await cta.click();
            await expect(page).toHaveURL(new RegExp(`/${locale}/contact\\?project=nordmarkt-commerce$`, "u"));
        });
    }
}

test("other archive cases keep their gallery and layout", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium-desktop", "Desktop only.");
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const other of allProjects.filter(({ slug }) => slug !== "nordmarkt-commerce")) {
        await page.goto(`/en/projects/${other.slug}`);
        await page.goto("/en");
        const trigger = page.locator(`#project-modal-trigger-${other.slug}`);
        await trigger.scrollIntoViewIfNeeded();
        await trigger.click();
        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();
        await expect(dialog.locator("[data-project-gallery-caption]")).toHaveCount(0);
        await expect(dialog.locator("[data-project-gallery]")).toHaveAttribute("data-gallery-count", String(other.images.length + (other.coverImage ? 1 : 0)));
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
    }
});
