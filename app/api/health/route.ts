import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { redis } from "@/lib/redis";

export async function GET() {
  try {
    // 1. Check Supabase connection
    const supabase = await createClient();
    const { count, error: dbError } = await supabase
      .from("hospitals")
      .select("*", { count: "exact", head: true });

    const dbStatus = dbError ? "error" : "ok";

    // 2. Check Redis connection
    let redisStatus = "error";
    try {
      const ping = await redis.ping();
      if (ping === "PONG") {
        redisStatus = "ok";
      }
    } catch (e) {
      console.error("Redis health check failed:", e);
    }

    const overallStatus = dbStatus === "ok" && redisStatus === "ok" ? 200 : 503;

    return NextResponse.json(
      {
        status: overallStatus === 200 ? "healthy" : "unhealthy",
        timestamp: new Date().toISOString(),
        services: {
          supabase: dbStatus,
          redis: redisStatus,
        },
      },
      { status: overallStatus }
    );
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
