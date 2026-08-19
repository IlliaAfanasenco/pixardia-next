import {
    expect,
    type Page,
    test,
} from "@playwright/test";

const validLead = {
    name:
        "  Aleks Test  ",

    email:
        "TEST.LEAD@EXAMPLE.COM",

    message:
        "  We need a production website with a clear lead flow and analytics integration.  ",
};

function nameField(
    page: Page,
) {
    return page.getByRole(
        "textbox",
        {
            name:
                "Client name",
        },
    );
}

function emailField(
    page: Page,
) {
    return page.getByRole(
        "textbox",
        {
            name:
                "Contact email",
        },
    );
}

function messageField(
    page: Page,
) {
    return page.getByRole(
        "textbox",
        {
            name:
                "Additional briefing",
        },
    );
}

function serviceField(
    page: Page,
) {
    return page.getByRole(
        "combobox",
        {
            name:
                "Project type",
        },
    );
}

function privacyField(
    page: Page,
) {
    return page.getByRole(
        "checkbox",
        {
            name:
                /I agree to the privacy policy/i,
        },
    );
}

function submitButton(
    page: Page,
) {
    return page.getByRole(
        "button",
        {
            name:
                /initialize dialogue/i,
        },
    );
}

async function fillValidLead(
    page: Page,
): Promise<void> {
    await nameField(page).fill(
        validLead.name,
    );

    await emailField(page).fill(
        validLead.email,
    );

    await messageField(page).fill(
        validLead.message,
    );

    await serviceField(page)
        .selectOption(
            "BUSINESS_WEBSITE",
        );

    await privacyField(page)
        .check();
}

async function submitLead(
    page: Page,
): Promise<void> {
    await submitButton(page)
        .click();
}

