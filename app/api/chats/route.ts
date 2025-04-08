// app/api/chats/route.ts
// Contains get all chats of user and create new chat

import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { NewChat, NewChatMessage } from "@/lib/database/types"; // Ensure NewChatMessage is imported if needed

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

    const { title = "New Chat", initialMessage } = await req.json();

    // Validate initialMessage
    if (typeof initialMessage !== 'string' || initialMessage.trim().length === 0) {
       return Response.json({ error: "Initial message cannot be empty" }, { status: 400 });
    }


    const now = new Date().toISOString();
    const chatId = nanoid();

    console.log(`Creating chat ${chatId} for user ${session.user.id} with title "${title}"`);

    // Create new chat and initial message in a transaction
    await db.transaction().execute(async (trx) => {
      // Create chat
      const chatInsertResult = await trx.insertInto('chats').values({
        id: chatId,
        user_id: session.user.id, // Use the authenticated user's ID
        title,
        created_at: now,
        updated_at: now
      }).executeTakeFirst(); // Use executeTakeFirst if you need result, otherwise just execute

      console.log('Chat insertion result:', chatInsertResult);


      // Create initial message - This is crucial for the flow
      const messageInsertResult = await trx.insertInto('chat_messages').values({
          id: nanoid(), // Generate ID for the message
          chat_id: chatId,
          role: 'user', // The initial message is from the user
          content: initialMessage.trim(), // Use the provided initial message
          created_at: now
      }).executeTakeFirst(); // Use executeTakeFirst if you need result

      console.log('Initial message insertion result:', messageInsertResult);

    });

    console.log(`Successfully created chat ${chatId} and initial message.`);
    // Return the ID and title of the newly created chat
    return Response.json({ id: chatId, title });

  } catch (error) {
    console.error('Error creating chat:', error);
    // Provide more context in server logs but generic error to client
    return Response.json({ error: "Failed to create chat due to an internal error." }, { status: 500 });
  }
}