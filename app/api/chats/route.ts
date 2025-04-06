//app/api/chat/route.ts
//Contains get all chats of user and create new chat

import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { NewChat } from "@/lib/database/types";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await db
      .selectFrom('chats')
      .where('user_id', '=', session.user.id)
      .select(['id', 'title', 'created_at', 'updated_at'])
      .orderBy('updated_at', 'desc')
      .execute();

    return Response.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title = "New Chat" } = await req.json();
    const now = new Date().toISOString();

    const newChat: NewChat = {
      id: nanoid(),
      user_id: session.user.id,
      title,
      created_at: now,
      updated_at: now
    };

    await db.insertInto('chats').values(newChat).execute();

    return Response.json(newChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}