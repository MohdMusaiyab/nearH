"use server";

import { createClient } from "@/lib/supabase/server";
import { LoginSchema, AdminSignupSchema } from "@/lib/validations/auth";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";

export async function login(formData: unknown): Promise<ActionResponse> {
  console.log("Done from here");
  const validatedFields = LoginSchema.safeParse(formData);
  console.log("In here");
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

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: error.message, data: null };
  }

  revalidatePath("/", "layout");
  return { success: true, message: "Logged in successfully", data: null };
}

export async function signup(formData: unknown): Promise<ActionResponse> {
  const validatedFields = AdminSignupSchema.safeParse(formData);
console.log("Here");
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

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  });

  if (authError || !authData.user)
    return {
      success: false,
      message: authError?.message || "Auth failed",
      data: null,
    };

  const { data: hospData, error: hospError } = await supabase
    .from("hospitals")
    .insert({
      name: hospital_name,
      official_email: official_email,

      official_phone: official_phone,

      location_id: location_id,
      has_ayushman_bharat: has_ayushman_bharat,
      emergency_contact: emergency_contact,
      is_verified: false,
    })
    .select()
    .single();

  if (hospError)
    return { success: false, message: hospError.message, data: null };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      associated_hospital_id: hospData.id,

      role: "admin",
      status: "pending",
    })
    .eq("id", authData.user.id);
  if (profileError) {
    return { success: false, message: "Profile linking failed", data: null };
  }

  revalidatePath("/", "layout");
  return {
    success: true,
    message: "Account created! Please wait in the waiting room for approval.",
    data: null,
  };
}
