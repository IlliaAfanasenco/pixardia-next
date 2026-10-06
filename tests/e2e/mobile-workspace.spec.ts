import { expect, test } from "@playwright/test";

test.describe("mobile workspace", () => {
    test("keeps the mobile composition isolated from the desktop runtime", async ({
                                                                                      page,
                                                                                  }, testInfo) => {
        test.skip(
            !testInfo.project.name.includes("mobile"),
            "mobile workspace is covered by the mobile project",
        );

        await page.setViewportSize({
            width: 430,
            height: 932,
        });

        await page.goto("/mobile-preview");

        await expect(page.locator("[data-mobile-header]")).toHaveCount(1);
        await expect(page.locator("[data-mobile-home]")).toHaveCount(1);
        await expect(page.locator("[data-mobile-footer]")).toHaveCount(1);
        await expect(page.locator("[data-mobile-section]")).toHaveCount(6);

        await expect(
            page.locator('[data-cinematic-runtime="ready"]'),
        ).toHaveCount(0);

        const hasHorizontalOverflow = await page.evaluate(() => {
            const root = document.documentElement;
            return root.scrollWidth > root.clientWidth + 1;
        });

        expect(hasHorizontalOverflow).toBe(false);
    });
});
