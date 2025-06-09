import type { Generated, ColumnType, Selectable, Insertable, Updateable } from "kysely";

// Interface for the resumes table
export interface ResumeTable {
    id: Generated<number>;
    user_id: string; // Changed from userId to match schema
    title: string;
    file_path: string | null; // Changed from filePath
    file_type: string | null; // Changed from fileType
    status: "pending" | "active" | "archived";
    personal_info_name: string; // Changed from personalInfoName
    personal_info_phone: string; // Changed from personalInfoPhone
    personal_info_email: string; // Changed from personalInfoEmail
    personal_info_linkedin: string | null; // Changed from personalInfoLinkedIn
    personal_info_github: string | null; // Changed from personalInfoGithub
    education: string; // Will store stringified JSON
    experience: string;
    projects: string;
    technical_skills: string;
    certifications_achievements: string; // Changed from certificationsAchievements
    created_at: ColumnType<Date, string | Date, string | Date>; // Changed from createdAt
    updated_at: ColumnType<Date, string | Date, string | Date>; // Changed from updatedAt
}

// Add type definitions for the parsed data
export interface ParsedResume extends Omit<Resume, 'education' | 'experience' | 'projects' | 'technical_skills' | 'certifications_achievements'> {
    education: Array<{
        institution: string;
        degree: string;
        location: string;
        duration: string;
    }>;
    experience: Array<{
        title: string;
        company: string;
        location: string;
        duration: string;
        responsibilities: string[];
        technologies: string[];
    }>;
    projects: Array<{
        name: string;
        duration: string;
        responsibilities: string[];
        technologies: string[];
    }>;
    technical_skills: string[];
    certifications_achievements: string[];
}

export interface ChatTable {
    id: string;
    user_id: string;
    title: string;
    created_at: ColumnType<Date, string | Date, string | Date>;
    updated_at: ColumnType<Date, string | Date, string | Date>;
}

export interface ChatMessageTable {
    id: string;
    chat_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: ColumnType<Date, string | Date, string | Date>;
}

export interface RawJobsTable {
    id: Generated<number>;
    task_id: string;
    external_id: string | null;
    raw_data: unknown;
    source_site: string | null;
    title: string;
    company: string;
    location: string | null;
    job_url: string | null;
    job_type: string | null;
    salary_interval: string | null;
    salary_min: number | null;
    salary_max: number | null;
    salary_currency: string | null;
    description: string | null;
    created_at: ColumnType<Date, string | Date, string | Date>;
}

export interface ScrapingSession {
  id: number
  total_jobs: number
  total_embeddings: number
  failed_jobs: number
  started_at: Date
  ended_at: Date | null
  status: string
  job_title: string
}

export interface UserTable {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, never>;
  twoFactorEnabled: boolean | null;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: ColumnType<Date, string | undefined, never> | null;
}

// Combine all tables interface
export interface Database {
    user: UserTable;
    resumes: ResumeTable;
    chats: ChatTable;
    chat_messages: ChatMessageTable;
    raw_jobs: RawJobsTable;
    scraping_sessions: ScrapingSession
}

// For GET operations - includes all fields
export type Resume = Selectable<ResumeTable>;

// For INSERT operations - makes generated fields optional
export type NewResume = Insertable<ResumeTable>;

// For UPDATE operations - makes all fields optional
export type ResumeUpdate = Updateable<ResumeTable>;

// Chat types
export type Chat = Selectable<ChatTable>;
export type NewChat = Insertable<ChatTable>;
export type ChatUpdate = Updateable<ChatTable>;

// Chat message types
export type ChatMessage = Selectable<ChatMessageTable>;
export type NewChatMessage = Insertable<ChatMessageTable>;
export type ChatMessageUpdate = Updateable<ChatMessageTable>;

// Raw job types
export type RawJob = Selectable<RawJobsTable>;
export type NewRawJob = Insertable<RawJobsTable>;
export type RawJobUpdate = Updateable<RawJobsTable>;

// User types
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;