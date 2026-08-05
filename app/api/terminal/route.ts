import { createHash } from "node:crypto";
import { isIP } from "node:net";

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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestBodyErrorCode =
    | "invalid_json"
    | "request_too_large"
    | "unsupported_media_type";

class RequestBodyError extends Error {
    code: RequestBodyErrorCode;
    status: number;

    constructor(
        code: RequestBodyErrorCode,
        status: number,
    ) {
        super(code);

        this.name = "RequestBodyError";
        this.code = code;
        this.status = status;
    }
}

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
        answer: "The AI terminal is temporarily unavailable. Please try again later or use the contact form.",
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

function getFirstValidIp(
    value: string | null,
): string | null {
    if (!value) {
        return null;
    }

    for (const part of value.split(",")) {
        const candidate = part.trim();

        if (isIP(candidate) !== 0) {
            return candidate;
        }
    }

    return null;
}

function getClientIp(request: NextRequest): string {
    const cloudflareIp =
        request.headers.get("cf-ray")
            ? getFirstValidIp(
                request.headers.get(
                    "cf-connecting-ip",
                ),
            )
            : null;

    const realIp = getFirstValidIp(
        request.headers.get("x-real-ip"),
    );

    const forwardedIp = getFirstValidIp(
        request.headers.get("x-forwarded-for"),
    );

    return (
        cloudflareIp ||
        realIp ||
        forwardedIp ||
        "unknown"
    );
}

function getClientIdentifier(
    request: NextRequest,
): string {
    return createHash("sha256")
        .update(getClientIp(request))
        .digest("hex");
}

async function readJsonBodyWithLimit(
    request: NextRequest,
    maxBytes: number,
): Promise<unknown> {
    const mediaType = (
        request.headers
            .get("content-type")
            ?.split(";")[0] ?? ""
    )
        .trim()
        .toLowerCase();

    if (mediaType !== "application/json") {
        throw new RequestBodyError(
            "unsupported_media_type",
            415,
        );
    }

    const declaredLengthHeader =
        request.headers.get("content-length");

    if (declaredLengthHeader) {
        const declaredLength = Number(
            declaredLengthHeader,
        );

        if (
            Number.isFinite(declaredLength) &&
            declaredLength > maxBytes
        ) {
            throw new RequestBodyError(
                "request_too_large",
                413,
            );
        }
    }

    if (!request.body) {
        throw new RequestBodyError(
            "invalid_json",
            400,
        );
    }

    const reader = request.body.getReader();
    const decoder = new TextDecoder("utf-8", {
        fatal: true,
    });

    let totalBytes = 0;
    let bodyText = "";

    try {
        while (true) {
            const chunk = await reader.read();

            if (chunk.done) {
                break;
            }

            totalBytes += chunk.value.byteLength;

            if (totalBytes > maxBytes) {
                await reader
                    .cancel()
                    .catch(() => undefined);

                throw new RequestBodyError(
                    "request_too_large",
                    413,
                );
            }

            bodyText += decoder.decode(
                chunk.value,
                {
                    stream: true,
                },
            );
        }

        bodyText += decoder.decode();
    } catch (error) {
        if (error instanceof RequestBodyError) {
            throw error;
        }

        throw new RequestBodyError(
            "invalid_json",
            400,
        );
    } finally {
        reader.releaseLock();
    }

    if (!bodyText.trim()) {
        throw new RequestBodyError(
            "invalid_json",
            400,
        );
    }

    try {
        return JSON.parse(bodyText) as unknown;
    } catch {
        throw new RequestBodyError(
            "invalid_json",
            400,
        );
    }
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
