import { createHash } from "node:crypto";

import {
    NextResponse,
    type NextRequest,
} from "next/server";

import { getTerminalAnswer } from "@/lib/ai-terminal/deepseekClient";
import { checkMessage } from "@/lib/ai-terminal/terminalGuard";
import {
    type TerminalLanguage,
    type TerminalResult,
} from "@/lib/ai-terminal/terminalContract";
import { checkRateLimit } from "@/lib/readLimit";
import { terminalRequestSchema } from "@/lib/validators/terminal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = 16_000;

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

function getClientIp(request: NextRequest): string {
    const forwardedFor = request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim();

    return (
        forwardedFor ||
        request.headers.get("x-real-ip") ||
        request.headers.get("cf-connecting-ip") ||
        "local"
    );
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
    const contentLength = Number(
        request.headers.get("content-length") ?? 0,
    );

    if (
        Number.isFinite(contentLength) &&
        contentLength > MAX_REQUEST_BYTES
    ) {
        return jsonResponse(
            {
                error: "request_too_large",
            },
            413,
        );
    }

    let requestBody: unknown;

    try {
        requestBody = await request.json();
    } catch {
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
                fields:
                parsedRequest.error.flatten().fieldErrors,
            },
            400,
        );
    }

    const input = parsedRequest.data;
    const identifier = `terminal:${getClientIdentifier(request)}`;
    const rateLimit = await checkRateLimit(identifier);

    const rateLimitHeaders = {
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(
            rateLimit.remaining,
        ),
        "X-RateLimit-Reset": String(rateLimit.reset),
    };

    if (!rateLimit.success) {
        const retryAfter = Math.max(
            1,
            Math.ceil(
                (rateLimit.reset - Date.now()) / 1000,
            ),
        );

        return jsonResponse(
            rateLimitAnswers[input.language],
            429,
            {
                ...rateLimitHeaders,
                "Retry-After": String(retryAfter),
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