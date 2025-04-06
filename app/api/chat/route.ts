//app/api/chat/route.ts
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getPineconeContext } from "@/lib/pinecone";
import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSystemPrompt } from "../../../lib/chat/prompt";

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session?.user?.id) {
      console.error("User not authenticated");
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;
    
    // Get user's resume data
    const userResume = await db
      .selectFrom('resumes')
      .where('userId', '=', session.user.id)
      .where('status', '=', 'active')
      .select([
        'personalInfoName',
        'personalInfoEmail',
        'education',
        'experience',
        'projects',
        'technicalSkills',
        'certificationsAchievements'
      ])
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .executeTakeFirst();

    // Format resume data for the AI
    const resumeContext = JSON.stringify(userResume);

    // Get relevant job postings from Pinecone
    const jobPostings = await getPineconeContext(lastMessage, 5, 0.3);

    console.log("Job postings:", jobPostings);
    console.log("-----------------------------------------------------------------------------------")
    
    const systemPrompt = {
      role: "system",
      content: getSystemPrompt(resumeContext, jobPostings),
    };

    console.log("-----------------------------------------------------------------------------------")
    console.log("User messages:", messages);

    const response = await streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt.content,
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
      maxTokens: 1000,
    });

    
    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}