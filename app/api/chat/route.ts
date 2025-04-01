import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getPineconeContext } from "@/lib/pinecone";
import { db } from "@/lib/database/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    console.log("Session:", session);
    
    if (!session?.user?.id) {
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
    const resumeContext = userResume ? `
User Resume Information:
- Name: ${userResume.personalInfoName}
- Skills: ${JSON.parse(userResume.technicalSkills).join(', ')}
- Experience: ${JSON.parse(userResume.experience).map((exp: any) => 
  `${exp.title} at ${exp.company} (${exp.duration})`
).join(', ')}
- Education: ${JSON.parse(userResume.education).map((edu: any) => 
  `${edu.degree} from ${edu.institution}`
).join(', ')}
    ` : 'No resume information available.';

    // Get relevant job postings from Pinecone
    const jobPostings = await getPineconeContext(lastMessage, 5, 0.3);

    console.log("Job postings:", jobPostings);
    console.log("-----------------------------------------------------------------------------------")
    
    const systemPrompt = {
      role: "system",
      content: `You are a helpful AI assistant powered by Google Gemini. Your primary role is to assist users with job-related queries and provide personalized recommendations based on their resume and interests.
      EVERYTIME THE USER ASKS FOR JOB RECOMMENDATIONS, YOU SHOULD: GIVE RECCOMMENDATIONS FROM THE JOB POSTINGS GIVEN IN THE CONTEXT OR THE PREVIOUS MESSAGES.
      
      ${resumeContext}

      ${jobPostings !== "No relevant context found." ? `
      I have found some relevant job postings that might interest the user:
      
      ${jobPostings}
      
      When providing job recommendations:
      1. Analyze the job postings and match them with the user's skills and experience
      2. Provide a natural, conversational response explaining why these jobs are good matches
      3. Reference specific skills or experience from their resume that make them a good fit
      4. Format the recommendations by appending this marker:
      "JOB_RECOMMENDATIONS:" followed by a JSON array of jobs
      
      Each job in the JSON should have:
      - id: the job posting ID
      - title: job title
      - company: company name
      - location: job location
      - url: job posting URL
      
      Example format:
      Based on your experience with [specific technology] at [previous company], this role at...
      
      JOB_RECOMMENDATIONS:[{"id":"123","title":"Software Engineer","company":"Google","location":"CA, US","url":"https://..."}]
      ` : 'Unfortunately, I could not find any relevant job postings at the moment. Let me help you with general career advice based on your background instead.'}`,
    };
    console.log("-----------------------------------------------------------------------------------")
    console.log("System prompt:", systemPrompt);
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