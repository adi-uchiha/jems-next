import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;

  if (!chatId || chatId === 'undefined') {
    console.error("GET /chats/[chatId]: Missing or invalid chatId:", chatId);
    return NextResponse.json({ error: "Missing or invalid chatId" }, { status: 400 });
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      console.warn(`GET /chats/[chatId]: Unauthorized access attempt for chat ${chatId}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`GET /chats/[chatId]: Fetching chat ${chatId} for user ${session.user.id}`);

    const chat = await db
      .selectFrom('chats')
      .where('id', '=', chatId)
      .where('user_id', '=', session.user.id)
      .select(['id', 'title', 'created_at', 'updated_at'])
      .executeTakeFirst();

    if (!chat) {
      console.warn(`GET /chats/[chatId]: Chat ${chatId} not found or access denied for user ${session.user.id}`);
      return NextResponse.json({ error: "Chat not found or access denied" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error(`GET /chats/[chatId]: Error fetching chat ${chatId}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;

  if (!chatId || chatId === 'undefined') {
    console.error("PATCH /chats/[chatId]: Missing or invalid chatId:", chatId);
    return NextResponse.json({ error: "Missing or invalid chatId" }, { status: 400 });
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      console.warn(`PATCH /chats/[chatId]: Unauthorized access attempt for chat ${chatId}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    if (!data.title || typeof data.title !== 'string') {
      console.error(`PATCH /chats/[chatId]: Invalid title provided for chat ${chatId}`);
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }

    console.log(`PATCH /chats/[chatId]: Updating chat ${chatId} for user ${session.user.id}`);

    const updated = await db
      .updateTable('chats')
      .set({ 
        title: data.title,
        updated_at: new Date().toISOString()
      })
      .where('id', '=', chatId)
      .where('user_id', '=', session.user.id)
      .executeTakeFirst();

    if (!updated) {
      console.warn(`PATCH /chats/[chatId]: Chat ${chatId} not found or access denied for user ${session.user.id}`);
      return NextResponse.json({ error: "Chat not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`PATCH /chats/[chatId]: Error updating chat ${chatId}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;

  if (!chatId || chatId === 'undefined') {
    console.error("DELETE /chats/[chatId]: Missing or invalid chatId:", chatId);
    return NextResponse.json({ error: "Missing or invalid chatId" }, { status: 400 });
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      console.warn(`DELETE /chats/[chatId]: Unauthorized access attempt for chat ${chatId}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`DELETE /chats/[chatId]: Deleting chat ${chatId} for user ${session.user.id}`);

    const result = await db
      .deleteFrom('chats')
      .where('id', '=', chatId)
      .where('user_id', '=', session.user.id)
      .executeTakeFirst();

    if (!result) {
      console.warn(`DELETE /chats/[chatId]: Chat ${chatId} not found or access denied for user ${session.user.id}`);
      return NextResponse.json({ error: "Chat not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /chats/[chatId]: Error deleting chat ${chatId}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}