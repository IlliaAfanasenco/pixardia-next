import { createHash } from "node:crypto";

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

function getClientIp(request: NextRequest): string {
    return (
        request.headers
            .get("x-forwarded-for")
            ?.split(",")[0]
            ?.trim() ||
        request.headers.get("x-real-ip") ||
        request.headers.get("cf-connecting-ip") ||
        "local"
    );
}

function getRateLimitIdentifier(
    request: NextRequest,
): string {
    const ip = getClientIp(request);

    const hash = createHash("sha256")
        .update(ip)
        .digest("hex");

    return `lead:${hash}`;
}

function getSourcePage(request: NextRequest): string | null {
    const referer = request.headers.get("referer");

    if (!referer) {
        return null;
    }

    try {
        const url = new URL(referer);

        return `${url.pathname}${url.search}`.slice(0, 500);
    } catch {
        return null;
    }
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
        return response(
            {
                ok: false,
                error: "request_too_large",
            },
            413,
        );
    }

    const rateLimit = await checkRateLimit(
        getRateLimitIdentifier(request),
    );

    const rateLimitHeaders = {
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(
            rateLimit.remaining,
        ),
        "X-RateLimit-Reset": String(rateLimit.reset),
    };

    if (!rateLimit.success) {
        return response(
            {
                ok: false,
                error: "too_many_requests",
            },
            429,
            rateLimitHeaders,
        );
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
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
                phone: parsed.data.phone ?? null,
                message: parsed.data.message,
                language: parsed.data.language,
                serviceCode: parsed.data.serviceCode,
                serviceSlug: service.slug,
                sourcePage: getSourcePage(request),
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
    } catch (error) {
        console.error("lead create failed", error);

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