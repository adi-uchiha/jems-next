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
      return new Response("Unauthorized", { status: 401 });
    }

    // Verify chat belongs to user
    const chat = await db
      .selectFrom('chats')
      .where('id', '=', params.chatId)
      .where('user_id', '=', session.user.id)
      .executeTakeFirst();

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    // Fetch messages
    const messages = await db
      .selectFrom('chat_messages')
      .where('chat_id', '=', params.chatId)
      .select(['id', 'role', 'content'])
      .orderBy('created_at', 'asc')
      .execute();

    return new Response(JSON.stringify(messages));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response("Internal Server Error", { status: 500 });
  }
}