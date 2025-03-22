import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getPineconeContext } from "@/lib/pinecone";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Get context from Pinecone
    const context = await getPineconeContext(lastMessage);

    // Define the system prompt with context
    const prompt = [
      {
        role: "system",
        content: `You are a helpful AI assistant powered by Google Gemini. Use the following context to answer the user's question accurately. If the context doesn’t provide enough information, say "I don’t have enough information to answer that fully" and provide a general response if possible.

START CONTEXT BLOCK
${context}
END CONTEXT BLOCK`,
      },
    ];

    // Stream response from Gemini
    const response = await streamText({
      model: google("gemini-1.5-flash"), // Adjust model as needed
      messages: [...prompt, ...messages],
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}