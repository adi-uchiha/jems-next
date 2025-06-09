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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get resume stats
    const totalResumesPromise = db
      .selectFrom('resumes')
      .select(db.fn.count('id').as('totalResumes'))
      .where('user_id', '=', userId)
      .executeTakeFirst()

    const activeResumesPromise = db
      .selectFrom('resumes')
      .select(db.fn.count('id').as('activeResumes'))
      .where('user_id', '=', userId)
      .where('status', '=', 'active')
      .executeTakeFirst()

    const [totalResumesResult, activeResumesResult] = await Promise.all([totalResumesPromise, activeResumesPromise])

    const resumeStats = {
      totalResumes: totalResumesResult?.totalResumes ?? 0,
      activeResumes: activeResumesResult?.activeResumes ?? 0,
    }

    // Get chat stats
    const chatStats = await db
      .selectFrom('chats')
      .select([
        db.fn.count('id').as('totalChats'),
      ])
      .where('user_id', '=', userId)
      .executeTakeFirst()

    // Get messages count
    const messageStats = await db
      .selectFrom('chats')
      .innerJoin('chat_messages', 'chats.id', 'chat_messages.chat_id')
      .select(db.fn.count('chat_messages.id').as('totalMessages'))
      .where('chats.user_id', '=', userId)
      .executeTakeFirst()

    // Get latest scraping session
    const scrapingStats = await db
      .selectFrom('scraping_sessions')
      .select([
        db.fn.count('id').as('totalSessions'),
        db.fn.sum('total_jobs').as('totalJobsScraped'),
        db.fn.sum('failed_jobs').as('totalFailedJobs'),
      ])
      .executeTakeFirst()

    return NextResponse.json({
      resume: {
        total: Number(resumeStats?.totalResumes) || 0,
        active: Number(resumeStats?.activeResumes) || 0,
      },
      chat: {
        totalChats: Number(chatStats?.totalChats) || 0,
        totalMessages: Number(messageStats?.totalMessages) || 0,
      },
      scraping: {
        totalSessions: Number(scrapingStats?.totalSessions) || 0,
        totalJobsScraped: Number(scrapingStats?.totalJobsScraped) || 0,
        totalFailedJobs: Number(scrapingStats?.totalFailedJobs) || 0,
      }
    })
  } catch (error) {
    console.error("Error fetching profile stats:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
