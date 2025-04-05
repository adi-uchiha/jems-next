import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";

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

    await db
      .insertInto('chats')
      .values({
        id: chatId,
        user_id: session.user.id,
        title,
      })
      .execute();

    return new Response(JSON.stringify({ id: chatId, title }));
  } catch (error) {
    console.error('Error creating chat:', error);
    return new Response("Internal Server Error", { status: 500 });
  }
}