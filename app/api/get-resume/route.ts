import { NextResponse } from "next/server"
import { db } from "@/lib/database/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET() {
  console.log("GET HIT /api/get-resume")
  try {
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
    // console.log("Session User:", session.user)
    // console.log("calling db")

    // Updated column names to match database schema
    const resume = await db
      .selectFrom("resumes")
      .selectAll()
      .where("user_id", "=", session.user.id) // Changed from userId to user_id
      .where("status", "=", "active")
      .orderBy("updated_at", "desc") // Changed from updatedAt to updated_at
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

    // Transform the data to match the frontend form structure using the correct column names
    const response = {
      id: resume.id,
      personalInfoName: resume.personal_info_name,
      personalInfoPhone: resume.personal_info_phone,
      personalInfoEmail: resume.personal_info_email,
      personalInfoLinkedIn: resume.personal_info_linkedin,
      personalInfoGithub: resume.personal_info_github,
      education: resume.education,
      experience: resume.experience,
      projects: resume.projects,
      technicalSkills: resume.technical_skills,
      certificationsAchievements: resume.certifications_achievements,
      status: resume.status,
      createdAt: resume.created_at,
      updatedAt: resume.updated_at,
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