import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "@/types/database.types";
import { redis } from "@/lib/redis";

type Profile = {
  role: Database["public"]["Enums"]["user_role"] | null;
  status: Database["public"]["Enums"]["approval_status"] | null;
};

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, searchParams } = request.nextUrl;

  // ✅ Detect recovery flow from Supabase email link
  const isRecoveryFlow = searchParams.get("type") === "recovery";

  // 🚨 If in recovery mode → only allow reset-password page
  if (isRecoveryFlow && pathname !== "/auth/reset-password") {
    return NextResponse.redirect(new URL("/auth/reset-password", request.url));
  }

  let profile: Profile | null = null;

  if (user) {
    const cacheKey = `user:profile:${user.id}`;

    try {
      const cached = await redis.get<Profile>(cacheKey);

      if (cached) {
        profile = cached;
      } else {
        const { data } = await supabase
          .from("profiles")
          .select("role, status")
          .eq("id", user.id)
          .single();

        profile = data;

        if (profile) {
          redis.set(cacheKey, profile, { ex: 3600 }).catch(console.error);
        }
      }
    } catch {
      const { data } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", user.id)
        .single();
      profile = data;
    }
  }

  // Skip static & API
  if (pathname.startsWith("/_next") || pathname.includes("/api/")) {
    return response;
  }

  // ✅ Auth routes redirect if already logged in
  if (user && pathname.startsWith("/auth")) {
    if (pathname === "/auth/waiting-room") return response;
    if (pathname === "/auth/reset-password") return response;

    const dest = profile?.role === "superadmin" ? "/superadmin" : "/admin";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Pending users
  if (user && profile?.status === "pending") {
    if (pathname !== "/auth/waiting-room") {
      return NextResponse.redirect(new URL("/auth/waiting-room", request.url));
    }
    return response;
  }

  // Approved user shouldn’t see waiting room
  if (
    user &&
    profile?.status === "approved" &&
    pathname === "/auth/waiting-room"
  ) {
    const dest = profile?.role === "superadmin" ? "/superadmin" : "/admin";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Shared routes
  if (pathname.startsWith("/shared")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const isAuthorized =
      profile?.role === "admin" || profile?.role === "superadmin";

    if (!isAuthorized || profile?.status !== "approved") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return response;
  }

  // Superadmin guard
  if (pathname.startsWith("/superadmin") && profile?.role !== "superadmin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin guard
  if (pathname.startsWith("/admin")) {
    if (profile?.role !== "admin" || profile?.status !== "approved") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Unauthenticated protection
  if (
    !user &&
    (pathname.startsWith("/admin") || pathname.startsWith("/superadmin"))
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
