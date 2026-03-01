"use server";
import { createClient } from "@/lib/supabase/server";
import { LoginSchema, AdminSignupSchema } from "@/lib/validations/auth";
import { ActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { invalidateUserCache } from "@/utils/authCache";
import { redirect } from "next/navigation";
import { redis } from "@/lib/redis";
import { rateLimit } from "@/utils/rateLimit";
import { headers } from "next/headers";
export async function login(formData: unknown): Promise<ActionResponse<null>> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

  const { success: isRateLimitOk } = await rateLimit(ip, {
    limit: 5,
    windowInSeconds: 300,

    namespace: "login",
  });

  if (!isRateLimitOk) {
    return {
      success: false,
      message: "Too many login attempts. Please try again later.",
      data: null,
    };
  }

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
  const supabaseForProfile = await createClient();
  const { data: profile } = await supabaseForProfile
    .from("profiles")
    .select("role, status")
    .eq("id", data.user.id)
    .single();

  revalidatePath("/", "layout");

  if (profile?.role === "superadmin") {
    redirect("/superadmin/dashboard");
  } else if (profile?.role === "admin" && profile?.status === "approved") {
    redirect("/admin/dashboard");
  } else if (profile?.status === "pending") {
    redirect("/auth/waiting-room");
  } else {
    redirect("/");
  }
  return { success: true, message: "Logged in successfully", data: null };
}

export async function signup(formData: unknown): Promise<ActionResponse<null>> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

  const { success: isRateLimitOk } = await rateLimit(ip, {
    limit: 3,
    windowInSeconds: 3600,

    namespace: "signup",
  });

  if (!isRateLimitOk) {
    return {
      success: false,
      message: "Too many signup attempts from this IP. Please try again later.",
      data: null,
    };
  }

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

export async function requestPasswordReset(
  email: string,
): Promise<ActionResponse<null>> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

  const { success: isRateLimitOk } = await rateLimit(ip, {
    limit: 3,
    windowInSeconds: 3600,

    namespace: "request-password-reset",
  });

  if (!isRateLimitOk) {
    return {
      success: false,
      message: "Too many password reset requests. Please try again later.",
      data: null,
    };
  }

  const supabase = await createClient();

  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback?next=/auth/reset-password&type=recovery`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  return {
    success: true,
    message: "Password reset link sent to your email.",
    data: null,
  };
}

import { cookies } from "next/headers";

export async function updateUserPassword(
  password: string,
): Promise<ActionResponse<null>> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";

  const { success: isRateLimitOk } = await rateLimit(ip, {
    limit: 5,
    windowInSeconds: 3600,

    namespace: "update-user-password",
  });

  if (!isRateLimitOk) {
    return {
      success: false,
      message: "Too many password reset attempts. Please try again later.",
      data: null,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
      data: null,
    };
  }

  const cookieStore = await cookies();
  cookieStore.delete("awaiting_password_reset");

  await supabase.auth.signOut();

  return {
    success: true,
    message: "Password updated successfully.",
    data: null,
  };
}

export async function logoutAction() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.auth.signOut();

  if (user?.id) {
    const cacheKey = `user:profile:${user.id}`;
    await redis.del(cacheKey);
  }

  revalidatePath("/", "layout");

  redirect("/auth/login");
}
