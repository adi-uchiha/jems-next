import type { Generated, ColumnType, Selectable, Insertable, Updateable } from "kysely";

// Interface for the resumes table
export interface ResumeTable {
  // made optional in inserts and updates.
    id: Generated<number>
    userId: string; // Foreign key reference to user table
    title: string; // e.g., "Software Engineer Resume"
    filePath: string | null; // Optional: Link to the file if stored elsewhere
    fileType: string | null; // Optional:  e.g., "application/pdf"
    status: "pending" | "active" | "archived";
    personalInfoName: string;
    personalInfoPhone: string;
    personalInfoEmail: string;
    personalInfoLinkedIn: string | null;
    personalInfoGithub: string | null;
    education: string; // JSON stringified array of education objects
    experience: string; // JSON stringified array of experience objects
    projects: string; // JSON stringified array of project objects
    technicalSkills: string; // JSON stringified array of strings
    certificationsAchievements: string; // JSON stringified array of strings
    createdAt: ColumnType<Date, string | Date, string | Date>;
    updatedAt: ColumnType<Date, string | Date, string | Date>;
}

// Combine all tables interface
export interface Database {
    // // Existing tables from BetterAuth
    // user: any // Type from BetterAuth
    // session: any
    // account: any
    // verification: any
    // organization: any
    // member: any
    // invitation: any
    // twoFactor: any
    // passkey: any
    // oauthApplication: any
    // oauthAccessToken: any
    // oauthConsent: any

    // // Our custom tables
    resumes: ResumeTable;
}

// For GET operations - includes all fields
export type Resume = Selectable<ResumeTable>;

// For INSERT operations - makes generated fields optional
export type NewResume = Insertable<ResumeTable>;

// For UPDATE operations - makes all fields optional
export type ResumeUpdate = Updateable<ResumeTable>;