"use client";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    TerminalApiError,
    requestTerminalAnswer,
} from "@/features/ai-terminal/terminalApi";
import {
    type TerminalCategory,
    type TerminalHistoryMessage,
    type TerminalLanguage,
} from "@/lib/ai-terminal/terminalContract";

export type TerminalUiMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
    category?: TerminalCategory;
    shouldLeadToContact?: boolean;
};

type TerminalStatus =
    | "idle"
    | "submitting"
    | "error";

const MAX_INPUT_LENGTH = 800;
const MAX_HISTORY_LENGTH = 6;
const MAX_MESSAGES_LENGTH = 12;

const errorMessages: Record<TerminalLanguage, string> = {
    en: "The terminal is temporarily unavailable. Please try again.",
    de: "Das Terminal ist vorübergehend nicht verfügbar. Bitte versuchen Sie es erneut.",
};

const validationMessages: Record<
    TerminalLanguage,
    {
        short: string;
        long: string;
    }
> = {
    en: {
        short: "Enter at least 2 characters.",
        long: "The message must not exceed 800 characters.",
    },
    de: {
        short: "Geben Sie mindestens 2 Zeichen ein.",
        long: "Die Nachricht darf höchstens 800 Zeichen enthalten.",
    },
};

function createMessageId(): string {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isAbortError(error: unknown): boolean {
    return (
        error instanceof Error &&
        error.name === "AbortError"
    );
}

export function useAiTerminal(
    language: TerminalLanguage = "en",
) {
    const [input, setInputState] = useState("");
    const [messages, setMessages] = useState<
        TerminalUiMessage[]
    >([]);
    const [status, setStatus] =
        useState<TerminalStatus>("idle");
    const [error, setError] = useState("");

    const controllerRef =
        useRef<AbortController | null>(null);

    useEffect(() => {
        return () => {
            controllerRef.current?.abort();
        };
    }, []);

    const isSubmitting = status === "submitting";

    const shouldLeadToContact = useMemo(() => {
        for (
            let index = messages.length - 1;
            index >= 0;
            index -= 1
        ) {
            const message = messages[index];

            if (message.role === "assistant") {
                return (
                    message.shouldLeadToContact === true
                );
            }
        }

        return false;
    }, [messages]);

    function setInput(value: string): void {
        setInputState(value);

        if (status === "error") {
            setStatus("idle");
            setError("");
        }
    }

    function appendMessage(
        message: TerminalUiMessage,
    ): void {
        setMessages((current) =>
            [...current, message].slice(
                -MAX_MESSAGES_LENGTH,
            ),
        );
    }

    async function submit(): Promise<void> {
        if (isSubmitting) {
            return;
        }

        const message = input.trim();

        if (message.length < 2) {
            setError(validationMessages[language].short);
            setStatus("error");

            return;
        }

        if (message.length > MAX_INPUT_LENGTH) {
            setError(validationMessages[language].long);
            setStatus("error");

            return;
        }

        const history: TerminalHistoryMessage[] =
            messages
                .slice(-MAX_HISTORY_LENGTH)
                .map((item) => ({
                    role: item.role,
                    content: item.content,
                }));

        const userMessage: TerminalUiMessage = {
            id: createMessageId(),
            role: "user",
            content: message,
        };

        appendMessage(userMessage);

        setInputState("");
        setError("");
        setStatus("submitting");

        controllerRef.current?.abort();

        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const result =
                await requestTerminalAnswer(
                    {
                        message,
                        history,
                        language,
                    },
                    controller.signal,
                );

            const assistantMessage: TerminalUiMessage = {
                id: createMessageId(),
                role: "assistant",
                content: result.answer,
                category: result.category,
                shouldLeadToContact:
                result.shouldLeadToContact,
            };

            appendMessage(assistantMessage);
            setStatus("idle");
        } catch (requestError) {
            if (isAbortError(requestError)) {
                return;
            }

            if (
                requestError instanceof TerminalApiError &&
                requestError.result
            ) {
                const assistantMessage: TerminalUiMessage = {
                    id: createMessageId(),
                    role: "assistant",
                    content: requestError.result.answer,
                    category:
                    requestError.result.category,
                    shouldLeadToContact:
                    requestError.result
                        .shouldLeadToContact,
                };

                appendMessage(assistantMessage);
                setError("");
                setStatus("idle");
            } else {
                setError(errorMessages[language]);
                setStatus("error");
            }
        } finally {
            if (
                controllerRef.current === controller
            ) {
                controllerRef.current = null;
            }
        }
    }

    function reset(): void {
        controllerRef.current?.abort();
        controllerRef.current = null;

        setInputState("");
        setMessages([]);
        setError("");
        setStatus("idle");
    }

    return {
        input,
        setInput,
        messages,
        error,
        status,
        isSubmitting,
        shouldLeadToContact,
        submit,
        reset,
    };
}