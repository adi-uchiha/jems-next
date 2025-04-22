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
      user_id: session.user.id,
      title: "Resume", // You can make this dynamic if needed
      file_path: null,
      file_type: null,
      status: "active",
      personal_info_name: resumeData.personal_info.name,
      personal_info_phone: resumeData.personal_info.phone,
      personal_info_email: resumeData.personal_info.email,
      personal_info_linkedin: resumeData.personal_info.linkedin || null,
      personal_info_github: resumeData.personal_info.github || null,
      education: JSON.stringify(resumeData.education),
      experience: JSON.stringify(resumeData.experience),
      projects: JSON.stringify(resumeData.projects),
      technical_skills: JSON.stringify(resumeData.technical_skills),
      certifications_achievements: JSON.stringify(resumeData.certifications_and_achievements),
      created_at: new Date(),
      updated_at: new Date()
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