import { NextResponse } from "next/server"
import { db } from "@/lib/database/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const scrapingSessions = await db
      .selectFrom("scraping_sessions")
      .select([
        'id',
        'started_at',
        'ended_at',
        'status',
        'total_jobs',
      ])
      .orderBy('started_at', 'desc')
      .limit(10)
      .execute()

    return NextResponse.json(scrapingSessions)
  } catch (error) {
    console.error("Error fetching scraping sessions:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
