import { getAuthenticatedProfile } from "@/utils/authCache";
import { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Validates that the current user is an authenticated Superadmin.
 * Returns { isSuperAdmin: true, profile } on success.
 * Returns { isSuperAdmin: false, error: "..." } on failure.
 */
export async function validateSuperAdmin(): Promise<{
  isSuperAdmin: boolean;
  error?: string;
  profile?: Profile;
}> {
  const profile = await getAuthenticatedProfile();
  if (!profile || profile.role !== "superadmin") {
    return {
      isSuperAdmin: false,
      error: "Unauthorized: Superadmin access required.",
    };
  }
  return { isSuperAdmin: true, profile };
}

/**
 * Validates that the current user is an approved Hospital Admin associated with a hospital.
 * Returns { hospitalId, userId, profile } on success.
 * Returns { hospitalId: null, userId: null, profile: null, error: "..." } on failure.
 */
export async function getValidatedAdminContext(): Promise<{
  hospitalId: string | null;
  userId: string | null;
  profile: Profile | null;
  error?: string;
}> {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return {
      hospitalId: null,
      userId: null,
      profile: null,
      error: "Unauthorized - Not logged in",
    };
  }

  if (profile.role !== "admin") {
    return {
      hospitalId: null,
      userId: null,
      profile: null,
      error: "Unauthorized - Admin only",
    };
  }

  if (profile.status !== "approved") {
    return {
      hospitalId: null,
      userId: null,
      profile: null,
      error: "Account pending approval",
    };
  }

  if (!profile.associated_hospital_id) {
    return {
      hospitalId: null,
      userId: null,
      profile: null,
      error: "No hospital associated with this account",
    };
  }

  return {
    hospitalId: profile.associated_hospital_id,
    userId: profile.id,
    profile,
  };
}

/**
 * Convenience helper that validates an approved Admin and extracts only the hospitalId.
 * Directly replaces the local getValidatedAdminHospitalId() implementations.
 */
export async function getValidatedAdminHospitalId(): Promise<{
  hospitalId: string | null;
  error?: string;
}> {
  const context = await getValidatedAdminContext();
  return {
    hospitalId: context.hospitalId,
    error: context.error,
  };
}

