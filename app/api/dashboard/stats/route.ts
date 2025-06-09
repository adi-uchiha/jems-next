import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get active sessions count
    const activeSessions = await db
      .selectFrom("scraping_sessions")
      .select(db.fn.countAll().as("count"))
      .where("status", "=", "running")
      .executeTakeFirst();

    // Get latest scraping session stats
    const latestSession = await db
      .selectFrom("scraping_sessions")
      .select([
        "total_jobs",
        "total_embeddings",
        "failed_jobs",
      ])
      .orderBy("started_at", "desc")
      .limit(1)
      .executeTakeFirst();

    const stats = {
      totalJobs: latestSession?.total_jobs || 0,
      totalEmbeddings: latestSession?.total_embeddings || 0,
      failedJobs: latestSession?.failed_jobs || 0,
      activeSessions: activeSessions?.count || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
