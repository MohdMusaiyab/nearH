// app/api/auth/me/route.ts
import { getAuthenticatedProfile } from "@/utils/authCache"; // Path to your Redis func
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const profile = await getAuthenticatedProfile();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
