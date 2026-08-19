import {
    afterEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    LeadNotificationError,
    sendLeadNotification,
} from "@/lib/leads/sendLeadNotification";

const originalEnv = {
    RESEND_API_KEY:
        process.env.RESEND_API_KEY,
    LEAD_NOTIFICATION_TO:
        process.env.LEAD_NOTIFICATION_TO,
    LEAD_NOTIFICATION_FROM:
        process.env.LEAD_NOTIFICATION_FROM,
};

const lead = {
    id: "lead_test_123",
    name: "Alex Example",
    email: "alex@example.com",
    phone: "+49 30 1234567",
    message:
        "We need a multilingual business website.",
    language: "en",
    serviceCode: "BUSINESS_WEBSITE",
    serviceSlug: "business-website",
    sourcePage: "/contact",
    createdAt:
        new Date("2026-08-18T00:00:00.000Z"),
};

function restoreEnv(): void {
    for (
        const [key, value]
        of Object.entries(originalEnv)
    ) {
        if (value === undefined) {
            delete process.env[key];
        } else {
            process.env[key] = value;
        }
    }
}

function configureNotification(): void {
    process.env.RESEND_API_KEY =
        "re_test_secret";

    process.env.LEAD_NOTIFICATION_TO =
        "owner@example.com";

    process.env.LEAD_NOTIFICATION_FROM =
        "Pixardia Leads <leads@example.com>";
}

afterEach(() => {
    restoreEnv();
});

describe("sendLeadNotification", () => {
    it("skips safely when notification env is not configured", async () => {
        delete process.env.RESEND_API_KEY;
        delete process.env.LEAD_NOTIFICATION_TO;
        delete process.env.LEAD_NOTIFICATION_FROM;

        let called = false;

        const fetchMock:
            typeof fetch = async () => {
                called = true;

                return new Response(null, {
                    status: 200,
                });
            };

        const result =
            await sendLeadNotification(
                lead,
                fetchMock,
            );

        expect(result).toEqual({
            status: "skipped",
            reason: "not_configured",
        });

        expect(called).toBe(false);
    });

    it("sends a privacy-contained owner notification with an idempotency key", async () => {
        configureNotification();

        const calls: Array<{
            input:
                | string
                | URL
                | Request;
            init?: RequestInit;
        }> = [];

        const fetchMock:
            typeof fetch = async (
                input,
                init,
            ) => {
                calls.push({
                    input,
                    init,
                });

                return new Response(
                    JSON.stringify({
                        id: "email_123",
                    }),
                    {
                        status: 200,
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                    },
                );
            };

        const result =
            await sendLeadNotification(
                lead,
                fetchMock,
            );

        expect(result).toEqual({
            status: "sent",
        });

        expect(calls).toHaveLength(1);

        const call = calls[0];

        expect(String(call.input)).toBe(
            "https://api.resend.com/emails",
        );

        const headers =
            call.init?.headers as Record<
                string,
                string
            >;

        expect(headers.Authorization).toBe(
            "Bearer re_test_secret",
        );

        expect(
            headers["Idempotency-Key"],
        ).toBe(
            "lead-created/lead_test_123",
        );

        const body = JSON.parse(
            String(call.init?.body),
        ) as {
            from: string;
            to: string[];
            reply_to: string;
            subject: string;
            text: string;
            html?: string;
        };

        expect(body.to).toEqual([
            "owner@example.com",
        ]);

        expect(body.reply_to).toBe(
            "alex@example.com",
        );

        expect(body.subject).toBe(
            "New Pixardia lead - BUSINESS_WEBSITE",
        );

        expect(body.text).toContain(
            "Alex Example",
        );

        expect(body.text).toContain(
            "We need a multilingual business website.",
        );

        expect(body.html).toBeUndefined();
    });

    it("normalizes provider failures without exposing provider bodies", async () => {
        configureNotification();

        const fetchMock:
            typeof fetch = async () =>
                new Response(
                    "provider-secret-debug-body",
                    {
                        status: 503,
                    },
                );

        try {
            await sendLeadNotification(
                lead,
                fetchMock,
            );

            throw new Error(
                "Expected notification failure",
            );
        } catch (error) {
            expect(
                error,
            ).toBeInstanceOf(
                LeadNotificationError,
            );

            if (
                !(
                    error instanceof
                    LeadNotificationError
                )
            ) {
                throw error;
            }

            expect(error.code).toBe(
                "provider_error",
            );

            expect(error.status).toBe(503);

            expect(error.message).not.toContain(
                "provider-secret-debug-body",
            );
        }
    });
});

describe("lead route notification contract", () => {
    it("schedules notification only after a Lead is created", async () => {
        const fs =
            await import("node:fs/promises");

        const route =
            await fs.readFile(
                "app/api/leads/route.ts",
                "utf-8",
            );

        const createIndex =
            route.indexOf(
                "const lead = await prisma.lead.create",
            );

        const afterIndex =
            route.indexOf(
                "after(async () =>",
            );

        const responseIndex =
            route.indexOf(
                "return response(",
                afterIndex,
            );

        expect(createIndex).toBeGreaterThan(
            -1,
        );

        expect(afterIndex).toBeGreaterThan(
            createIndex,
        );

        expect(responseIndex).toBeGreaterThan(
            afterIndex,
        );

        expect(route).toMatch(
            new RegExp(
                'import\\s*\\{[^;]*\\bafter\\b[^;]*\\}\\s*from\\s*"next/server";',
                "u",
            ),
        );

        expect(route).not.toMatch(
            new RegExp(
                'import\\s*\\{[^;]*\\bafter\\b[^;]*\\}\\s*from\\s*"node:crypto";',
                "u",
            ),
        );

        expect(route).toContain(
            "sendLeadNotification",
        );

        expect(route).toContain(
            "leadId: lead.id",
        );
    });

    it("documents all required notification env keys", async () => {
        const fs =
            await import("node:fs/promises");

        const env =
            await fs.readFile(
                ".env.example",
                "utf-8",
            );

        expect(env).toContain(
            "RESEND_API_KEY=",
        );

        expect(env).toContain(
            "LEAD_NOTIFICATION_TO=",
        );

        expect(env).toContain(
            "LEAD_NOTIFICATION_FROM=",
        );
    });
});
