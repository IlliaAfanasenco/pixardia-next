import {
    describe,
    expect,
    it,
} from "vitest";

import { leadSchema } from "@/lib/validators/lead";

const validLead = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message:
        "We need a modern business website with a clear contact flow.",
    serviceCode: "BUSINESS_WEBSITE" as const,
    privacyAccepted: true,
};

describe("leadSchema", () => {
    it("normalizes valid lead input", () => {
        const result = leadSchema.parse({
            ...validLead,
            name: "  Ada Lovelace  ",
            email: "  ADA@EXAMPLE.COM  ",
            phone: "  +49 30 1234567  ",
            message:
                "  We need a modern business website with a clear contact flow.  ",
        });

        expect(result).toMatchObject({
            name: "Ada Lovelace",
            email: "ada@example.com",
            phone: "+49 30 1234567",
            message:
                "We need a modern business website with a clear contact flow.",
            serviceCode: "BUSINESS_WEBSITE",
            language: "en",
            privacyAccepted: true,
            website: "",
        });
    });

    it("converts a blank optional phone to undefined", () => {
        const result = leadSchema.parse({
            ...validLead,
            phone: "   ",
        });

        expect(result.phone).toBeUndefined();
    });

    it("rejects an invalid phone number", () => {
        const result = leadSchema.safeParse({
            ...validLead,
            phone: "+49 phone number",
        });

        expect(result.success).toBe(false);
    });

    it("requires privacy acceptance", () => {
        const result = leadSchema.safeParse({
            ...validLead,
            privacyAccepted: false,
        });

        expect(result.success).toBe(false);
    });

    it("rejects unknown object fields", () => {
        const result = leadSchema.safeParse({
            ...validLead,
            unexpected: true,
        });

        expect(result.success).toBe(false);
    });

    it("rejects an unsupported service code", () => {
        const result = leadSchema.safeParse({
            ...validLead,
            serviceCode: "UNKNOWN_SERVICE",
        });

        expect(result.success).toBe(false);
    });
});
