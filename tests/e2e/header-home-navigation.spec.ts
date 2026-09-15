import {
    expect,
    test,
} from "@playwright/test";

test.describe("header home navigation", () => {
    test("returns from Archive to Hero through the desktop runtime or mobile anchor fallback", async ({
        page,
    }, testInfo) => {
        await page.setViewportSize({
            width: 1440,
            height: 900,
        });
        await page.goto("/en");

        const headerHomeLink = page
            .locator("header")
            .getByRole("link", {
                name: "Pixardia home",
            })
            .first();

        if (
            testInfo.project.name.includes(
                "mobile",
            )
        ) {
            const archiveSection =
                page.locator("#projects");

            await archiveSection
                .scrollIntoViewIfNeeded();

            await expect(
                archiveSection,
            ).toBeInViewport();

            await expect(
                page.locator(
                    "[data-cinematic-navigator]",
                ),
            ).toBeHidden();

            await headerHomeLink.click();

            await expect(page).toHaveURL(
                /\/en#hero$/,
            );

            await expect(
                page.locator(
                    '[data-cinematic-scene="hero"]',
                ),
            ).toBeInViewport();

            await expect
                .poll(async () =>
                    page.evaluate(
                        () => window.scrollY,
                    ),
                )
                .toBeLessThan(80);

            return;
        }

        const archiveControl = page.locator(
            '[data-cinematic-nav-target="archive"]',
        );

        await expect(archiveControl).toBeVisible();
        await archiveControl.click();

        await expect
            .poll(async () =>
                page.evaluate(
                    () =>
                        document.documentElement.dataset
                            .cinematicActive,
                ),
            )
            .toBe("archive");

        await expect(headerHomeLink).toBeVisible();
        await headerHomeLink.click();

        await expect
            .poll(async () =>
                page.evaluate(
                    () =>
                        document.documentElement.dataset
                            .cinematicActive,
                ),
            )
            .toBe("hero");

        await expect
            .poll(async () =>
                page.evaluate(() => window.scrollY),
            )
            .toBeLessThan(80);
    });
});
