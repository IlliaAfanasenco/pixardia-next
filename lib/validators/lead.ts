import { z } from "zod";

import { serviceCodes } from "@/types/services";

const phoneSchema = z.preprocess(
    (value) => {
        if (value === undefined || value === null) {
            return undefined;
        }

        if (typeof value !== "string") {
            return value;
        }

        const normalizedValue = value.trim();

        return normalizedValue || undefined;
    },
    z
        .string()
        .max(30, "Phone number is too long")
        .refine((value) => {
            if (!/^[+\d\s().-]+$/.test(value)) {
                return false;
            }

            const digits = value.replace(/\D/g, "");

            return digits.length >= 7 && digits.length <= 15;
        }, "Invalid phone number")
        .optional(),
);

export const leadSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name is too short")
            .max(80, "Name is too long"),

        email: z
            .string()
            .trim()
            .email("Invalid email")
            .max(254, "Email is too long")
            .transform((value) => value.toLowerCase()),

        phone: phoneSchema,

        message: z
            .string()
            .trim()
            .min(
                20,
                "Please describe the project in more detail",
            )
            .max(3000, "Message is too long"),

        serviceCode: z.enum(serviceCodes),

        language: z.enum(["en", "de"]).default("en"),

        privacyAccepted: z
            .boolean()
            .refine(
                (value) => value,
                "Please accept the privacy policy",
            ),

        website: z
            .string()
            .trim()
            .max(300)
            .optional()
            .default(""),
    })
    .strict();

export type LeadInput = z.output<typeof leadSchema>;
export type LeadFormInput = z.input<typeof leadSchema>;