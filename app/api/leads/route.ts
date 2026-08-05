import { createHash } from "node:crypto";
import { isIP } from "node:net";

import {
    NextResponse,
    type NextRequest,
} from "next/server";

import { getServiceByCode } from "@/content/services";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/readLimit";
import { leadSchema } from "@/lib/validators/lead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = 20_000;

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

function response(
    body: unknown,
    status: number,
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

function getRateLimitIdentifier(
    request: NextRequest,
): string {
    const identifier = createHash("sha256")
        .update(getClientIp(request))
        .digest("hex");

    return `lead:${identifier}`;
}

function getSourcePage(
    request: NextRequest,
): string | null {
    const referer = request.headers.get("referer");

    if (!referer) {
        return null;
    }

    try {
        const url = new URL(referer);

        if (url.origin !== request.nextUrl.origin) {
            return null;
        }

        if (
            !url.pathname.startsWith("/") ||
            url.pathname.length > 500
        ) {
            return null;
        }

        return url.pathname;
    } catch {
        return null;
    }
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
    let rateLimit: Awaited<
        ReturnType<typeof checkRateLimit>
    >;

    try {
        rateLimit = await checkRateLimit(
            getRateLimitIdentifier(request),
        );
    } catch {
        console.error(
            "lead rate limit failed",
        );

        return response(
            {
                ok: false,
                error: "service_unavailable",
            },
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
        return response(
            {
                ok: false,
                error: "service_unavailable",
            },
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

        return response(
            {
                ok: false,
                error: "too_many_requests",
            },
            429,
            {
                ...rateLimitHeaders,
                "Retry-After": String(
                    retryAfter,
                ),
            },
        );
    }

    let body: unknown;

    try {
        body = await readJsonBodyWithLimit(
            request,
            MAX_REQUEST_BYTES,
        );
    } catch (error) {
        if (error instanceof RequestBodyError) {
            return response(
                {
                    ok: false,
                    error: error.code,
                },
                error.status,
                rateLimitHeaders,
            );
        }

        return response(
            {
                ok: false,
                error: "invalid_json",
            },
            400,
            rateLimitHeaders,
        );
    }

    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
        return response(
            {
                ok: false,
                error: "invalid_request",
                fields:
                parsed.error.flatten().fieldErrors,
            },
            400,
            rateLimitHeaders,
        );
    }

    if (parsed.data.website) {
        return response(
            {
                ok: true,
            },
            201,
            rateLimitHeaders,
        );
    }

    const service = getServiceByCode(
        parsed.data.serviceCode,
    );

    if (!service) {
        return response(
            {
                ok: false,
                error: "invalid_service",
            },
            400,
            rateLimitHeaders,
        );
    }

    try {
        await prisma.lead.create({
            data: {
                name: parsed.data.name,
                email: parsed.data.email,
                phone:
                    parsed.data.phone ?? null,
                message: parsed.data.message,
                language: parsed.data.language,
                serviceCode:
                parsed.data.serviceCode,
                serviceSlug: service.slug,
                sourcePage:
                    getSourcePage(request),
                privacyAcceptedAt: new Date(),
            },
        });

        return response(
            {
                ok: true,
            },
            201,
            rateLimitHeaders,
        );
    } catch {
        console.error("lead create failed");

        return response(
            {
                ok: false,
                error: "server_error",
            },
            500,
            rateLimitHeaders,
        );
    }
}
