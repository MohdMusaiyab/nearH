import { unstable_cache, revalidateTag } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

type Location = Database["public"]["Tables"]["locations"]["Row"];
type Service = Database["public"]["Tables"]["services_list"]["Row"];
type Specialty = Database["public"]["Tables"]["specialties_list"]["Row"];

/**
 * Creates a stateless, public Supabase client.
 * Does not read or depend on cookies(), making it safe to execute inside Next.js unstable_cache.
 */
function getPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

/**
 * Native Next.js tagged cache for locations (Cities & States).
 * Purged on-demand via revalidateTag("locations") or revalidateTag("master-data").
 */
export const getCachedLocations = unstable_cache(
  async (): Promise<Location[]> => {
    try {
      const supabase = getPublicClient();
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("city", { ascending: true });

      if (error) {
        console.error("[Cache] Database error fetching locations:", error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("[Cache] Unexpected error fetching locations:", err);
      return [];
    }
  },
  ["master-locations"],
  {
    tags: ["locations", "master-data"],
    revalidate: 86400, // 24 hours
  },
);

/**
 * Native Next.js tagged cache for hospital services catalog.
 * Purged on-demand via revalidateTag("services") or revalidateTag("master-data").
 */
export const getCachedServices = unstable_cache(
  async (): Promise<Service[]> => {
    try {
      const supabase = getPublicClient();
      const { data, error } = await supabase
        .from("services_list")
        .select("*")
        .order("service_name", { ascending: true });

      if (error) {
        console.error("[Cache] Database error fetching services:", error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("[Cache] Unexpected error fetching services:", err);
      return [];
    }
  },
  ["master-services"],
  {
    tags: ["services", "master-data"],
    revalidate: 86400, // 24 hours
  },
);

/**
 * Native Next.js tagged cache for medical specialties catalog.
 * Purged on-demand via revalidateTag("specialties") or revalidateTag("master-data").
 */
export const getCachedSpecialties = unstable_cache(
  async (): Promise<Specialty[]> => {
    try {
      const supabase = getPublicClient();
      const { data, error } = await supabase
        .from("specialties_list")
        .select("*")
        .order("specialty_name", { ascending: true });

      if (error) {
        console.error("[Cache] Database error fetching specialties:", error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("[Cache] Unexpected error fetching specialties:", err);
      return [];
    }
  },
  ["master-specialties"],
  {
    tags: ["specialties", "master-data"],
    revalidate: 86400, // 24 hours
  },
);

export async function invalidateLocationsCache(): Promise<void> {
  try {
    revalidateTag("locations", "max");
  } catch (error) {
    console.error("[Cache] Failed to invalidate locations tag:", error);
  }
}

export async function invalidateServicesCache(): Promise<void> {
  try {
    revalidateTag("services", "max");
  } catch (error) {
    console.error("[Cache] Failed to invalidate services tag:", error);
  }
}

export async function invalidateSpecialtiesCache(): Promise<void> {
  try {
    revalidateTag("specialties", "max");
  } catch (error) {
    console.error("[Cache] Failed to invalidate specialties tag:", error);
  }
}

export async function invalidateAllMasterCaches(): Promise<void> {
  try {
    revalidateTag("master-data", "max");
    revalidateTag("locations", "max");
    revalidateTag("services", "max");
    revalidateTag("specialties", "max");
  } catch (error) {
    console.error("[Cache] Failed to invalidate all master tags:", error);
  }
}
