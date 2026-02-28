import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(`${origin}${next}`);

      // If it's a recovery flow, set a secure cookie
      if (type === "recovery") {
        response.cookies.set("awaiting_password_reset", "true", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 15, // 15 minutes expiration
        });
      }

      return response;
    }
  }

  return NextResponse.redirect(
    `${origin}/auth/login?error=Session expired or invalid link`,
  );
}
