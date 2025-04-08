// app/api/chats/[chatId]/messages/route.ts
// No changes needed from the previous version (with await context.params fix and extensive logging).
// Ensure this file matches the last correct version provided.

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

// --- GET Handler ---
export async function GET(
  req: Request,
  context: { params: { chatId: string } }
) {
  const { chatId } = await context.params;
  if (!chatId || chatId === 'undefined') {
     console.error("GET /messages: Missing or invalid chatId after await:", chatId);
    return Response.json({ error: "Missing or invalid chatId" }, { status: 400 });
  }
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      console.warn(`GET /messages: Unauthorized access attempt for chat ${chatId}.`);
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(`GET /messages: Fetching messages for chat ${chatId} user ${session.user.id}`);
    const chat = await db.selectFrom('chats')
      .where('id', '=', chatId).where('user_id', '=', session.user.id)
      .select('id').executeTakeFirst();
    if (!chat) {
        console.warn(`GET /messages: Chat ${chatId} not found or user ${session.user.id} does not have access.`);
        return Response.json({ error: "Chat not found or access denied" }, { status: 404 });
    }
    const messages = await db.selectFrom('chat_messages')
      .where('chat_id', '=', chatId)
      .select(['id', 'role', 'content', 'created_at']).orderBy('created_at', 'asc')
      .execute();
    console.log(`GET /messages: Found ${messages.length} messages for chat ${chatId}`);
    return Response.json(messages);
  } catch (error) {
    console.error(`GET /messages: Error fetching messages for chat ${chatId}:`, error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// --- POST Handler ---
export async function POST(
  req: Request,
  context: { params: { chatId: string } }
) {
  console.log("--- POST /messages: Handler Entry ---");
  let chatId: string | undefined = undefined;
  try {
    const params = await context.params;
    chatId = params.chatId;
    console.log(`POST /messages: Awaited params. Chat ID: ${chatId}`);
    if (!chatId || chatId === 'undefined') {
      console.error("POST /messages: Missing or invalid chatId after await:", chatId);
      return Response.json({ error: "Missing or invalid chatId" }, { status: 400 });
    }
    console.log(`POST /messages: Chat ID validated: ${chatId}`);

    console.log(`POST /messages: Attempting to get session for chat ${chatId}...`);
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
       console.warn(`POST /messages: Unauthorized access attempt for chat ${chatId}.`);
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(`POST /messages: Session obtained for user ${session.user.id}, chat ${chatId}.`);

    console.log(`POST /messages: Verifying ownership for chat ${chatId}...`);
     const chatOwnership = await db.selectFrom('chats')
      .where('id', '=', chatId).where('user_id', '=', session.user.id)
      .select('id').executeTakeFirst();
     if (!chatOwnership) {
        console.warn(`POST /messages: Chat ${chatId} not found or user ${session.user.id} does not have access.`);
        return Response.json({ error: "Chat not found or access denied" }, { status: 404 });
     }
     console.log(`POST /messages: Ownership verified for chat ${chatId}.`);

    console.log(`POST /messages: Parsing request body for chat ${chatId}...`);
    const { messages }: { messages: Message[] } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
       console.error(`POST /messages: Invalid or empty messages array received for chat ${chatId}.`);
       return Response.json({ error: "Invalid messages format" }, { status: 400 });
    }
    console.log(`POST /messages: Received ${messages.length} messages for chat ${chatId}.`);

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
        console.error(`POST /messages: Last message not from user for chat ${chatId}. Role: ${lastMessage.role}`);
        if (messages.length > 1) { return Response.json({ error: "Invalid message sequence for response trigger" }, { status: 400 }); }
    }
    const lastMessageContent = lastMessage.content;
    console.log(`POST /messages: Processing request for chat ${chatId}. Last user message starts with: "${lastMessageContent.substring(0, 50)}..."`);

    console.log(`POST /messages: Fetching context (Resume, Pinecone) for chat ${chatId}...`);
    const userResume = await db.selectFrom('resumes')
                         .where('userId', '=', session.user.id).where('status', '=', 'active')
                         .select(['personalInfoName','education','experience','technicalSkills','projects'])
                         .orderBy('updatedAt', 'desc').limit(1).executeTakeFirst();
    const jobPostings = await getPineconeContext(lastMessageContent, 5, 0.3);
    const systemPrompt = getSystemPrompt(userResume, jobPostings);
    console.log(`POST /messages: Context fetched for chat ${chatId}. System prompt length: ${systemPrompt?.length ?? 0}`);

    console.log(`POST /messages: Calling streamText for chat ${chatId}...`);
    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages: [ { role: 'system', content: systemPrompt }, ...messages ],
      temperature: 0.7,
      maxTokens: 1000,
      onFinish: async ({ text, usage, finishReason, response }) => {
        console.log(`POST /messages: streamText finished for chat ${chatId}. Reason: ${finishReason}.`);
        if (text && text.trim().length > 0) {
          const assistantMessage: NewChatMessage = { id: nanoid(), chat_id: chatId, role: 'assistant', content: text, created_at: new Date().toISOString() };
          try {
            console.log(`POST /messages: Saving assistant message for chat ${chatId}...`);
            await db.insertInto('chat_messages').values(assistantMessage).execute();
            console.log(`POST /messages: Assistant message saved for chat ${chatId}.`);
            await db.updateTable('chats').set({ updated_at: new Date().toISOString() }).where('id', '=', chatId).execute();
            console.log(`POST /messages: Chat timestamp updated for chat ${chatId}.`);
          } catch (dbError) {
            console.error(`POST /messages: DB Error saving assistant message/updating chat ${chatId}:`, dbError);
          }
        } else { console.warn(`POST /messages: Assistant message empty for chat ${chatId}, not saving.`); }
      },
      onError: (error) => {
         console.error(`POST /messages: streamText Streaming Error for chat ${chatId}:`, error);
      }
    });

    console.log(`POST /messages: Returning streamText data stream response for chat ${chatId}.`);
    return result.toDataStreamResponse();

  } catch (error) {
    const chatIdForError = chatId ?? context?.params?.chatId ?? 'unknown';
    console.error(`POST /messages: Outer error handler caught error for chat ${chatIdForError}:`, error);
    const message = (error instanceof Error) ? error.message : "Internal Server Error";
    return Response.json({ error: message }, { status: 500 });
  }
}