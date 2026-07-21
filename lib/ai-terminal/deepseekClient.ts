import { terminalResultSchema } from "@/lib/validators/terminal";

import { buildPixardiaSystemPrompt} from "@/lib/ai-terminal/systemPromt";
import {
    type DeepSeekMessage,
    type TerminalLanguage,
    type TerminalRequest,
    type TerminalResult,
} from "./terminalContract";

const DEEPSEEK_API_URL =
    "https://api.deepseek.com/chat/completions";

const DEFAULT_DEEPSEEK_MODEL = "deepseek-v4-flash";
const REQUEST_TIMEOUT_MS = 12_000;

type DeepSeekResponse = {
    choices?: Array<{
        finish_reason?: string;
        message?: {
            content?: string | null;
        };
    }>;
};

const fallbackAnswers: Record<TerminalLanguage, string> = {
    en: "The AI terminal is temporarily unavailable. You can review the services or use the contact form to describe your project.",
    de: "Das KI-Terminal ist vorübergehend nicht verfügbar. Sie können die Dienstleistungen ansehen oder Ihr Projekt über das Kontaktformular beschreiben.",
};

function fallbackResult(
    language: TerminalLanguage,
): TerminalResult {
    return {
        answer: fallbackAnswers[language],
        category: "contact",
        shouldLeadToContact: true,
    };
}

function parseResult(
    content: string,
    language: TerminalLanguage,
): TerminalResult {
    try {
        const parsedJson = JSON.parse(content) as unknown;
        const parsedResult =
            terminalResultSchema.safeParse(parsedJson);

        if (!parsedResult.success) {
            return fallbackResult(language);
        }

        return parsedResult.data;
    } catch {
        return fallbackResult(language);
    }
}

function getResponseContent(
    value: unknown,
): string | null {
    if (
        typeof value !== "object" ||
        value === null ||
        !("choices" in value)
    ) {
        return null;
    }

    const response = value as DeepSeekResponse;
    const content = response.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
        return null;
    }

    return content.trim();
}

export async function getTerminalAnswer(
    input: TerminalRequest,
): Promise<TerminalResult> {
    const apiKey = process.env.DEEPSEEK_API_KEY?.trim();

    if (!apiKey) {
        return fallbackResult(input.language);
    }

    const model =
        process.env.DEEPSEEK_MODEL?.trim() ||
        DEFAULT_DEEPSEEK_MODEL;

    const messages: DeepSeekMessage[] = [
        {
            role: "system",
            content: buildPixardiaSystemPrompt(input.language),
        },
        ...input.history.slice(-6),
        {
            role: "user",
            content: input.message,
        },
    ];

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                messages,
                thinking: {
                    type: "disabled",
                },
                response_format: {
                    type: "json_object",
                },
                temperature: 0.2,
                max_tokens: 350,
                stream: false,
            }),
            cache: "no-store",
            signal: controller.signal,
        });

        if (!response.ok) {
            console.error(
                "deepseek request failed",
                response.status,
            );

            return fallbackResult(input.language);
        }

        const responseBody = (await response.json()) as unknown;
        const content = getResponseContent(responseBody);

        if (!content) {
            return fallbackResult(input.language);
        }

        return parseResult(content, input.language);
    } catch (error) {
        if (
            !(error instanceof Error) ||
            error.name !== "AbortError"
        ) {
            console.error("deepseek request error", error);
        }

        return fallbackResult(input.language);
    } finally {
        clearTimeout(timeoutId);
    }
}