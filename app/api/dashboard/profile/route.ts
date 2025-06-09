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

    // Fetch user details
    const user = await db
      .selectFrom('user')
      .select(['id', 'name', 'email', 'image', 'createdAt'])
      .where('id', '=', userId)
      .executeTakeFirst()

    // Fetch resume count
    const resumeCount = await db
      .selectFrom('resumes')
      .select((eb) => [
        eb.fn.count('id').as('count')
      ])
      .where('user_id', '=', userId)
      .executeTakeFirst()

    // Fetch chat stats
    const chatStats = await db
      .selectFrom('chats')
      .select((eb) => [
        eb.fn.count('id').as('count')
      ])
      .where('user_id', '=', userId)
      .executeTakeFirst()

    // Fetch latest resume
    const latestResume = await db
      .selectFrom('resumes')
      .select([
        'id',
        'title',
        'status',
        'personal_info_name',
        'personal_info_email',
        'personal_info_phone',
        'personal_info_linkedin',
        'personal_info_github',
        'updated_at'
      ])
      .where('user_id', '=', userId)
      .where('status', '=', 'active')
      .orderBy('updated_at', 'desc')
      .limit(1)
      .executeTakeFirst()

    return NextResponse.json({
      user,
      stats: {
        resumeCount: Number(resumeCount?.count) || 0,
        chatCount: Number(chatStats?.count) || 0,
      },
      latestResume,
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
