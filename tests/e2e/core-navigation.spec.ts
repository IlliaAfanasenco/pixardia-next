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
                            name: /pixardia/i,
                        },
                    ),
                ).toBeVisible();

                await expect(
                    dialog.getByText(
                        "Engine & Logic",
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

                await expect(
                    projectLink,
                ).toBeFocused();
            },
        );

        test(
            "loads project-specific modal data and closes with Escape",
            async ({ page }) => {
                await page.goto("/");

                const nexusLink =
                    page.locator(
                        'a[href="/projects/nexus-finance"]',
                    ).first();

                await nexusLink
                    .scrollIntoViewIfNeeded();

                await expect(
                    nexusLink,
                ).toBeVisible();

                await nexusLink.click();

                await expect(page).toHaveURL(
                    /\/projects\/nexus-finance$/,
                );

                const dialog =
                    page.getByRole("dialog");

                await expect(
                    dialog.getByRole(
                        "heading",
                        {
                            level: 1,
                            name: /nexus finance/i,
                        },
                    ),
                ).toBeVisible();

                await expect(
                    dialog.getByRole(
                        "button",
                        {
                            name:
                                "Show next project image",
                        },
                    ),
                ).toHaveCount(0);

                await expect(
                    dialog.getByText(
                        "#0B1020",
                        {
                            exact: false,
                        },
                    ),
                ).toBeVisible();

                await expect(
                    page.locator("html"),
                ).toHaveAttribute(
                    "data-project-modal-open",
                    "true",
                );

                await page.keyboard.press(
                    "Escape",
                );

                await expect(dialog).toBeHidden();
                await expect(nexusLink).toBeFocused();
            },
        );

        test(
            "supports project gallery controls, keyboard navigation and reset",
            async ({ page }) => {
                test.slow();

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

                await expect(page).toHaveURL(
                    new RegExp(
                        `/projects/${projectSlug}$`,
                    ),
                    {
                        timeout: 15_000,
                    },
                );

                const dialog =
                    page.getByRole("dialog");

                await expect(dialog).toBeVisible();

                const gallery =
                    dialog.locator(
                        "[data-project-gallery]",
                    );

                await expect(gallery).toHaveAttribute(
                    "data-gallery-count",
                    "3",
                );

                await expect(gallery).toHaveAttribute(
                    "data-gallery-index",
                    "0",
                );

                await dialog.getByRole(
                    "button",
                    {
                        name:
                            "Show next project image",
                    },
                ).click();

                await expect(gallery).toHaveAttribute(
                    "data-gallery-index",
                    "1",
                );

                await gallery.focus();
                await page.keyboard.press(
                    "ArrowRight",
                );

                await expect(gallery).toHaveAttribute(
                    "data-gallery-index",
                    "2",
                );

                await gallery.dispatchEvent(
                    "touchstart",
                    {
                        touches: [
                            {
                                identifier: 1,
                                clientX: 240,
                                clientY: 120,
                            },
                        ],
                    },
                );

                await gallery.dispatchEvent(
                    "touchend",
                    {
                        changedTouches: [
                            {
                                identifier: 1,
                                clientX: 80,
                                clientY: 120,
                            },
                        ],
                    },
                );

                await expect(gallery).toHaveAttribute(
                    "data-gallery-index",
                    "0",
                );

                await dialog.getByRole(
                    "button",
                    {
                        name: /close/i,
                    },
                ).click();

                await expect(dialog).toBeHidden();
                await expect(page).toHaveURL(/\/$/);

                await expect(
                    projectLink,
                ).toBeVisible();

                await projectLink.click();

                await expect(page).toHaveURL(
                    new RegExp(
                        `/projects/${projectSlug}$`,
                    ),
                    {
                        timeout: 15_000,
                    },
                );

                const reopenedGallery =
                    page.getByRole("dialog").locator(
                        "[data-project-gallery]",
                    );

                await expect(
                    reopenedGallery,
                ).toHaveAttribute(
                    "data-gallery-index",
                    "0",
                );
            },
        );

        test(
            "keeps technology tags neutral until hover or focus",
            async ({ page }, testInfo) => {
                const hasHover =
                    !testInfo.project.name.includes(
                        "mobile",
                    );

                await page.goto("/");

                await page.locator(
                    'a[href="/projects/nexus-finance"]',
                ).first().click();

                const tags = page
                    .getByRole("dialog")
                    .locator(
                        "[data-project-technology]",
                    );

                await expect(
                    tags.first(),
                ).toBeVisible();

                expect(
                    await tags.count(),
                ).toBeGreaterThan(1);

                const defaultColors =
                    await tags.evaluateAll(
                        (elements) =>
                            elements.map(
                                (element) => ({
                                    border:
                                        getComputedStyle(
                                            element,
                                        ).borderColor,
                                    text: getComputedStyle(
                                        element,
                                    ).color,
                                }),
                            ),
                    );

                expect(
                    new Set(
                        defaultColors.map(
                            (color) =>
                                `${color.border}/${color.text}`,
                        ),
                    ).size,
                ).toBe(1);

                const firstTag = tags.first();
                const secondTag = tags.nth(1);

                if (hasHover) {
                    await firstTag.hover();

                    const hoveredColor =
                        await firstTag.evaluate(
                            (element) =>
                                getComputedStyle(
                                    element,
                                ).color,
                        );

                    const neighbourColor =
                        await secondTag.evaluate(
                            (element) =>
                                getComputedStyle(
                                    element,
                                ).color,
                        );

                    expect(hoveredColor).not.toBe(
                        neighbourColor,
                    );
                }

                const closeButton = page
                    .getByRole("dialog")
                    .getByRole(
                        "button",
                        {
                            name: /close/i,
                        },
                    );

                await expect(
                    closeButton,
                ).toBeFocused();

                await page.keyboard.press("Tab");

                await expect(firstTag).toBeFocused();

                const focusedColor =
                    await firstTag.evaluate(
                        (element) =>
                            getComputedStyle(
                                element,
                            ).color,
                    );

                const unfocusedColor =
                    await secondTag.evaluate(
                        (element) =>
                            getComputedStyle(
                                element,
                            ).color,
                    );

                expect(focusedColor).not.toBe(
                    unfocusedColor,
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
                            name: /pixardia/i,
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
            "desktop modal panels fit without internal scrolling",
            async ({ page }) => {
                await page.goto("/");

                await page.locator(
                    `a[href="/projects/${projectSlug}"]`,
                ).first().click();

                for (const viewport of [
                    {
                        width: 1710,
                        height: 950,
                    },
                    {
                        width: 1512,
                        height: 820,
                    },
                    {
                        width: 1440,
                        height: 800,
                    },
                    {
                        width: 1280,
                        height: 720,
                    },
                ]) {
                    await page.setViewportSize(
                        viewport,
                    );

                    const panels =
                        await page.locator(
                            "[data-project-modal-panel]",
                        ).evaluateAll(
                            (elements) =>
                                elements.map(
                                    (element) => ({
                                        clientHeight:
                                            element
                                                .clientHeight,
                                        scrollHeight:
                                            element
                                                .scrollHeight,
                                        overflowY:
                                            getComputedStyle(
                                                element,
                                            ).overflowY,
                                    })),
                        );

                    for (const panel of panels) {
                        expect(
                            panel.scrollHeight,
                        ).toBeLessThanOrEqual(
                            panel.clientHeight,
                        );

                        expect(
                            panel.overflowY,
                        ).not.toMatch(
                            /auto|scroll|hidden/u,
                        );
                    }
                }
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
                            name: /pixardia/i,
                        },
                    ),
                ).toBeVisible();
            },
        );
    },
);
