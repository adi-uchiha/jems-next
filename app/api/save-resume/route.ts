import { db, stringifyForDB } from "@/lib/database/db";
import { Database, NewResume } from "@/lib/database/types";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    console.log("Save Resume Received Data:", data);

    // Validate the data structure
    const { resumeData } = data;
    if (!resumeData || typeof resumeData !== 'object') {
      return NextResponse.json(
        { error: "Invalid resume data format" },
        { status: 400 }
      );
    }

    // Create new resume with type safety
    const newResume: NewResume = {
      user_id: session.user.id,
      title: resumeData.title || "Resume",
      file_path: null,
      file_type: null,
      status: "active",
      personal_info_name: resumeData.personal_info?.name || resumeData.personalInfoName || "",
      personal_info_phone: resumeData.personal_info?.phone || resumeData.personalInfoPhone || "",
      personal_info_email: resumeData.personal_info?.email || resumeData.personalInfoEmail || "",
      personal_info_linkedin: resumeData.personal_info?.linkedin || resumeData.personalInfoLinkedIn || null,
      personal_info_github: resumeData.personal_info?.github || resumeData.personalInfoGithub || null,
      education: stringifyForDB(resumeData.education || []),
      experience: stringifyForDB(resumeData.experience || []),
      projects: stringifyForDB(resumeData.projects || []),
      technical_skills: stringifyForDB(resumeData.technical_skills || resumeData.technicalSkills || []),
      certifications_achievements: stringifyForDB(resumeData.certifications_achievements || 
        resumeData.certificationsAchievements || []),
      created_at: new Date(),
      updated_at: new Date()
    };

    // Check for existing resume
    const existingResume = await db
      .selectFrom('resumes')
      .where('user_id', '=', session.user.id)
      .where('status', '=', 'active')
      .select(['id'])
      .executeTakeFirst();

    if (existingResume) {
      // Update existing resume
      await db.updateTable('resumes')
        .set({
          ...newResume,
          updated_at: new Date()
        })
        .where('id', '=', existingResume.id)
        .execute();
    } else {
      // Insert new resume
      await db.insertInto('resumes')
        .values(newResume)
        .execute();
    }

    return NextResponse.json({ 
      success: true, 
      message: "Resume saved successfully" 
    });

  } catch (error) {
    console.error('Error saving resume:', error);
    return NextResponse.json({ 
      error: "Failed to update resume",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Add PUT handler for explicit updates
export async function PUT(req: Request) {
  return POST(req);
}