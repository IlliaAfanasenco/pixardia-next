import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const LIMIT = 8;
const WINDOW_MS = 60_000;

type MemoryEntry = {
    count: number;
    reset: number;
};

export type RateLimitResult = {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
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
    if (memoryStore.size < 1_000) {
        return;
    }

    for (const [key, entry] of memoryStore) {
        if (entry.reset <= now) {
            memoryStore.delete(key);
        }
    }
}

function checkMemoryRateLimit(
    identifier: string,
): RateLimitResult {
    const now = Date.now();

    cleanupMemoryStore(now);

    const currentEntry = memoryStore.get(identifier);

    if (!currentEntry || currentEntry.reset <= now) {
        const reset = now + WINDOW_MS;

        memoryStore.set(identifier, {
            count: 1,
            reset,
        });

        return {
            success: true,
            limit: LIMIT,
            remaining: LIMIT - 1,
            reset,
        };
    }

    currentEntry.count += 1;

    return {
        success: currentEntry.count <= LIMIT,
        limit: LIMIT,
        remaining: Math.max(0, LIMIT - currentEntry.count),
        reset: currentEntry.reset,
    };
}

export async function checkRateLimit(
    identifier: string,
): Promise<RateLimitResult> {
    if (!distributedRateLimit) {
        return checkMemoryRateLimit(identifier);
    }

    try {
        const result =
            await distributedRateLimit.limit(identifier);

        return {
            success: result.success,
            limit: result.limit,
            remaining: Math.max(0, result.remaining),
            reset: result.reset,
        };
    } catch (error) {
        console.error("distributed rate limit failed", error);

        return checkMemoryRateLimit(identifier);
    }
}