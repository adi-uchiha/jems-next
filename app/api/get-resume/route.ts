import { NextResponse } from "next/server"
import { db } from "@/lib/database/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET() {
  console.log("GET HIT /api/get-resume")
  try {
    // Check authentication using the same method as parse-resume

    // console.log("Headers:", await headers())
    console.log("Auth:")
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    console.log("Session:", session)
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }
    console.log("Session User:", session.user)
    console.log("calling db")

    // Get the most recent active resume for the user
    const resume = await db
      .selectFrom("resumes")
      .selectAll()
      .where("userId", "=", session.user.id)
      .where("status", "=", "active")
      .orderBy("updatedAt", "desc")
      .limit(1)
      .executeTakeFirst()

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Transform the data to match the frontend form structure
    const response = {
      id: resume.id,
      personalInfoName: resume.personalInfoName,
      personalInfoPhone: resume.personalInfoPhone,
      personalInfoEmail: resume.personalInfoEmail,
      personalInfoLinkedIn: resume.personalInfoLinkedIn,
      personalInfoGithub: resume.personalInfoGithub,
      education: resume.education,
      experience: resume.experience,
      projects: resume.projects,
      technicalSkills: resume.technicalSkills,
      certificationsAchievements: resume.certificationsAchievements,
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    }

    return NextResponse.json(
      response,
      { 
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    console.error("Error fetching resume:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}