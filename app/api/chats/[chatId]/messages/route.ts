//api/chats/[chatId]/messages/route.ts
//This file GET all messages of a chat, POST generate response and saves new messages.

import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getPineconeContext } from "@/lib/pinecone";
import { nanoid } from "nanoid";
import { NewChatMessage } from "@/lib/database/types";
import { getSystemPrompt } from "@/lib/chat/prompt";

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await db
      .selectFrom('chat_messages')
      .where('chat_id', '=', params.chatId)
      .select(['id', 'role', 'content', 'created_at'])
      .orderBy('created_at', 'asc')
      .execute();

    return Response.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
		const awaitedparams = await params;
		// Validate chatId
    if (!awaitedparams.chatId || awaitedparams.chatId === 'undefined') {
      return Response.json({ error: "Missing or invalid chatId" }, { status: 400 });
    }
		
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();
    const lastMessageContent = messages[messages.length - 1].content;
    const userMessageId = nanoid();
    const now = new Date(); // Use a single Date object for consistency

    // Save user message
    const userMessage: NewChatMessage = {
      id: userMessageId,
      chat_id: awaitedparams.chatId,
      role: 'user',
      content: lastMessageContent,
      created_at: now.toISOString()
    };

    // Use a transaction if saving user message and assistant message should be atomic
    // For simplicity, shown as separate calls here.
    await db.insertInto('chat_messages').values(userMessage).execute();

    // Get user's resume and context
    const userResume = await db
      .selectFrom('resumes')
      .where('userId', '=', session.user.id)
      .where('status', '=', 'active')
      .select([
        'personalInfoName',
        'education',
        'experience',
        'technicalSkills',
        'projects'
      ])
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .executeTakeFirst();

    const jobPostings = await getPineconeContext(lastMessageContent, 5, 0.3);
    const systemPrompt = getSystemPrompt(userResume, jobPostings);

    // Get AI response stream
    const result = await streamText({ // Renamed 'response' to 'result' for clarity
      model: google("gemini-1.5-flash"),
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages // Pass the full message history including the latest user message
      ],
      temperature: 0.7,
      maxTokens: 1000,
      // *** Use the onFinish callback ***
      onFinish: async ({ text, usage, finishReason, response }) => {
        // 'text' contains the full completed text from the stream
        console.log('Stream finished. Reason:', finishReason);
        console.log('Token usage:', usage);

        // Ensure text is not empty before saving
        if (text && text.trim().length > 0) {
          const assistantMessage: NewChatMessage = {
            id: nanoid(), // Generate new ID for assistant message
            chat_id: awaitedparams.chatId,
            role: 'assistant',
            content: text, // Use the 'text' property from the callback
            created_at: new Date().toISOString() // Use current time for assistant message
          };

          try {
            // Save assistant message
            await db.insertInto('chat_messages').values(assistantMessage).execute();
            console.log('Assistant message saved successfully.');

            // Update chat timestamp
            await db
              .updateTable('chats')
              .set({ updated_at: new Date().toISOString() })
              .where('id', '=', awaitedparams.chatId)
              .execute();
            console.log('Chat timestamp updated successfully.');

          } catch (dbError) {
            console.error('Error saving assistant message or updating chat:', dbError);
            // Decide how to handle DB errors here. Maybe log or retry?
          }
        } else {
           console.warn('Assistant message was empty, not saving.');
        }
      },
      // Optional: Add onError for stream-specific errors
      onError: (error) => {
         console.error('Streaming Error:', error);
         // Handle streaming errors - note that this might prevent onFinish from running
      }
    });

    // Return the stream response to the client
    return result.toDataStreamResponse(); // Use the result object here

  } catch (error) {
    console.error('Chat POST API error:', error);
    // Ensure a response is always sent, even on error
    if (error instanceof Error) {
        return Response.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}