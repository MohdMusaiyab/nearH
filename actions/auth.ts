"use server";
import { createClient } from "@/lib/supabase/server";
import { LoginSchema, AdminSignupSchema } from "@/lib/validations/auth";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { invalidateUserCache } from "@/utils/authCache";
export async function login(formData: unknown): Promise<ActionResponse<null>> {
  const validatedFields = LoginSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      data: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email, password } = validatedFields.data;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data?.user) {
    const errorMessage =
      error?.message ?? "Invalid credentials. Please try again.";
    return { success: false, message: errorMessage, data: null };
  }
  await invalidateUserCache(data.user.id);
  revalidatePath("/", "layout");
  return { success: true, message: "Logged in successfully", data: null };
}
export async function signup(formData: unknown): Promise<ActionResponse<null>> {
  const validatedFields = AdminSignupSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      data: null,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const {
    email,
    password,
    full_name,
    hospital_name,
    official_email,
    official_phone,
    location_id,
    has_ayushman_bharat,
    emergency_contact,
  } = validatedFields.data;
  const supabase = await createClient();
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    });
    if (authError || !authData?.user) {
      throw new Error(
        authError?.message ?? "Authentication failed during signup.",
      );
    }
    const { data: hospData, error: hospError } = await supabase
      .from("hospitals")
      .insert({
        name: hospital_name,
        official_email,
        official_phone,
        location_id,
        has_ayushman_bharat,
        emergency_contact,
        is_verified: false,
      })
      .select()
      .single();
    if (hospError || !hospData) {
      throw new Error("Hospital record creation failed.");
    }
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        associated_hospital_id: hospData.id,
        role: "admin",
        status: "pending",
      })
      .eq("id", authData.user.id);
    if (profileError) {
      throw new Error("Could not link profile to hospital.");
    }
    await invalidateUserCache(authData.user.id);
    revalidatePath("/", "layout");
    return {
      success: true,
      message: "Registration successful! Please wait for Superadmin approval.",
      data: null,
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error
        ? err.message
        : "An unexpected error occurred during signup.";
    return { success: false, message: msg, data: null };
  }
}
