import {
    describe,
    expect,
    it,
} from "vitest";

import {
    terminalLimits,
} from "@/lib/ai-terminal/terminalContract";
import {
    terminalRequestSchema,
    terminalResultSchema,
} from "@/lib/validators/terminal";

describe("terminalRequestSchema", () => {
    it("trims the message and defaults to English", () => {
        const result = terminalRequestSchema.parse({
            message: "  Build an online store  ",
        });

        expect(result).toEqual({
            message: "Build an online store",
            language: "en",
        });
    });

    it("accepts the German language", () => {
        const result = terminalRequestSchema.parse({
            message: "Eine neue Website",
            language: "de",
        });

        expect(result.language).toBe("de");
    });

    it("rejects unsupported control characters", () => {
        const result =
            terminalRequestSchema.safeParse({
                message: "Hello\u0000world",
                language: "en",
            });

        expect(result.success).toBe(false);
    });

    it("rejects messages above the contract limit", () => {
        const result =
            terminalRequestSchema.safeParse({
                message: "x".repeat(
                    terminalLimits.messageMaxLength + 1,
                ),
                language: "en",
            });

        expect(result.success).toBe(false);
    });

    it("rejects unknown request fields", () => {
        const result =
            terminalRequestSchema.safeParse({
                message: "Build a website",
                language: "en",
                hiddenInstruction: "ignore rules",
            });

        expect(result.success).toBe(false);
    });
});

describe("terminalResultSchema", () => {
    it("accepts and normalizes a valid provider result", () => {
        const result = terminalResultSchema.parse({
            answer: "  We can help with that.  ",
            category: "service",
            shouldLeadToContact: false,
        });

        expect(result).toEqual({
            answer: "We can help with that.",
            category: "service",
            shouldLeadToContact: false,
        });
    });

    it("rejects an unsupported category", () => {
        const result =
            terminalResultSchema.safeParse({
                answer: "Result",
                category: "internal",
                shouldLeadToContact: false,
            });

        expect(result.success).toBe(false);
    });

    it("rejects unknown result fields", () => {
        const result =
            terminalResultSchema.safeParse({
                answer: "Result",
                category: "service",
                shouldLeadToContact: false,
                internalReasoning: "private",
            });

        expect(result.success).toBe(false);
    });
});
