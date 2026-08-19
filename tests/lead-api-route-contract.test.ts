import {
    NextRequest,
} from "next/server";

import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const mocks = vi.hoisted(() => ({
    checkRateLimit:
        vi.fn(),

    prismaCreate:
        vi.fn(),

    sendLeadNotification:
        vi.fn(),
}));

vi.mock(
    "@/lib/readLimit",
    () => ({
        checkRateLimit:
            mocks.checkRateLimit,
    }),
);

vi.mock(
    "@/lib/prisma",
    () => ({
        prisma: {
            lead: {
                create:
                    mocks.prismaCreate,
            },
        },
    }),
);

vi.mock(
    "@/lib/leads/sendLeadNotification",
    () => ({
        sendLeadNotification:
            mocks.sendLeadNotification,
    }),
);

import {
    POST,
} from "@/app/api/leads/route";

type RequestOptions = {
    contentType?: string;
    body?: string;
    ip?: string;
};

function makeRequest({
    contentType =
        "application/json",

    body =
        "{}",

    ip =
        "198.51.100.200",
}: RequestOptions = {}): NextRequest {
    return new NextRequest(
        "http://localhost/api/leads",
        {
            method:
                "POST",

            headers: {
                "Content-Type":
                    contentType,

                "x-real-ip":
                    ip,
            },

            body,
        },
    );
}

function allowedRateLimit() {
    return {
        success:
            true,

        limit:
            8,

        remaining:
            7,

        reset:
            Date.now() + 60_000,

        source:
            "distributed" as const,
    };
}

describe(
    "POST /api/leads route contract",
    () => {
        beforeEach(() => {
            mocks.checkRateLimit
                .mockReset()
                .mockResolvedValue(
                    allowedRateLimit(),
                );

            mocks.prismaCreate
                .mockReset();

            mocks.sendLeadNotification
                .mockReset();
        });

        it(
            "rejects unsupported media type with 415",
            async () => {
                const result =
                    await POST(
                        makeRequest({
                            contentType:
                                "text/plain",

                            body:
                                "not-json",
                        }),
                    );

                expect(
                    result.status,
                ).toBe(415);

                await expect(
                    result.json(),
                ).resolves.toEqual({
                    ok:
                        false,

                    error:
                        "unsupported_media_type",
                });

                expect(
                    result.headers.get(
                        "cache-control",
                    ),
                ).toContain(
                    "no-store",
                );
            },
        );

        it(
            "rejects malformed JSON with invalid_json",
            async () => {
                const result =
                    await POST(
                        makeRequest({
                            body:
                                '{"name":',
                        }),
                    );

                expect(
                    result.status,
                ).toBe(400);

                await expect(
                    result.json(),
                ).resolves.toEqual({
                    ok:
                        false,

                    error:
                        "invalid_json",
                });
            },
        );

        it(
            "rejects oversized JSON with 413",
            async () => {
                const result =
                    await POST(
                        makeRequest({
                            body:
                                JSON.stringify({
                                    payload:
                                        "x".repeat(
                                            21_000,
                                        ),
                                }),
                        }),
                    );

                expect(
                    result.status,
                ).toBe(413);

                await expect(
                    result.json(),
                ).resolves.toEqual({
                    ok:
                        false,

                    error:
                        "request_too_large",
                });
            },
        );

        it(
            "returns field errors for schema-invalid JSON",
            async () => {
                const result =
                    await POST(
                        makeRequest({
                            body:
                                JSON.stringify({
                                    name:
                                        "A",

                                    email:
                                        "not-an-email",

                                    message:
                                        "short",

                                    serviceCode:
                                        "BUSINESS_WEBSITE",

                                    language:
                                        "en",

                                    privacyAccepted:
                                        false,

                                    website:
                                        "",
                                }),
                        }),
                    );

                expect(
                    result.status,
                ).toBe(400);

                const body =
                    await result.json() as {
                        ok: boolean;
                        error: string;
                        fields: Record<
                            string,
                            string[]
                        >;
                    };

                expect(
                    body.ok,
                ).toBe(false);

                expect(
                    body.error,
                ).toBe(
                    "invalid_request",
                );

                expect(
                    body.fields.name,
                ).toContain(
                    "Name is too short",
                );

                expect(
                    body.fields.email,
                ).toContain(
                    "Invalid email",
                );

                expect(
                    body.fields.message,
                ).toContain(
                    "Please describe the project in more detail",
                );

                expect(
                    body.fields
                        .privacyAccepted,
                ).toContain(
                    "Please accept the privacy policy",
                );
            },
        );

        it(
            "short-circuits honeypot submissions without Prisma",
            async () => {
                const result =
                    await POST(
                        makeRequest({
                            body:
                                JSON.stringify({
                                    name:
                                        "Boundary User",

                                    email:
                                        "boundary@example.com",

                                    message:
                                        "This is a sufficiently detailed project enquiry for validation.",

                                    serviceCode:
                                        "BUSINESS_WEBSITE",

                                    language:
                                        "en",

                                    privacyAccepted:
                                        true,

                                    website:
                                        "https://spam.invalid",
                                }),
                        }),
                    );

                expect(
                    result.status,
                ).toBe(201);

                await expect(
                    result.json(),
                ).resolves.toEqual({
                    ok:
                        true,
                });

                expect(
                    mocks.prismaCreate,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "returns 429 when the rate limiter rejects the request",
            async () => {
                mocks.checkRateLimit
                    .mockResolvedValueOnce({
                        success:
                            false,

                        limit:
                            8,

                        remaining:
                            0,

                        reset:
                            Date.now() +
                            60_000,

                        source:
                            "distributed",
                    });

                const result =
                    await POST(
                        makeRequest(),
                    );

                expect(
                    result.status,
                ).toBe(429);

                await expect(
                    result.json(),
                ).resolves.toEqual({
                    ok:
                        false,

                    error:
                        "too_many_requests",
                });

                expect(
                    result.headers.get(
                        "retry-after",
                    ),
                ).toBeTruthy();

                expect(
                    result.headers.get(
                        "x-ratelimit-limit",
                    ),
                ).toBe("8");

                expect(
                    result.headers.get(
                        "x-ratelimit-remaining",
                    ),
                ).toBe("0");
            },
        );
    },
);
