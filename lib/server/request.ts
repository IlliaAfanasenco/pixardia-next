import { isIP } from "node:net";
import type { NextRequest } from "next/server";

type RequestBodyErrorCode =
    | "invalid_json"
    | "request_too_large"
    | "unsupported_media_type";

export class RequestBodyError extends Error {
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

export function getClientIp(request: NextRequest): string {
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

export async function readJsonBodyWithLimit(
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

