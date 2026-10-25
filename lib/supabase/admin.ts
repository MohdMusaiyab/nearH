import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

/**
 * Server-only Supabase client initialized with the privileged SERVICE_ROLE_KEY.
 * Bypasses Row Level Security (RLS) to perform administrative tasks (e.g. auth.admin user lookups).
 * NEVER import this into client components or expose it to the browser.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is not configured in environment.");
    return null;
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

