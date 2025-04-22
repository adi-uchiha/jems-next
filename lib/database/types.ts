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
    education: string; // JSONB stored as string
    experience: string;
    projects: string;
    technical_skills: string;
    certifications_achievements: string; // Changed from certificationsAchievements
    created_at: ColumnType<Date, string | Date, string | Date>; // Changed from createdAt
    updated_at: ColumnType<Date, string | Date, string | Date>; // Changed from updatedAt
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

// Combine all tables interface
export interface Database {
    resumes: ResumeTable;
    chats: ChatTable;
    chat_messages: ChatMessageTable;
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