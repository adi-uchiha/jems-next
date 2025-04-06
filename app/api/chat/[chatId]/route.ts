import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getPineconeContext } from "@/lib/pinecone";
import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { getSystemPrompt } from "../../../../lib/chat/prompt";
import { Message } from "ai";
import { NewChatMessage, ChatApiMessage } from "@/lib/database/types";

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Verify chat exists and belongs to user
    const chat = await db
      .selectFrom('chats')
      .where('id', '=', params.chatId)
      .where('user_id', '=', session.user.id)
      .executeTakeFirst();

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    const { messages } = await req.json() as { messages: Message[] };
    const lastMessage = messages[messages.length - 1];
    const now = new Date().toISOString();

    // Save user message
    const userMessage: NewChatMessage = {
      id: nanoid(),
      chat_id: params.chatId,
      role: lastMessage.role,
      content: lastMessage.content,
      created_at: now
    };

    await db
      .insertInto('chat_messages')
      .values(userMessage)
      .execute();

    // Update chat timestamp
    await db
      .updateTable('chats')
      .set({ updated_at: now })
      .where('id', '=', params.chatId)
      .execute();

    // Get user's resume data
    const userResume = await db
      .selectFrom('resumes')
      .where('userId', '=', session.user.id)
      .where('status', '=', 'active')
      .select([
        'personalInfoName',
        'education',
        'experience',
        'technicalSkills',
        'certificationsAchievements'
      ])
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .executeTakeFirst();

    // Get relevant job postings
    const jobPostings = await getPineconeContext(lastMessage.content, 5, 0.3);

    // Create system prompt with context
    const systemPrompt = getSystemPrompt(
      userResume ? JSON.stringify(userResume) : null,
      jobPostings
    );

    // Prepare messages for AI
    const aiMessages: ChatApiMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }))
    ];

    // Get AI response
    const response = await streamText({
      model: google("gemini-1.5-flash"),
      messages: aiMessages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Save AI response when completed
    response.onCompletion(async (completion) => {
      const assistantMessage: NewChatMessage = {
        id: nanoid(),
        chat_id: params.chatId,
        role: 'assistant',
        content: completion,
        created_at: new Date().toISOString()
      };

      await db
        .insertInto('chat_messages')
        .values(assistantMessage)
        .execute();
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}