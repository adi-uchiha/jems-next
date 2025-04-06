import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

    const chat = await db
      .selectFrom('chats')
      .where('id', '=', params.chatId)
      .where('user_id', '=', session.user.id)
      .select(['id', 'title', 'created_at', 'updated_at'])
      .executeTakeFirst();

    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    return Response.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}