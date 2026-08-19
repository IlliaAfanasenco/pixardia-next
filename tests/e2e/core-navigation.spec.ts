import {
    expect,
    test,
} from "@playwright/test";

const projectSlug =
    "pixardia-digital-studio";

test.describe(
    "core navigation",
    () => {
        test(
            "opens project as intercepted modal and restores homepage position",
            async ({ page }) => {
                await page.goto("/");

                const projectLink =
                    page.locator(
                        `a[href="/projects/${projectSlug}"]`,
                    ).first();

                await projectLink
                    .scrollIntoViewIfNeeded();

                await expect(
                    projectLink,
                ).toBeVisible();

                const beforeOpen =
                    await page.evaluate(
                        () => window.scrollY,
                    );

                await projectLink.click();

                await expect(
                    page,
                ).toHaveURL(
                    new RegExp(
                        `/projects/${projectSlug}$`,
                    ),
                );

                const dialog =
                    page.getByRole(
                        "dialog",
                    );

                await expect(
                    dialog,
                ).toBeVisible();

                await expect(
                    dialog.getByRole(
                        "heading",
                        {
                            level: 1,
                            name:
                                /pixardia digital studio/i,
                        },
                    ),
                ).toBeVisible();

                await expect(
                    dialog.getByText(
                        "Project overview",
                        {
                            exact: true,
                        },
                    ),
                ).toBeVisible();

                const closeButton =
                    dialog.getByRole(
                        "button",
                        {
                            name: /close/i,
                        },
                    );

                await expect(
                    closeButton,
                ).toBeVisible();

                await closeButton.click();

                await expect(
                    dialog,
                ).toBeHidden();

                await expect(
                    page,
                ).toHaveURL(
                    /\/$/,
                );

                const afterClose =
                    await page.evaluate(
                        () => window.scrollY,
                    );

                expect(
                    Math.abs(
                        afterClose -
                            beforeOpen,
                    ),
                ).toBeLessThan(
                    180,
                );
            },
        );

        test(
            "renders canonical project page on direct navigation",
            async ({ page }) => {
                await page.goto(
                    `/projects/${projectSlug}`,
                );

                await expect(
                    page.getByRole(
                        "heading",
                        {
                            level: 1,
                            name:
                                /pixardia digital studio/i,
                        },
                    ),
                ).toBeVisible();

                await expect(
                    page.getByText(
                        "Project overview",
                        {
                            exact: true,
                        },
                    ),
                ).toBeVisible();

                await expect(
                    page.getByRole(
                        "dialog",
                    ),
                ).toHaveCount(0);
            },
        );

        test(
            "returns a real 404 for an unknown route",
            async ({ page }) => {
                const response =
                    await page.goto(
                        "/this-route-does-not-exist-e2e",
                    );

                expect(
                    response,
                ).not.toBeNull();

                expect(
                    response?.status(),
                ).toBe(404);

                await expect(
                    page.locator(
                        "body",
                    ),
                ).toBeVisible();
            },
        );
    },
);

test.describe(
    "responsive foundation",
    () => {
        test(
            "homepage has no document-level horizontal overflow",
            async ({ page }) => {
                await page.goto("/");

                const dimensions =
                    await page.evaluate(
                        () => ({
                            scrollWidth:
                                document
                                    .documentElement
                                    .scrollWidth,

                            clientWidth:
                                document
                                    .documentElement
                                    .clientWidth,
                        }),
                    );

                expect(
                    dimensions.scrollWidth,
                ).toBeLessThanOrEqual(
                    dimensions.clientWidth +
                        2,
                );
            },
        );

        test(
            "project modal remains usable at the active viewport",
            async ({ page }) => {
                await page.goto("/");

                const projectLink =
                    page.locator(
                        `a[href="/projects/${projectSlug}"]`,
                    ).first();

                await projectLink
                    .scrollIntoViewIfNeeded();

                await expect(
                    projectLink,
                ).toBeVisible();

                await projectLink.click();

                const dialog =
                    page.getByRole(
                        "dialog",
                    );

                await expect(
                    dialog,
                ).toBeVisible();

                await expect(
                    dialog.getByRole(
                        "heading",
                        {
                            level: 1,
                            name:
                                /pixardia digital studio/i,
                        },
                    ),
                ).toBeVisible();
            },
        );
    },
);
