import {
    expect,
    test,
} from "@playwright/test";

const mobileViewports = [
    {
        name: "small-phone",
        width: 360,
        height: 800,
    },
    {
        name: "phone",
        width: 390,
        height: 844,
    },
    {
        name: "figma-reference",
        width: 430,
        height: 932,
    },
    {
        name: "tablet-portrait",
        width: 768,
        height: 1024,
    },
    {
        name: "tablet-landscape",
        width: 1024,
        height: 768,
    },
];

test.describe(
    "mobile layout foundation",
    () => {
        for (const viewport of mobileViewports) {
            test(
                `${viewport.name}: stays in responsive document flow without horizontal overflow`,
                async ({ page }, testInfo) => {
                    test.skip(
                        !testInfo.project.name.includes("mobile"),
                        "Mobile layout contract runs only in the mobile browser project.",
                    );

                    await page.setViewportSize({
                        width: viewport.width,
                        height: viewport.height,
                    });

                    await page.goto("/en");

                    const hero =
                        page.locator(
                            '[data-cinematic-scene="hero"]',
                        );

                    await expect(
                        hero,
                    ).toBeVisible();

                    await expect(
                        page.locator(
                            "[data-cinematic-navigator]",
                        ),
                    ).toBeHidden();

                    await expect(
                        page.locator("html"),
                    ).not.toHaveAttribute(
                        "data-cinematic-runtime",
                        "ready",
                    );

                    const dimensions =
                        await page.evaluate(
                            () => ({
                                clientWidth:
                                document.documentElement.clientWidth,
                                scrollWidth:
                                document.documentElement.scrollWidth,
                            }),
                        );

                    expect(
                        dimensions.scrollWidth,
                    ).toBeLessThanOrEqual(
                        dimensions.clientWidth + 1,
                    );

                    const archive =
                        page.locator("#projects");

                    await archive
                        .scrollIntoViewIfNeeded();

                    await expect(
                        archive,
                    ).toBeInViewport();
                },
            );
        }
    },
);
