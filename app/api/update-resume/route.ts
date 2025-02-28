import { NextResponse } from "next/server"
import { db } from "@/lib/database/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { ResumeUpdate, NewResume } from "@/lib/database/types"

export async function PUT(req: Request) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse request body
    const values = await req.json()

    // Base data with all required fields
    const baseData = {
      title: "Resume",
      status: "active" as const,
      personalInfoName: values.personalInfo.name,
      personalInfoPhone: values.personalInfo.phone,
      personalInfoEmail: values.personalInfo.email,
      personalInfoLinkedIn: values.personalInfo.linkedin || null,
      personalInfoGithub: values.personalInfo.github || null,
      education: JSON.stringify(values.education),
      experience: JSON.stringify(values.experience),
      projects: JSON.stringify(values.projects),
      technicalSkills: JSON.stringify(values.technicalSkills),
      certificationsAchievements: JSON.stringify(values.certificationsAchievements),
      updatedAt: new Date(),
    }

    // First find the most recent active resume
    const existingResume = await db
      .selectFrom("resumes")
      .selectAll()
      .where("userId", "=", session.user.id)
      .where("status", "=", "active")
      .orderBy("updatedAt", "desc")
      .limit(1)
      .executeTakeFirst()

    if (existingResume) {
      // Update existing resume
      await db
        .updateTable("resumes")
        .set(baseData)
        .where("id", "=", existingResume.id)
        .execute()
    } else {
      // Create new resume with proper typing
      const newResumeData: NewResume = {
        ...baseData,
        userId: session.user.id,
        status: "active",
        fileType: null,
        filePath: null,
        createdAt: new Date(),
        title: "Resume",
        education: JSON.stringify(values.education),
        experience: JSON.stringify(values.experience),
        projects: JSON.stringify(values.projects),
        technicalSkills: JSON.stringify(values.technicalSkills),
        certificationsAchievements: JSON.stringify(values.certificationsAchievements),
      }

      await db
        .insertInto("resumes")
        .values(newResumeData)
        .execute()
    }

    return NextResponse.json({ 
      success: true,
      message: "Resume updated successfully"
    })

  } catch (error) {
    console.error("Error updating resume:", error)
    return NextResponse.json(
      { 
        error: "Failed to update resume",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}