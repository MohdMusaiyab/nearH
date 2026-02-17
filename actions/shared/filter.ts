"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionResponse } from "@/types/response";
import { Database } from "@/types/database.types";

type Location = Database["public"]["Tables"]["locations"]["Row"];
type Specialty = Database["public"]["Tables"]["specialties_list"]["Row"];
type Service = Database["public"]["Tables"]["services_list"]["Row"];

export async function getExploreFilters(): Promise<
  ActionResponse<{
    locations: Location[];
    specialties: Specialty[];
    services: Service[];
  }>
> {
  const supabase = await createClient();

  const [locRes, specRes, servRes] = await Promise.all([
    supabase.from("locations").select("*").order("city", { ascending: true }),
    supabase
      .from("specialties_list")
      .select("*")
      .order("specialty_name", { ascending: true }),
    supabase
      .from("services_list")
      .select("*")
      .order("service_name", { ascending: true }),
  ]);

  if (locRes.error)
    return { success: false, message: locRes.error.message, data: null };
  if (specRes.error)
    return { success: false, message: specRes.error.message, data: null };
  if (servRes.error)
    return { success: false, message: servRes.error.message, data: null };

  return {
    success: true,
    message: "Filters loaded",
    data: {
      locations: locRes.data,
      specialties: specRes.data,
      services: servRes.data,
    },
  };
}
