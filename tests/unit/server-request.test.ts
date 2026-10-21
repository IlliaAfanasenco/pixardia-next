import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import {
    getClientIp,
    readJsonBodyWithLimit,
} from "@/lib/server/request";

const url = "http://localhost:3100/api/leads";

function request(
    body: string,
    headers: Record<string, string> = {},
): NextRequest {
    return new NextRequest(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            ...headers,
        },
        body,
    });
}

describe("shared API request utilities", () => {
    it("parses valid JSON with charset", async () => {
        const input = request('{"ok":true}', {
            "content-type": "application/json; charset=utf-8",
        });

        await expect(
            readJsonBodyWithLimit(input, 100),
        ).resolves.toEqual({ ok: true });
    });

    it("rejects unsupported content types", async () => {
        const input = request("hello", {
            "content-type": "text/plain",
        });

        await expect(
            readJsonBodyWithLimit(input, 100),
        ).rejects.toMatchObject({
            code: "unsupported_media_type",
            status: 415,
        });
    });

    it("rejects excessive declared content length", async () => {
        const input = request('{"ok":true}', {
            "content-length": "1024",
        });

        await expect(
            readJsonBodyWithLimit(input, 32),
        ).rejects.toMatchObject({
            code: "request_too_large",
            status: 413,
        });
    });

    it("rejects actual body size exceeding limit", async () => {
        const input = request(
            JSON.stringify({ message: "x".repeat(100) }),
        );

        await expect(
            readJsonBodyWithLimit(input, 32),
        ).rejects.toMatchObject({
            code: "request_too_large",
            status: 413,
        });
    });

    it("rejects malformed JSON", async () => {
        const input = request("{invalid");

        await expect(
            readJsonBodyWithLimit(input, 100),
        ).rejects.toMatchObject({
            code: "invalid_json",
            status: 400,
        });
    });

    it("rejects empty JSON bodies", async () => {
        const input = request("   ");

        await expect(
            readJsonBodyWithLimit(input, 100),
        ).rejects.toMatchObject({
            code: "invalid_json",
            status: 400,
        });
    });

    it("ignores invalid IP header values", () => {
        const input = new NextRequest(url, {
            headers: {
                "x-real-ip": "invalid-ip",
                "x-forwarded-for": "not-an-ip",
            },
        });

        expect(getClientIp(input)).toBe("unknown");
    });

    it("parses a syntactically valid IP", () => {
        const input = new NextRequest(url, {
            headers: {
                "x-real-ip": "203.0.113.9",
            },
        });

        expect(getClientIp(input)).toBe("203.0.113.9");
    });
});
