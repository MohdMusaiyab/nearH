import { redis } from "@/lib/redis";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";

type Location = Database["public"]["Tables"]["locations"]["Row"];
type Service = Database["public"]["Tables"]["services_list"]["Row"];
type Specialty = Database["public"]["Tables"]["specialties_list"]["Row"];

const TTL_MASTER = 86400;

const CACHE_VERSION = "v1";

const REDIS_TIMEOUT = 2000;

class CacheError extends Error {
  constructor(
    message: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "CacheError";
  }
}

async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry attempt ${i + 1}/${retries} after ${delay}ms`);
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i)),
      );
    }
  }
  throw new Error("Should never reach here");
}

async function getCachedData<T>(
  cacheKey: string,
  fetchFromDb: () => Promise<T[]>,
  options?: { timeout?: number; version?: string },
): Promise<T[]> {
  const versionedKey = `${options?.version || CACHE_VERSION}:${cacheKey}`;
  const timeout = options?.timeout || REDIS_TIMEOUT;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log(`[Cache] Attempting to get ${versionedKey} from Redis`);

    const cachedData = await Promise.race([
      redis.get<T[]>(versionedKey),
      new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Redis timeout")), timeout);
      }),
    ]).catch((error) => {
      console.warn(`[Cache] Redis error for ${versionedKey}:`, error.message);
      return null;
    });

    clearTimeout(timeoutId);

    if (cachedData) {
      console.log(`[Cache] HIT - ${versionedKey} (${cachedData.length} items)`);
      return cachedData;
    }

    console.log(`[Cache] MISS - ${versionedKey}, fetching from database`);

    const dbData = await fetchWithRetry(fetchFromDb);

    if (!dbData || dbData.length === 0) {
      console.warn(`[Cache] No data found in database for ${versionedKey}`);
      return [];
    }

    redis
      .set(versionedKey, dbData, { ex: TTL_MASTER })
      .then(() =>
        console.log(
          `[Cache] Successfully cached ${versionedKey} (${dbData.length} items)`,
        ),
      )
      .catch((error) =>
        console.error(`[Cache] Failed to cache ${versionedKey}:`, error),
      );

    return dbData;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      console.error(`[Cache] Timeout fetching ${versionedKey}`);
    } else {
      console.error(`[Cache] Unexpected error for ${versionedKey}:`, error);
    }

    console.log(`[Cache] Falling back to database for ${versionedKey}`);
    try {
      return await fetchFromDb();
    } catch (dbError) {
      console.error(
        `[Cache] Database fallback failed for ${versionedKey}:`,
        dbError,
      );
      return [];
    }
  }
}

export async function getCachedLocations(): Promise<Location[]> {
  const cacheKey = "locations";

  const fetchFromDb = async (): Promise<Location[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("city");

    if (error) {
      console.error("[Cache] Database error fetching locations:", error);
      throw new CacheError("Failed to fetch locations from database", error);
    }

    return data || [];
  };

  try {
    return await getCachedData(cacheKey, fetchFromDb);
  } catch (error) {
    console.error("[Cache] Fatal error in getCachedLocations:", error);
    return [];
  }
}

export async function getCachedServices(): Promise<Service[]> {
  const cacheKey = "services";

  const fetchFromDb = async (): Promise<Service[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services_list")
      .select("*")
      .order("service_name");

    if (error) {
      console.error("[Cache] Database error fetching services:", error);
      throw new CacheError("Failed to fetch services from database", error);
    }

    return data || [];
  };

  try {
    return await getCachedData(cacheKey, fetchFromDb);
  } catch (error) {
    console.error("[Cache] Fatal error in getCachedServices:", error);
    return [];
  }
}

export async function getCachedSpecialties(): Promise<Specialty[]> {
  const cacheKey = "specialties";

  const fetchFromDb = async (): Promise<Specialty[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("specialties_list")
      .select("*")
      .order("specialty_name");

    if (error) {
      console.error("[Cache] Database error fetching specialties:", error);
      throw new CacheError("Failed to fetch specialties from database", error);
    }

    return data || [];
  };

  try {
    return await getCachedData(cacheKey, fetchFromDb);
  } catch (error) {
    console.error("[Cache] Fatal error in getCachedSpecialties:", error);
    return [];
  }
}

export async function invalidateLocationsCache(): Promise<void> {
  const versionedKey = `${CACHE_VERSION}:locations`;
  try {
    await redis.del(versionedKey);
    console.log(`[Cache] Invalidated ${versionedKey}`);
  } catch (error) {
    console.error(`[Cache] Failed to invalidate ${versionedKey}:`, error);
  }
}

export async function invalidateServicesCache(): Promise<void> {
  const versionedKey = `${CACHE_VERSION}:services`;
  try {
    await redis.del(versionedKey);
    console.log(`[Cache] Invalidated ${versionedKey}`);
  } catch (error) {
    console.error(`[Cache] Failed to invalidate ${versionedKey}:`, error);
  }
}

export async function invalidateSpecialtiesCache(): Promise<void> {
  const versionedKey = `${CACHE_VERSION}:specialties`;
  try {
    await redis.del(versionedKey);
    console.log(`[Cache] Invalidated ${versionedKey}`);
  } catch (error) {
    console.error(`[Cache] Failed to invalidate ${versionedKey}:`, error);
  }
}

export async function invalidateAllMasterCaches(): Promise<void> {
  await Promise.allSettled([
    invalidateLocationsCache(),
    invalidateServicesCache(),
    invalidateSpecialtiesCache(),
  ]);
  console.log("[Cache] All master caches invalidated");
}
