import { db } from "@/lib/database/db"
import { Database, NewResume } from "@/lib/database/types"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await req.json()
    console.log("Save Resume Recieved Data: ", data)
    if (!data.resumeData) {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 }
      )
    }

    const { resumeData } = data
    
    const newResume: NewResume = {
      userId: session.user.id,
      title: "Resume", // You can make this dynamic if needed
      filePath: null,
      fileType: null,
      status: "active",
      personalInfoName: resumeData.personal_info.name,
      personalInfoPhone: resumeData.personal_info.phone,
      personalInfoEmail: resumeData.personal_info.email,
      personalInfoLinkedIn: resumeData.personal_info.linkedin || null,
      personalInfoGithub: resumeData.personal_info.github || null,
      education: JSON.stringify(resumeData.education),
      experience: JSON.stringify(resumeData.experience),
      projects: JSON.stringify(resumeData.projects),
      technicalSkills: JSON.stringify(resumeData.technical_skills),
      certificationsAchievements: JSON.stringify(resumeData.certifications_and_achievements),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.insertInto('resumes')
      .values(newResume)
      .execute()

    return NextResponse.json({ 
      success: true, 
      message: "Resume saved successfully" 
    })

  } catch (error) {
    console.error('Error saving resume:', error)
    return NextResponse.json(
      { error: "Failed to save resume" },
      { status: 500 }
    )
  }
}