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
    const currentRequests = await redis.incr(key);

    if (currentRequests === 1) {
      await redis.expire(key, windowInSeconds);
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
    console.error("Rate limiting error:", error);

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Date.now() + windowInSeconds * 1000,
    };
  }
}
