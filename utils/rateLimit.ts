import { redis } from "@/lib/redis";

type RateLimitOptions = {
  limit?: number;

  windowInSeconds?: number;

  namespace?: string;
};

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

export async function rateLimit(
  ip: string,
  options: RateLimitOptions = {},
): Promise<RateLimitResult> {
  const { limit = 10, windowInSeconds = 60, namespace = "default" } = options;

  const key = `rate-limit:${namespace}:${ip}`;

  try {
    const redisPromise = redis.incr(key);
    const timeoutPromise = new Promise<number>((_, reject) => {
      setTimeout(() => reject(new Error("Redis Rate Limit Timeout")), 500);
    });

    const currentRequests = await Promise.race([redisPromise, timeoutPromise]);

    if (currentRequests === 1) {
      await redis.expire(key, windowInSeconds).catch(() => {
        console.warn(`[RateLimit] Failed to set expire for ${key}`);
      });
    }

    const remaining = Math.max(0, limit - currentRequests);
    const success = currentRequests <= limit;

    const reset = Date.now() + windowInSeconds * 1000;

    return {
      success,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Redis Rate Limit Timeout"
    ) {
      console.warn(`[RateLimit] Timeout for ${ip}, allowing request`);
    } else {
      console.error("[RateLimit] Error:", error);
    }

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Date.now() + windowInSeconds * 1000,
    };
  }
}
