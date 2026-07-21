import { z } from "zod";

import {
    terminalCategories,
    terminalLanguages,
} from "@/lib/ai-terminal/terminalContract";

export const terminalHistoryMessageSchema = z
    .object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(800),
    })
    .strict();

export const terminalRequestSchema = z
    .object({
        message: z.string().trim().min(2).max(800),
        history: z
            .array(terminalHistoryMessageSchema)
            .max(6)
            .default([]),
        language: z.enum(terminalLanguages).default("en"),
    })
    .strict();

export const terminalResultSchema = z.object({
    answer: z.string().trim().min(1).max(1000),
    category: z.enum(terminalCategories),
    shouldLeadToContact: z.boolean(),
});

export type TerminalRequestInput = z.input<
    typeof terminalRequestSchema
>;

export type ParsedTerminalRequest = z.output<
    typeof terminalRequestSchema
>;