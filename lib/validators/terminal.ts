import { z } from "zod";

import {
    terminalCategories,
    terminalLanguages,
    terminalLimits,
} from "@/lib/ai-terminal/terminalContract";

const unsupportedControlCharacterRegex =
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u;

const terminalMessageSchema = z
    .string()
    .trim()
    .min(terminalLimits.messageMinLength)
    .max(terminalLimits.messageMaxLength)
    .refine(
        (value) =>
            !unsupportedControlCharacterRegex.test(value),
        {
            message: "unsupported_control_characters",
        },
    );

export const terminalRequestSchema = z
    .object({
        message: terminalMessageSchema,
        language: z.enum(terminalLanguages).default("en"),
    })
    .strict();

export const terminalResultSchema = z
    .object({
        answer: z.string().trim().min(1).max(1000),
        category: z.enum(terminalCategories),
        shouldLeadToContact: z.boolean(),
    })
    .strict();

export type TerminalRequestInput = z.input<
    typeof terminalRequestSchema
>;

export type ParsedTerminalRequest = z.output<
    typeof terminalRequestSchema
>;
