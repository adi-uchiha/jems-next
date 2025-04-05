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
      return new Response("Unauthorized", { status: 401 });
    }

    const chats = await db
      .selectFrom('chats')
      .where('user_id', '=', session.user.id)
      .select(['id', 'title', 'updated_at as updatedAt'])
      .orderBy('updated_at', 'desc')
      .execute();

    return new Response(JSON.stringify(chats));
  } catch (error) {
    console.error('Error fetching chats:', error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { title } = await req.json();
    const chatId = nanoid();
    const now = new Date().toISOString();

    const newChat: NewChat = {
      id: chatId,
      user_id: session.user.id,
      title,
      created_at: now,
      updated_at: now
    };

    await db
      .insertInto('chats')
      .values(newChat)
      .execute();

    return new Response(JSON.stringify({ 
      id: chatId, 
      title,
      created_at: now,
      updated_at: now 
    }));
  } catch (error) {
    console.error('Error creating chat:', error);
    return new Response("Internal Server Error", { status: 500 });
  }
}