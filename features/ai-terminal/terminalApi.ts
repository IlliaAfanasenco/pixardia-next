import {
    type TerminalRequest,
    type TerminalResult,
} from "@/lib/ai-terminal/terminalContract";
import { terminalResultSchema } from "@/lib/validators/terminal";

export class TerminalApiError extends Error {
    status: number;
    result?: TerminalResult;

    constructor(
        message: string,
        status: number,
        result?: TerminalResult,
    ) {
        super(message);

        this.name = "TerminalApiError";
        this.status = status;
        this.result = result;
    }
}

export async function requestTerminalAnswer(
    data: TerminalRequest,
    signal?: AbortSignal,
): Promise<TerminalResult> {
    const response = await fetch("/api/terminal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
        credentials: "same-origin",
        signal,
    });

    const body = (await response
        .json()
        .catch(() => null)) as unknown;

    const parsedResult =
        terminalResultSchema.safeParse(body);

    if (!response.ok) {
        throw new TerminalApiError(
            parsedResult.success
                ? parsedResult.data.answer
                : "terminal_request_failed",
            response.status,
            parsedResult.success
                ? parsedResult.data
                : undefined,
        );
    }

    if (!parsedResult.success) {
        throw new TerminalApiError(
            "invalid_terminal_response",
            response.status,
        );
    }

    return parsedResult.data;
}