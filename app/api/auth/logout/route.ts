import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // 1. Sign out on the server
  await supabase.auth.signOut();

  // 2. Clear the cache and redirect
  // We use the origin to ensure the absolute URL is correct
  const { origin } = new URL(request.url);
  
  // 303 is the standard for "POST then Redirect to GET"
  return NextResponse.redirect(`${origin}/auth/login`, { 
    status: 303 
  });
}