// app/api/chats/route.ts
// Contains get all chats of user and create new chat

import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import type { NewChat, NewChatMessage } from "@/lib/database/types";

export async function GET() {
  console.log("GET /chats: Handler Entry");
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      console.warn("GET /chats: Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`GET /chats: Fetching chats for user ${session.user.id}`);

    const chats = await db
      .selectFrom('chats')
      .where('user_id', '=', session.user.id)
      .select(['id', 'title', 'created_at', 'updated_at'])
      .orderBy('updated_at', 'desc')
      .execute();

    console.log(`GET /chats: Found ${chats.length} chats for user ${session.user.id}`);
    return NextResponse.json(chats);

  } catch (error) {
    console.error('GET /chats: Error fetching chats:', error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  console.log("POST /chats: Handler Entry");
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      console.warn("POST /chats: Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title = "New Chat", initialMessage } = await req.json();

    // Validate input
    if (typeof initialMessage !== 'string' || initialMessage.trim().length === 0) {
      console.error("POST /chats: Invalid or missing initial message");
      return NextResponse.json(
        { error: "Initial message is required" }, 
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const chatId = nanoid();

    console.log(`POST /chats: Creating chat ${chatId} for user ${session.user.id}`);

    // Create new chat and initial message in a transaction
    await db.transaction().execute(async (trx) => {
      // Create chat
      const newChat: NewChat = {
        id: chatId,
        user_id: session.user.id,
        title: title.trim(),
        created_at: now,
        updated_at: now
      };

      await trx
        .insertInto('chats')
        .values(newChat)
        .execute();

      // Create initial message
      const newMessage: NewChatMessage = {
        id: nanoid(),
        chat_id: chatId,
        role: 'user',
        content: initialMessage.trim(),
        created_at: now
      };

      await trx
        .insertInto('chat_messages')
        .values(newMessage)
        .execute();

      console.log(`POST /chats: Successfully created chat ${chatId} with initial message`);
    });

    return NextResponse.json({ 
      id: chatId, 
      title,
      created_at: now,
      updated_at: now 
    });

  } catch (error) {
    console.error('POST /chats: Error creating chat:', error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}