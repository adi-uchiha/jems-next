import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getPineconeContext } from "@/lib/pinecone";
import { nanoid } from "nanoid";
import { NewChatMessage } from "@/lib/database/types";
import { getSystemPrompt } from "@/lib/chat/prompt";
import type { Message } from 'ai';
import { NextResponse } from "next/server";

// --- GET Handler ---
export async function GET(
  req: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await context.params;
  
  if (!chatId || chatId === 'undefined') {
     console.error("GET /messages: Missing or invalid chatId:", chatId);
    return NextResponse.json({ error: "Missing or invalid chatId" }, { status: 400 });
  }
  
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      console.warn(`GET /messages: Unauthorized access attempt for chat ${chatId}.`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`GET /messages: Fetching messages for chat ${chatId} user ${session.user.id}`);
    
    // First verify chat ownership
    const chat = await db.selectFrom('chats')
      .where('id', '=', chatId)
      .where('user_id', '=', session.user.id)
      .select(['id'])
      .executeTakeFirst();

    if (!chat) {
      console.warn(`GET /messages: Chat ${chatId} not found or user ${session.user.id} does not have access.`);
      return NextResponse.json({ error: "Chat not found or access denied" }, { status: 404 });
    }

    const messages = await db.selectFrom('chat_messages')
      .where('chat_id', '=', chatId)
      .select(['id', 'role', 'content', 'created_at'])
      .orderBy('created_at', 'asc')
      .execute();

    console.log(`GET /messages: Found ${messages.length} messages for chat ${chatId}`);
    
    return NextResponse.json(messages);

  } catch (error) {
    console.error(`GET /messages: Error fetching messages for chat ${chatId}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- POST Handler ---
export async function POST(
  req: Request,
  context: { params: Promise<{ chatId: string }> }
) {
  console.log("--- POST /messages: Handler Entry ---");
  const { chatId } = await context.params;

  try {
    if (!chatId || chatId === 'undefined') {
      console.error("POST /messages: Missing or invalid chatId:", chatId);
      return NextResponse.json({ error: "Missing or invalid chatId" }, { status: 400 });
    }

    console.log(`POST /messages: Chat ID validated: ${chatId}`);

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      console.warn(`POST /messages: Unauthorized access attempt for chat ${chatId}.`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`POST /messages: Session obtained for user ${session.user.id}, chat ${chatId}.`);

    // Verify chat ownership
    const chatOwnership = await db.selectFrom('chats')
      .where('id', '=', chatId)
      .where('user_id', '=', session.user.id)
      .select(['id'])
      .executeTakeFirst();

    if (!chatOwnership) {
      console.warn(`POST /messages: Chat ${chatId} not found or user ${session.user.id} does not have access.`);
      return NextResponse.json({ error: "Chat not found or access denied" }, { status: 404 });
    }

    console.log(`POST /messages: Parsing request body for chat ${chatId}...`);
    const { messages }: { messages: Message[] } = await req.json();
    
    if (!Array.isArray(messages) || messages.length === 0) {
      console.error(`POST /messages: Invalid or empty messages array received for chat ${chatId}.`);
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      console.error(`POST /messages: Last message not from user for chat ${chatId}. Role: ${lastMessage.role}`);
      return NextResponse.json({ error: "Invalid message sequence" }, { status: 400 });
    }

    // Save user message first
    const userMessage: NewChatMessage = {
      id: nanoid(),
      chat_id: chatId,
      role: 'user',
      content: lastMessage.content,
      created_at: new Date().toISOString()
    };

    await db.insertInto('chat_messages').values(userMessage).execute();
    
    console.log(`POST /messages: Saved user message for chat ${chatId}`);

    // Get context and generate response
    const userResume = await db.selectFrom('resumes')
      .where('user_id', '=', session.user.id)
      .where('status', '=', 'active')
      .select(['personal_info_name', 'education', 'experience', 'technical_skills', 'projects'])
      .orderBy('updated_at', 'desc')
      .limit(1)
      .executeTakeFirst();

    const jobPostings = await getPineconeContext(lastMessage.content, 5, 0.3);
    // console.log(jobPostings)
    // {
      //   "matches": [
      //     {
      //       "id": "94",
      //       "score": 0.553743064,
      //       "values": [],
      //       "metadata": {
      //         "company": "HDFC Bank",
      //         "job_type": "",
      //         "location": "Bengaluru, Karnataka, India",
      //         "title": "Software Engineer-Frontend (App)",
      //         "url": "https://www.linkedin.com/jobs/view/4208163163"
      //       }
      //     },
    const systemPrompt = getSystemPrompt(userResume, jobPostings);

    console.log(`POST /messages: Generated system prompt for chat ${chatId}`);

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.7,
      maxTokens: 1000,
      onFinish: async ({ text }) => {
        if (text?.trim()) {
          const assistantMessage: NewChatMessage = {
            id: nanoid(),
            chat_id: chatId,
            role: 'assistant',
            content: text,
            created_at: new Date().toISOString()
          };

          try {
            await db.insertInto('chat_messages').values(assistantMessage).execute();
            await db.updateTable('chats')
              .set({ updated_at: new Date().toISOString() })
              .where('id', '=', chatId)
              .execute();
            console.log(`POST /messages: Saved assistant response for chat ${chatId}`);
          } catch (dbError) {
            console.error(`POST /messages: DB Error saving assistant message for chat ${chatId}:`, dbError);
          }
        }
      },
      onError: (error) => {
        console.error(`POST /messages: AI Stream Error for chat ${chatId}:`, error);
      }
    });

    console.log(`POST /messages: Returning stream response for chat ${chatId}`);
    return result.toDataStreamResponse();

  } catch (error) {
    console.error(`POST /messages: Error processing messages for chat ${chatId}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}