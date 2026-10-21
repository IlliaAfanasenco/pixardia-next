import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    checkRateLimit: vi.fn(),
    getTerminalAnswer: vi.fn(),
}));

vi.mock("@/lib/readLimit", () => ({
    checkRateLimit: mocks.checkRateLimit,
}));

vi.mock("@/lib/ai-terminal/deepseekClient", () => ({
    getTerminalAnswer: mocks.getTerminalAnswer,
}));

import { POST } from "@/app/api/terminal/route";

function makeRequest(
    payload: unknown,
    contentType = "application/json",
): NextRequest {
    return new NextRequest("http://localhost:3100/api/terminal", {
        method: "POST",
        headers: {
            "content-type": contentType,
            "x-real-ip": "203.0.113.9",
        },
        body: typeof payload === "string"
            ? payload
            : JSON.stringify(payload),
    });
}

const allowedLimit = () => ({
    success: true,
    limit: 8,
    remaining: 7,
    reset: Date.now() + 60_000,
    source: "distributed",
});

describe("POST /api/terminal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.checkRateLimit.mockResolvedValue(allowedLimit());
        mocks.getTerminalAnswer.mockResolvedValue({
            answer: "A business website depends on the project scope.",
            category: "pricing",
            shouldLeadToContact: true,
        });
    });

    it("rejects unsupported content types", async () => {
        const response = await POST(
            makeRequest("hello", "text/plain"),
        );

        expect(response.status).toBe(415);
        await expect(response.json()).resolves.toEqual({
            error: "unsupported_media_type",
        });
        expect(mocks.getTerminalAnswer).not.toHaveBeenCalled();
    });

    it("rejects invalid JSON", async () => {
        const response = await POST(makeRequest("{broken"));

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({
            error: "invalid_json",
        });
    });

    it("rejects invalid request data", async () => {
        const response = await POST(
            makeRequest({ message: "", language: "de" }),
        );

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({
            error: "invalid_request",
        });
        expect(mocks.getTerminalAnswer).not.toHaveBeenCalled();
    });

    it("returns a valid advisor response", async () => {
        const response = await POST(
            makeRequest({
                message: "How much does a business website cost?",
                language: "en",
            }),
        );

        expect(response.status).toBe(200);

        await expect(response.json()).resolves.toEqual({
            answer: "A business website depends on the project scope.",
            category: "pricing",
            shouldLeadToContact: true,
        });

        expect(mocks.checkRateLimit).toHaveBeenCalledOnce();
        expect(mocks.getTerminalAnswer).toHaveBeenCalledWith({
            message: "How much does a business website cost?",
            language: "en",
        });
    });

    it("returns 429 when the rate limit is exceeded", async () => {
        mocks.checkRateLimit.mockResolvedValueOnce({
            ...allowedLimit(),
            success: false,
            remaining: 0,
        });

        const response = await POST(
            makeRequest({
                message: "Tell me about your services",
                language: "de",
            }),
        );

        expect(response.status).toBe(429);
        expect(response.headers.get("retry-after")).toBeTruthy();
        expect(mocks.getTerminalAnswer).not.toHaveBeenCalled();
    });

    it("blocks personal data before contacting the provider", async () => {
        const response = await POST(
            makeRequest({
                message: "Contact me at audit@example.com",
                language: "en",
            }),
        );

        expect(response.status).toBe(200);

        const body = await response.json();

        expect(body).toMatchObject({
            category: "contact",
            shouldLeadToContact: true,
        });
        expect(mocks.getTerminalAnswer).not.toHaveBeenCalled();
    });
});
