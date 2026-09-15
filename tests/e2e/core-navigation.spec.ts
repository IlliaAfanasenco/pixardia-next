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
            "uses cinematic navigation on desktop and document flow on mobile",
            async ({ page }, testInfo) => {
                await page.setViewportSize({
                    width: 1440,
                    height: 900,
                });

                await page.goto("/en");

                const navigator =
                    page.getByRole(
                        "navigation",
                        {
                            name:
                                "Homepage presentation scenes",
                        },
                    );

                if (
                    testInfo.project.name.includes(
                        "mobile",
                    )
                ) {
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

                    const heroScene =
                        page.locator(
                            '[data-cinematic-scene="hero"]',
                        );

                    await expect(
                        heroScene,
                    ).toBeVisible();

                    await expect(
                        heroScene,
                    ).not.toHaveAttribute(
                        "aria-hidden",
                        "",
                    );

                    const archiveSection =
                        page.locator("#projects");

                    await archiveSection
                        .scrollIntoViewIfNeeded();

                    await expect(
                        archiveSection,
                    ).toBeInViewport();

                    return;
                }

                await expect(
                    navigator,
                ).toBeVisible();

                await navigator.getByRole(
                    "button",
                    {
                        name: "Go to Expertise",
                    },
                ).click();

                await expect(
                    page.locator("html"),
                ).toHaveAttribute(
                    "data-cinematic-active",
                    "neural",
                    {
                        timeout: 10_000,
                    },
                );

                await navigator.getByRole(
                    "button",
                    {
                        name: "Go to Contact",
                    },
                ).click();

                await expect(
                    page.locator("html"),
                ).toHaveAttribute(
                    "data-cinematic-active",
                    "contact",
                    {
                        timeout: 10_000,
                    },
                );

                await expect(page).toHaveURL(/\/en$/);

                await navigator.getByRole(
                    "button",
                    {
                        name: "Go to Agency",
                    },
                ).click();

                await expect(
                    page.locator("html"),
                ).toHaveAttribute(
                    "data-cinematic-active",
                    "hero",
                    {
                        timeout: 10_000,
                    },
                );
            },
        );

        test(
            "opens project as intercepted modal and restores homepage position",
            async ({ page }, testInfo) => {
                await page.setViewportSize({
                    width: 1440,
                    height: 900,
                });

                await page.goto("/en");

                const projectLink =
                    page.locator(
                        `a[href="/en/projects/${projectSlug}"]`,
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

                const siteShell =
                    page.locator(
                        "[data-site-shell]",
                    );

                await expect(
                    siteShell,
                ).toHaveAttribute(
                    "inert",
                    "",
                );

                await expect(
                    siteShell,
                ).toHaveAttribute(
                    "aria-hidden",
                    "true",
                );

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

                const modalScrollStart =
                    await page.evaluate(
                        () => window.scrollY,
                    );

                await page.mouse.wheel(0, 1400);
                await page.keyboard.press(
                    "PageDown",
                );
                await page.keyboard.press(
                    "ArrowDown",
                );
                await page.waitForTimeout(250);

                const modalScrollAfterWheel =
                    await page.evaluate(
                        () => window.scrollY,
                    );

                expect(
                    Math.abs(
                        modalScrollAfterWheel -
                        modalScrollStart,
                    ),
                ).toBeLessThan(2);

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
                    /\/en$/,
                );

                await page.waitForTimeout(900);

                await expect(
                    page,
                ).toHaveURL(
                    /\/en$/,
                );

                await expect(
                    siteShell,
                ).not.toHaveAttribute(
                    "inert",
                    "",
                );

                await expect(
                    siteShell,
                ).not.toHaveAttribute(
                    "aria-hidden",
                    "true",
                );

                await expect(
                    projectLink,
                ).toBeVisible();

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

                await expect(
                    siteShell,
                ).not.toHaveAttribute(
                    "inert",
                    "",
                );

                await expect(
                    siteShell,
                ).not.toHaveAttribute(
                    "aria-hidden",
                    "true",
                );

                const navigator =
                    page.getByRole(
                        "navigation",
                        {
                            name:
                                "Homepage presentation scenes",
                        },
                    );

                if (
                    testInfo.project.name.includes(
                        "mobile",
                    )
                ) {
                    await expect(
                        page.locator(
                            "[data-cinematic-navigator]",
                        ),
                    ).toBeHidden();

                    const contactSection =
                        page.locator("#contact");

                    await contactSection
                        .scrollIntoViewIfNeeded();

                    await expect(
                        contactSection,
                    ).toBeInViewport();

                    return;
                }

                await navigator.getByRole(
                    "button",
                    {
                        name: "Go to Contact",
                    },
                ).click();

                await expect(
                    page.locator("html"),
                ).toHaveAttribute(
                    "data-cinematic-active",
                    "contact",
                    {
                        timeout: 10_000,
                    },
                );
            },
        );

        test(
            "loads project-specific modal data and closes with Escape",
            async ({ page }) => {
                await page.goto("/en");

                const nexusLink =
                    page.locator(
                        'a[href="/en/projects/nexus-finance"]',
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

                const nexusGallery =
                    dialog.locator(
                        "[data-project-gallery]",
                    );

                await expect(
                    nexusGallery,
                ).toHaveAttribute(
                    "data-gallery-count",
                    "3",
                );

                await expect(
                    nexusGallery,
                ).toHaveAttribute(
                    "data-gallery-index",
                    "0",
                );

                await expect(
                    dialog.getByRole(
                        "button",
                        {
                            name:
                                "Show next project image",
                        },
                    ),
                ).toBeVisible();

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

                await page.goto("/en");

                const projectLink =
                    page.locator(
                        `a[href="/en/projects/${projectSlug}"]`,
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
                await expect(page).toHaveURL(/\/en$/);

                await expect(
                    projectLink,
                ).toBeVisible();

                await expect(
                    projectLink,
                ).toBeFocused();

                await projectLink.click();

                await expect(page).toHaveURL(
                    new RegExp(
                        `/projects/${projectSlug}$`,
                    ),
                    {
                        timeout: 15_000,
                    },
                );

                const reopenedDialog =
                    page.getByRole("dialog");

                await expect(
                    reopenedDialog,
                ).toBeVisible();

                const reopenedGallery =
                    reopenedDialog.locator(
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
            "keeps display-only technology tags neutral and out of the tab order",
            async ({ page }) => {
                await page.goto("/en");

                await page.locator(
                    'a[href="/en/projects/nexus-finance"]',
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

                const tagSemantics =
                    await tags.evaluateAll(
                        (elements) =>
                            elements.map(
                                (element) => ({
                                    tagName:
                                    element.tagName,
                                    tabIndex:
                                    (
                                        element as HTMLElement
                                    ).tabIndex,
                                    role:
                                    element.getAttribute(
                                        "role",
                                    ),
                                }),
                            ),
                    );

                expect(
                    tagSemantics.every(
                        (tag) =>
                            tag.tagName === "SPAN" &&
                            tag.tabIndex === -1 &&
                            tag.role === null,
                    ),
                ).toBe(true);
            },
        );

        test(
            "renders canonical project page on direct navigation",
            async ({ page }) => {
                await page.goto(
                    `/en/projects/${projectSlug}`,
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
                        "/en/this-route-does-not-exist-e2e",
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
                await page.goto("/en");

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
                await page.goto("/en");

                await page.locator(
                    `a[href="/en/projects/${projectSlug}"]`,
                ).first().click();

                await expect(
                    page.locator(
                        '[data-project-modal-state="open"]',
                    ),
                ).toBeVisible();

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
                await page.goto("/en");

                const projectLink =
                    page.locator(
                        `a[href="/en/projects/${projectSlug}"]`,
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
