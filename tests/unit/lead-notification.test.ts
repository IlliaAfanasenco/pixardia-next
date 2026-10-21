import { afterEach, describe, expect, it, vi } from "vitest";
import {
    sendLeadNotification,
    type LeadNotificationInput,
} from "@/lib/leads/sendLeadNotification";

const lead: LeadNotificationInput = {
    id: "audit-lead-001",
    name: "Audit User",
    email: "audit@example.com",
    phone: null,
    message: "Test enquiry without external delivery.",
    language: "de",
    serviceCode: "BUSINESS_WEBSITE",
    serviceSlug: "business-website",
    sourcePage: "/de/contact",
    createdAt: new Date("2026-10-19T12:00:00Z"),
};

function configureEmail() {
    vi.stubEnv("RESEND_API_KEY", "test-only-key");
    vi.stubEnv("LEAD_NOTIFICATION_FROM", "sender@example.com");
    vi.stubEnv("LEAD_NOTIFICATION_TO", "owner@example.com");
}

afterEach(() => {
    vi.unstubAllEnvs();
});

describe("lead notification delivery", () => {
    it("skips delivery when email is not configured", async () => {
        vi.stubEnv("RESEND_API_KEY", "");
        vi.stubEnv("LEAD_NOTIFICATION_FROM", "");
        vi.stubEnv("LEAD_NOTIFICATION_TO", "");

        const transport = vi.fn<typeof fetch>();

        await expect(
            sendLeadNotification(lead, transport),
        ).resolves.toEqual({
            status: "skipped",
            reason: "not_configured",
        });

        expect(transport).not.toHaveBeenCalled();
    });

    it("sends the lead with an idempotency key", async () => {
        configureEmail();

        const transport = vi.fn<typeof fetch>(
            async () => new Response(null, { status: 202 }),
        );

        await expect(
            sendLeadNotification(lead, transport),
        ).resolves.toEqual({ status: "sent" });

        expect(transport).toHaveBeenCalledOnce();

        const [url, options] = transport.mock.calls[0]!;

        expect(url).toBe("https://api.resend.com/emails");
        expect(options?.method).toBe("POST");
        expect(options?.headers).toMatchObject({
            Authorization: "Bearer test-only-key",
            "Idempotency-Key": "lead-created/audit-lead-001",
        });

        const payload = JSON.parse(String(options?.body));
        expect(payload.to).toEqual(["owner@example.com"]);
        expect(payload.reply_to).toBe("audit@example.com");
        expect(payload.text).toContain("Audit User");
    });

    it("reports a provider failure", async () => {
        configureEmail();

        const transport = vi.fn<typeof fetch>(
            async () => new Response(null, { status: 503 }),
        );

        await expect(
            sendLeadNotification(lead, transport),
        ).rejects.toMatchObject({
            code: "provider_error",
            status: 503,
        });
    });

    it("reports a network failure", async () => {
        configureEmail();

        const transport = vi.fn<typeof fetch>()
            .mockRejectedValue(new Error("offline"));

        await expect(
            sendLeadNotification(lead, transport),
        ).rejects.toMatchObject({
            code: "network_error",
        });
    });
});
