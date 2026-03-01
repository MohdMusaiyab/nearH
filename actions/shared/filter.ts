"use server";
import { ActionResponse } from "@/types/response";
import { Database } from "@/types/database.types";
import {
  getCachedLocations,
  getCachedSpecialties,
  getCachedServices,
} from "@/utils/masterCache";
type Location = Database["public"]["Tables"]["locations"]["Row"];
type Specialty = Database["public"]["Tables"]["specialties_list"]["Row"];
type Service = Database["public"]["Tables"]["services_list"]["Row"];
import { rateLimit } from "@/utils/rateLimit";
import { headers } from "next/headers";

export async function getExploreFilters(): Promise<
  ActionResponse<{
    locations: Location[];
    specialties: Specialty[];
    services: Service[];
  }>
> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
  const { success: isRateLimitOk } = await rateLimit(ip, {
    limit: 30,
    windowInSeconds: 60,
    namespace: "explore-filters",
  });
  if (!isRateLimitOk) {
    return {
      success: false,
      message: "Too many requests. Please try again later.",
      data: null,
    };
  }

  try {
    const [locations, specialties, services] = await Promise.all([
      getCachedLocations(),
      getCachedSpecialties(),
      getCachedServices(),
    ]);
    if (
      locations.length === 0 &&
      specialties.length === 0 &&
      services.length === 0
    ) {
      return {
        success: false,
        message: "Unable to load filters at this time.",
        data: null,
      };
    }
    return {
      success: true,
      message: "Filters synced from high-speed cache",
      data: {
        locations,
        specialties,
        services,
      },
    };
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred loading filters";
    console.error(`[ExploreFilters Error]: ${msg}`);
    return {
      success: false,
      message: msg,
      data: null,
    };
  }
}
