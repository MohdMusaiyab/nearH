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
    const pipe = redis.pipeline();
    pipe.incr(key);
    pipe.expire(key, windowInSeconds, "NX");

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Redis Rate Limit Timeout")), 500);
    });

    const results = await Promise.race([
      pipe.exec<[number, 0 | 1]>(),
      timeoutPromise,
    ]);

    const currentRequests = (results?.[0] as number) ?? 1;

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
