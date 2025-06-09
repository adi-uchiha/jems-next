import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const jobTypes = searchParams.get('jobTypes')?.split(',').filter(Boolean) || [];
    const salaryMin = parseFloat(searchParams.get('salaryMin') || '0');
    const salaryMax = parseFloat(searchParams.get('salaryMax') || '200');

    let query = db.selectFrom('raw_jobs')
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
      .where((eb) => 
        eb.or([
          eb('title', 'ilike', `%${search}%`),
          eb('company', 'ilike', `%${search}%`),
          eb('location', 'ilike', `%${search}%`),
          eb('description', 'ilike', `%${search}%`)
        ])
      );

    // Add job type filter if specified
    if (jobTypes.length > 0) {
      query = query.where('job_type', 'in', jobTypes);
    }

    // Add salary range filter
    query = query
      .where(eb => 
        eb.or([
          eb.and([
            eb('salary_min', '>=', salaryMin * 1000),
            eb('salary_min', '<=', salaryMax * 1000)
          ]),
          eb.and([
            eb('salary_max', '>=', salaryMin * 1000),
            eb('salary_max', '<=', salaryMax * 1000)
          ])
        ])
      );

    // Get total count
    const countResult = await query.select(eb => eb.fn.countAll().as('count')).executeTakeFirst();
    const total = Number(countResult?.count || 0);

    // Get paginated results
    const jobs = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
      .execute();

    return NextResponse.json({
      jobs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
