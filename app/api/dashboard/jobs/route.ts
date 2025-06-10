import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // First get the count of total jobs
    const countQuery = db
      .selectFrom('raw_jobs')
      .select(eb => eb.fn.countAll().as('count'));

    if (search) {
      countQuery.where(eb => 
        eb.or([
          eb('title', 'ilike', `%${search}%`),
          eb('company', 'ilike', `%${search}%`),
          eb('location', 'ilike', `%${search}%`),
          eb('description', 'ilike', `%${search}%`)
        ])
      );
    }

    const countResult = await countQuery.executeTakeFirst();
    const total = Number(countResult?.count || 0);

    // Then get the actual jobs with pagination
    const jobsQuery = db
      .selectFrom('raw_jobs')
      .select([
        'id',
        'title',
        'company',
        'location',
        'job_type',
        'salary_min',
        'salary_max',
        'salary_currency',
        'job_url',
        'description',
        'created_at',
        'source_site'
      ])
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    if (search) {
      jobsQuery.where(eb => 
        eb.or([
          eb('title', 'ilike', `%${search}%`),
          eb('company', 'ilike', `%${search}%`),
          eb('location', 'ilike', `%${search}%`),
          eb('description', 'ilike', `%${search}%`),
        ])
      );
    }

    const jobs = await jobsQuery.execute();

    return NextResponse.json({
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    });

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
