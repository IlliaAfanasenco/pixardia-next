import { NextRequest } from "next/server";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const mocks = vi.hoisted(() => ({
    after: vi.fn(),
    checkRateLimit: vi.fn(),
    prismaCreate: vi.fn(),
    sendLeadNotification: vi.fn(),
}));

vi.mock("next/server", async (importOriginal) => {
    const actual = await importOriginal<typeof import("next/server")>();

    return {
        ...actual,
        after: mocks.after,
    };
});

vi.mock("@/lib/readLimit", () => ({
    checkRateLimit: mocks.checkRateLimit,
}));

vi.mock("@/lib/prisma", () => ({
    prisma: {
        lead: {
            create: mocks.prismaCreate,
        },
    },
}));

vi.mock("@/lib/leads/sendLeadNotification", () => ({
    sendLeadNotification: mocks.sendLeadNotification,
}));

import { POST } from "@/app/api/leads/route";

const message =
    "This is a detailed test enquiry for a business website.";

const storedLead = {
    id: "audit-lead-001",
    name: "Audit User",
    email: "audit@example.com",
    phone: null,
    message,
    language: "de",
    serviceCode: "BUSINESS_WEBSITE",
    serviceSlug: "business-website",
    sourcePage: "/de/contact",
    createdAt: new Date("2026-10-19T12:00:00Z"),
};

function makeRequest(): NextRequest {
    return new NextRequest(
        "http://localhost:3100/api/leads",
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-real-ip": "203.0.113.7",
                referer: "http://localhost:3100/de/contact",
            },
            body: JSON.stringify({
                name: "Audit User",
                email: "AUDIT@EXAMPLE.COM",
                phone: "",
                message,
                language: "de",
                serviceCode: "BUSINESS_WEBSITE",
                privacyAccepted: true,
                website: "",
            }),
        },
    );
}

describe("POST /api/leads successful submission", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mocks.checkRateLimit.mockResolvedValue({
            success: true,
            limit: 8,
            remaining: 7,
            reset: Date.now() + 60_000,
            source: "distributed",
        });

        mocks.prismaCreate.mockResolvedValue(storedLead);
        mocks.sendLeadNotification.mockResolvedValue({
            status: "sent",
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("saves a valid lead and schedules notification", async () => {
        const result = await POST(makeRequest());

        expect(result.status).toBe(201);
        await expect(result.json()).resolves.toEqual({
            ok: true,
        });

        expect(mocks.prismaCreate).toHaveBeenCalledOnce();

        expect(mocks.prismaCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({
                name: "Audit User",
                email: "audit@example.com",
                phone: null,
                language: "de",
                serviceCode: "BUSINESS_WEBSITE",
                serviceSlug: "business-website",
                sourcePage: "/de/contact",
                privacyAcceptedAt: expect.any(Date),
            }),
        });

        expect(mocks.after).toHaveBeenCalledOnce();
        expect(mocks.sendLeadNotification).not.toHaveBeenCalled();

        const deferred = mocks.after.mock.calls[0]?.[0] as
            | (() => Promise<void>)
            | undefined;

        expect(deferred).toBeTypeOf("function");

        await deferred!();

        expect(mocks.sendLeadNotification).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "audit-lead-001",
                email: "audit@example.com",
                sourcePage: "/de/contact",
            }),
        );
    });

    it("returns 500 without notification when saving fails", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});

        mocks.prismaCreate.mockRejectedValueOnce(
            new Error("Simulated database failure"),
        );

        const result = await POST(makeRequest());

        expect(result.status).toBe(500);

        await expect(result.json()).resolves.toEqual({
            ok: false,
            error: "server_error",
        });

        expect(mocks.after).not.toHaveBeenCalled();
        expect(mocks.sendLeadNotification).not.toHaveBeenCalled();
    });
});
