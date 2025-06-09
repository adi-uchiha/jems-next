import { NextResponse } from "next/server"
import { db } from "@/lib/database/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const job = await db
      .selectFrom('raw_jobs')
      .selectAll()
      .where('id', '=', parseInt(params.id))
      .executeTakeFirst()

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    // Get similar jobs based on title
    const similarJobs = await db
      .selectFrom('raw_jobs')
      .select([
        'id',
        'title',
        'company',
        'location',
        'job_type',
        'created_at'
      ])
      .where('id', '!=', parseInt(params.id))
      .where('title', 'ilike', `%${job.title.split(' ')[0]}%`)
      .limit(3)
      .execute()

    return NextResponse.json({ job, similarJobs })
  } catch (error) {
    console.error("Error fetching job details:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
