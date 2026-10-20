import { createHash } from "node:crypto";

import {
    NextResponse,
    type NextRequest,
} from "next/server";

import { getTerminalAnswer } from "@/lib/ai-terminal/deepseekClient";
import { checkMessage } from "@/lib/ai-terminal/terminalGuard";
import {
    terminalLimits,
    type TerminalLanguage,
    type TerminalResult,
} from "@/lib/ai-terminal/terminalContract";
import { checkRateLimit } from "@/lib/readLimit";
import { terminalRequestSchema } from "@/lib/validators/terminal";

import {
    getClientIp,
    readJsonBodyWithLimit,
    RequestBodyError,
} from "@/lib/server/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateLimitAnswers: Record<
    TerminalLanguage,
    TerminalResult
> = {
    en: {
        answer: "Too many requests were sent. Please wait a moment and try again.",
        category: "unknown",
        shouldLeadToContact: false,
    },
    de: {
        answer: "Es wurden zu viele Anfragen gesendet. Bitte warten Sie kurz und versuchen Sie es erneut.",
        category: "unknown",
        shouldLeadToContact: false,
    },
};

const rateLimitUnavailableAnswers: Record<
    TerminalLanguage,
    TerminalResult
> = {
    en: {
        answer: "The project advisor is temporarily unavailable. Please try again later or use the contact form.",
        category: "contact",
        shouldLeadToContact: true,
    },
    de: {
        answer: "Das KI-Terminal ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut oder verwenden Sie das Kontaktformular.",
        category: "contact",
        shouldLeadToContact: true,
    },
};

function jsonResponse(
    body: unknown,
    status = 200,
    headers: Record<string, string> = {},
): NextResponse {
    return NextResponse.json(body, {
        status,
        headers: {
            "Cache-Control": "no-store, max-age=0",
            ...headers,
        },
    });
}

function getClientIdentifier(
    request: NextRequest,
): string {
    return createHash("sha256")
        .update(getClientIp(request))
        .digest("hex");
}

export async function POST(
    request: NextRequest,
): Promise<NextResponse> {
    let requestBody: unknown;

    try {
        requestBody = await readJsonBodyWithLimit(
            request,
            terminalLimits.requestMaxBytes,
        );
    } catch (error) {
        if (error instanceof RequestBodyError) {
            return jsonResponse(
                {
                    error: error.code,
                },
                error.status,
            );
        }

        return jsonResponse(
            {
                error: "invalid_json",
            },
            400,
        );
    }

    const parsedRequest =
        terminalRequestSchema.safeParse(requestBody);

    if (!parsedRequest.success) {
        return jsonResponse(
            {
                error: "invalid_request",
            },
            400,
        );
    }

    const input = parsedRequest.data;
    const identifier =
        `terminal:${getClientIdentifier(request)}`;

    let rateLimit: Awaited<
        ReturnType<typeof checkRateLimit>
    >;

    try {
        rateLimit =
            await checkRateLimit(identifier);
    } catch {
        console.error(
            "terminal rate limit failed",
        );

        return jsonResponse(
            rateLimitUnavailableAnswers[
                input.language
                ],
            503,
            {
                "Retry-After": "60",
            },
        );
    }

    const rateLimitHeaders = {
        "X-RateLimit-Limit": String(
            rateLimit.limit,
        ),
        "X-RateLimit-Remaining": String(
            rateLimit.remaining,
        ),
        "X-RateLimit-Reset": String(
            rateLimit.reset,
        ),
    };

    if (
        process.env.NODE_ENV === "production" &&
        rateLimit.source !== "distributed"
    ) {
        return jsonResponse(
            rateLimitUnavailableAnswers[
                input.language
                ],
            503,
            {
                ...rateLimitHeaders,
                "Retry-After": "60",
            },
        );
    }

    if (!rateLimit.success) {
        const retryAfter = Math.max(
            1,
            Math.ceil(
                (rateLimit.reset - Date.now()) /
                1000,
            ),
        );

        return jsonResponse(
            rateLimitAnswers[input.language],
            429,
            {
                ...rateLimitHeaders,
                "Retry-After": String(
                    retryAfter,
                ),
            },
        );
    }

    const guardResult = checkMessage(
        input.message,
        input.language,
    );

    if (!guardResult.allowed) {
        return jsonResponse(
            guardResult.result,
            200,
            rateLimitHeaders,
        );
    }

    const result = await getTerminalAnswer(input);

    return jsonResponse(
        result,
        200,
        rateLimitHeaders,
    );
}
