import {
    describe,
    expect,
    it,
} from "vitest";

import {
    checkMessage,
} from "@/lib/ai-terminal/terminalGuard";

describe("checkMessage", () => {
    it("allows an ordinary project description", () => {
        const result = checkMessage(
            "We need an e-commerce website with a multilingual catalogue and payment integration.",
            "en",
        );

        expect(result).toEqual({
            allowed: true,
        });
    });

    it("does not treat ordinary project numbers as private data", () => {
        const result = checkMessage(
            "The project timeline is 12 to 16 weeks and the estimated catalogue has 250 products.",
            "en",
        );

        expect(result).toEqual({
            allowed: true,
        });
    });

    it.each([
        [
            "email address",
            "My email is alex@example.com",
        ],
        [
            "IBAN",
            "The account is DE89 3704 0044 0532 0130 00",
        ],
        [
            "labelled phone number",
            "Phone: +49 30 12345678",
        ],
        [
            "international phone number",
            "Call me at +972 50 123 4567",
        ],
        [
            "valid payment card number",
            "The card is 4242 4242 4242 4242",
        ],
        [
            "API secret",
            "api_key=abcdefghijklmnop",
        ],
    ])("blocks a message containing a %s", (
        _label,
        message,
    ) => {
        const result = checkMessage(
            message,
            "en",
        );

        expect(result.allowed).toBe(false);

        if (result.allowed) {
            throw new Error(
                "Expected the guard to block the message.",
            );
        }

        expect(result.result).toMatchObject({
            category: "contact",
            shouldLeadToContact: true,
        });

        expect(
            result.result.answer.length,
        ).toBeGreaterThan(0);
    });

    it("returns the German privacy response", () => {
        const result = checkMessage(
            "E-Mail: max@example.de",
            "de",
        );

        expect(result.allowed).toBe(false);

        if (result.allowed) {
            throw new Error(
                "Expected the guard to block the message.",
            );
        }

        expect(result.result.answer).toContain(
            "Bitte",
        );
    });
});
