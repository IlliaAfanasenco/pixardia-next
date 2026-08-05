import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const LIMIT = 8;
const WINDOW_MS = 60_000;
const MAX_MEMORY_ENTRIES = 1_000;
const MAX_DEDICATED_MEMORY_ENTRIES =
    MAX_MEMORY_ENTRIES - 1;
const OVERFLOW_MEMORY_KEY = "__overflow__";

type MemoryEntry = {
    count: number;
    reset: number;
};

export type RateLimitSource =
    | "distributed"
    | "memory"
    | "memory-fallback";

export type RateLimitResult = {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
    source: RateLimitSource;
};

const memoryStore = new Map<string, MemoryEntry>();

const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL?.trim();

const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

const distributedRateLimit =
    redisUrl && redisToken
        ? new Ratelimit({
            redis: new Redis({
                url: redisUrl,
                token: redisToken,
            }),
            limiter: Ratelimit.slidingWindow(8, "1 m"),
            analytics: false,
            prefix: "pixardia:api",
        })
        : null;

function cleanupMemoryStore(now: number): void {
    for (const [key, entry] of memoryStore) {
        if (entry.reset <= now) {
            memoryStore.delete(key);
        }
    }
}

function getMemoryIdentifier(
    identifier: string,
    now: number,
): string {
    if (
        memoryStore.size >=
        MAX_DEDICATED_MEMORY_ENTRIES
    ) {
        cleanupMemoryStore(now);
    }

    if (memoryStore.has(identifier)) {
        return identifier;
    }

    if (
        memoryStore.size <
        MAX_DEDICATED_MEMORY_ENTRIES
    ) {
        return identifier;
    }

    return OVERFLOW_MEMORY_KEY;
}

function checkMemoryRateLimit(
    identifier: string,
    source: Extract<
        RateLimitSource,
        "memory" | "memory-fallback"
    >,
): RateLimitResult {
    const now = Date.now();
    const memoryIdentifier =
        getMemoryIdentifier(identifier, now);

    const currentEntry =
        memoryStore.get(memoryIdentifier);

    if (!currentEntry || currentEntry.reset <= now) {
        const reset = now + WINDOW_MS;

        memoryStore.set(memoryIdentifier, {
            count: 1,
            reset,
        });

        return {
            success: true,
            limit: LIMIT,
            remaining: LIMIT - 1,
            reset,
            source,
        };
    }

    currentEntry.count += 1;

    return {
        success: currentEntry.count <= LIMIT,
        limit: LIMIT,
        remaining: Math.max(
            0,
            LIMIT - currentEntry.count,
        ),
        reset: currentEntry.reset,
        source,
    };
}

export async function checkRateLimit(
    identifier: string,
): Promise<RateLimitResult> {
    if (!distributedRateLimit) {
        return checkMemoryRateLimit(
            identifier,
            "memory",
        );
    }

    try {
        const result =
            await distributedRateLimit.limit(identifier);

        return {
            success: result.success,
            limit: result.limit,
            remaining: Math.max(
                0,
                result.remaining,
            ),
            reset: result.reset,
            source: "distributed",
        };
    } catch {
        console.error(
            "distributed rate limit unavailable",
        );

        return checkMemoryRateLimit(
            identifier,
            "memory-fallback",
        );
    }
}