test.describe(
    "contact lead flow",
    () => {
        test.beforeEach(
            async ({ page }) => {
                await page.goto(
                    "/contact",
                );

                await expect(
                    page.getByRole(
                        "heading",
                        {
                            level: 1,
                            name:
                                "Start a project with Pixardia",
                        },
                    ),
                ).toBeVisible();

                await expect(
                    submitButton(page),
                ).toBeVisible();
            },
        );

        test(
            "blocks invalid input without calling the lead API",
            async ({ page }) => {
                let apiRequests = 0;

                await page.route(
                    "**/api/leads",
                    async (route) => {
                        apiRequests += 1;

                        await route.fulfill({
                            status: 500,

                            contentType:
                                "application/json",

                            body:
                                JSON.stringify({
                                    ok: false,
                                    error:
                                        "unexpected_call",
                                }),
                        });
                    },
                );

                await submitLead(
                    page,
                );

                await expect(
                    page.getByText(
                        "Name is too short",
                        {
                            exact: true,
                        },
                    ),
                ).toBeVisible();

                await expect(
                    page.getByText(
                        "Invalid email",
                        {
                            exact: true,
                        },
                    ),
                ).toBeVisible();

                await expect(
                    page.getByText(
                        "Please describe the project in more detail",
                        {
                            exact: true,
                        },
                    ),
                ).toBeVisible();

                await expect(
                    page.getByText(
                        "Please accept the privacy policy",
                        {
                            exact: true,
                        },
                    ),
                ).toBeVisible();

                expect(
                    apiRequests,
                ).toBe(0);
            },
        );

        test(
            "submits normalized production payload and resets the form",
            async ({ page }) => {
                let apiRequests = 0;

                let capturedPayload:
                    Record<string, unknown>
                    | null = null;

                await page.route(
                    "**/api/leads",
                    async (route) => {
                        apiRequests += 1;

                        capturedPayload =
                            route
                                .request()
                                .postDataJSON() as Record<
                                    string,
                                    unknown
                                >;

                        await route.fulfill({
                            status: 201,

                            contentType:
                                "application/json",

                            headers: {
                                "Cache-Control":
                                    "no-store",
                            },

                            body:
                                JSON.stringify({
                                    ok: true,
                                }),
                        });
                    },
                );

                await fillValidLead(
                    page,
                );

                await submitLead(
                    page,
                );

                const success =
                    page.getByRole(
                        "status",
                    );

                await expect(
                    success,
                ).toBeVisible();

                await expect(
                    success,
                ).toContainText(
                    /\S/u,
                );

                expect(
                    apiRequests,
                ).toBe(1);

                expect(
                    capturedPayload,
                ).toMatchObject({
                    name:
                        "Aleks Test",

                    email:
                        "test.lead@example.com",

                    message:
                        "We need a production website with a clear lead flow and analytics integration.",

                    language:
                        "en",

                    serviceCode:
                        "BUSINESS_WEBSITE",

                    privacyAccepted:
                        true,

                    website:
                        "",
                });

                expect(
                    capturedPayload,
                ).not.toHaveProperty(
                    "phone",
                );

                await expect(
                    nameField(page),
                ).toHaveValue("");

                await expect(
                    emailField(page),
                ).toHaveValue("");

                await expect(
                    messageField(page),
                ).toHaveValue("");

                await expect(
                    serviceField(page),
                ).toHaveValue(
                    "BUSINESS_WEBSITE",
                );

                await expect(
                    privacyField(page),
                ).not.toBeChecked();
            },
        );

        test(
            "shows recoverable feedback for HTTP 400",
            async ({ page }) => {
                let apiRequests = 0;

                await page.route(
                    "**/api/leads",
                    async (route) => {
                        apiRequests += 1;

                        await route.fulfill({
                            status: 400,

                            contentType:
                                "application/json",

                            body:
                                JSON.stringify({
                                    ok: false,

                                    error:
                                        "invalid_request",

                                    fields: {
                                        email: [
                                            "Invalid email",
                                        ],
                                    },
                                }),
                        });
                    },
                );

                await fillValidLead(
                    page,
                );

                await submitLead(
                    page,
                );

                const emailError =
                    page.getByText(
                        "Invalid email",
                        {
                            exact: true,
                        },
                    );

                await expect(
                    emailError,
                ).toBeVisible();

                const requestError =
                    page.getByText(
                        "The request could not be sent. Please try again.",
                        {
                            exact: true,
                        },
                    );

                await expect(
                    requestError,
                ).toBeVisible();

                expect(
                    apiRequests,
                ).toBe(1);

                await expect(
                    submitButton(page),
                ).toBeEnabled();

                await expect(
                    nameField(page),
                ).toHaveValue(
                    validLead.name,
                );
            },
        );

        test(
            "shows dedicated rate-limit feedback for HTTP 429",
            async ({ page }) => {
                let apiRequests = 0;

                await page.route(
                    "**/api/leads",
                    async (route) => {
                        apiRequests += 1;

                        await route.fulfill({
                            status: 429,

                            contentType:
                                "application/json",

                            headers: {
                                "Retry-After":
                                    "60",
                            },

                            body:
                                JSON.stringify({
                                    ok: false,
                                    error:
                                        "too_many_requests",
                                }),
                        });
                    },
                );

                await fillValidLead(
                    page,
                );

                await submitLead(
                    page,
                );

                const requestError =
                    page.getByText(
                        /Too many requests\. Please wait a moment and try again\./i,
                    );

                await expect(
                    requestError,
                ).toBeVisible();

                expect(
                    apiRequests,
                ).toBe(1);

                await expect(
                    submitButton(page),
                ).toBeEnabled();

                await expect(
                    nameField(page),
                ).toHaveValue(
                    validLead.name,
                );
            },
        );

        test(
            "preserves entered data and allows retry after HTTP 500",
            async ({ page }) => {
                let apiRequests = 0;

                await page.route(
                    "**/api/leads",
                    async (route) => {
                        apiRequests += 1;

                        await route.fulfill({
                            status: 500,

                            contentType:
                                "application/json",

                            body:
                                JSON.stringify({
                                    ok: false,
                                    error:
                                        "server_error",
                                }),
                        });
                    },
                );

                await fillValidLead(
                    page,
                );

                await submitLead(
                    page,
                );

                const requestError =
                    page.getByText(
                        "The request could not be sent. Please try again.",
                        {
                            exact: true,
                        },
                    );

                await expect(
                    requestError,
                ).toBeVisible();

                expect(
                    apiRequests,
                ).toBe(1);

                await expect(
                    nameField(page),
                ).toHaveValue(
                    validLead.name,
                );

                await expect(
                    emailField(page),
                ).toHaveValue(
                    validLead.email,
                );

                await expect(
                    messageField(page),
                ).toHaveValue(
                    validLead.message,
                );

                await expect(
                    serviceField(page),
                ).toHaveValue(
                    "BUSINESS_WEBSITE",
                );

                await expect(
                    privacyField(page),
                ).toBeChecked();

                await expect(
                    submitButton(page),
                ).toBeEnabled();
            },
        );
    },
);
