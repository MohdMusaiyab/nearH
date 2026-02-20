import { redis } from "@/lib/redis";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const redisWithTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T | null> => {
  return Promise.race([
    promise,
    new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("Redis Timeout")), timeoutMs),
    ),
  ]).catch(() => null); // On timeout or error, return null to trigger DB fallback
};

export async function getAuthenticatedProfile(): Promise<Profile | null> {
  console.log("🚀 Starting getAuthenticatedProfile");
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("Auth check:", { user: user?.id, authError });

  if (authError || !user) {
    console.log("❌ No authenticated user");
    return null;
  }

  const cacheKey = `user:profile:${user.id}`;
  console.log(`Cache key: ${cacheKey}`);

  try {
    // 1. Try Redis with timeout
    console.log("🔍 Attempting Redis get...");
    const cachedData = await redisWithTimeout(
      redis.get<Profile>(cacheKey),
      500,
    );

    if (cachedData) {
      console.log("✅ Redis HIT - returning cached profile", {
        role: cachedData.role,
        hospitalId: cachedData.associated_hospital_id,
      });

      // 🔴 CRITICAL FIX: Even if cache hit, validate the data
      // If hospital_id is null but this is an admin, cache might be stale
      if (cachedData.role === "admin" && !cachedData.associated_hospital_id) {
        console.log(
          "⚠️ Cached admin has no hospital ID - possible stale cache, fetching fresh",
        );
        // Proceed to DB fetch (don't return cached data)
      } else {
        return cachedData;
      }
    }

    console.log("⚠️ Redis MISS or TIMEOUT - Querying Database");

    // 2. Query Database
    console.log("📡 Executing Supabase query...");
    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle(); // Use maybeSingle() instead of single()

    if (dbError) {
      console.log("❌ Supabase error:", dbError);
      return null;
    }

    if (!profile) {
      console.log("❌ No profile found in DB");
      return null;
    }

    console.log("✅ Profile found in DB:", {
      id: profile.id,
      role: profile.role,
      status: profile.status,
      hospitalId: profile.associated_hospital_id,
    });

    // 3. Only cache if it's valid data
    if (profile.role === "admin" && !profile.associated_hospital_id) {
      console.log("⚠️ Admin has no hospital ID - not caching this state");
      return profile; // Return but don't cache
    }

    // 4. Backfill Redis (don't await)
    console.log("🔄 Backfilling Redis cache...");
    redis
      .set(cacheKey, profile, { ex: 3600 })
      .then(() => console.log("✅ Redis backfill complete"))
      .catch((e) => console.log("❌ Redis backfill failed:", e));

    return profile;
  } catch (err) {
    console.log("💥 Unexpected error:", err);
    return null;
  }
}

export async function invalidateUserCache(userId: string) {
  try {
    await redis.del(`user:profile:${userId}`);
  } catch (e) {
    console.error("Redis Delete Error:", e);
  }
}
