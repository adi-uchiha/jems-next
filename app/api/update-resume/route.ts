import { db, stringifyForDB } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const values = await req.json();
    console.log("Update Resume Data:", values);

    // Check if resume exists
    const existingResume = await db
      .selectFrom("resumes")
      .where("user_id", "=", session.user.id)
      .where("status", "=", "active")
      .select(["id"])
      .executeTakeFirst();

    if (!existingResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Handle both data structure formats
    const personalInfo = values.personalInfo || values;
    const updateData = {
      title: "Resume",
      status: "active" as const,
      personal_info_name: personalInfo.name || personalInfo.personalInfoName,
      personal_info_phone: personalInfo.phone || personalInfo.personalInfoPhone,
      personal_info_email: personalInfo.email || personalInfo.personalInfoEmail,
      personal_info_linkedin: personalInfo.linkedin || personalInfo.personalInfoLinkedIn || null,
      personal_info_github: personalInfo.github || personalInfo.personalInfoGithub || null,
      education: stringifyForDB(values.education || []),
      experience: stringifyForDB(values.experience || []),
      projects: stringifyForDB(values.projects || []),
      technical_skills: stringifyForDB(values.technicalSkills || values.technical_skills || []),
      certifications_achievements: stringifyForDB(values.certificationsAchievements || values.certifications_achievements || []),
      updated_at: new Date().toISOString()
    };

    await db
      .updateTable("resumes")
      .set(updateData)
      .where("id", "=", existingResume.id)
      .execute();

    return NextResponse.json({
      success: true,
      message: "Resume updated successfully"
    });

  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json({
      error: "Failed to update resume",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return PUT(req);
}