import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { getPineconeContext } from "@/lib/pinecone";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;
    
    // Get relevant job postings from Pinecone
    const jobPostings = await getPineconeContext(lastMessage, 5, 0.7);

    console.log("Job postings:", jobPostings);
    const systemPrompt = {
      role: "system",
      content: `You are a helpful AI assistant powered by Google Gemini. Your primary role is to assist users with job-related queries and provide personalized recommendations.
      
      ${jobPostings !== "No relevant context found." ? `
      I have found some relevant job postings that might interest the user:
      
      ${jobPostings}
      
      When providing job recommendations:
      1. Analyze the job postings and the user's query
      2. Provide a natural, conversational response explaining why these jobs might be good matches
      3. Format the recommendations by appending this marker:
      "JOB_RECOMMENDATIONS:" followed by a JSON array of jobs
      
      Each job in the JSON should have:
      - id: the job posting ID
      - title: job title
      - company: company name
      - location: job location
      - url: job posting URL
      
      Example format:
      Here are some great matches for you...
      
      JOB_RECOMMENDATIONS:[{"id":"123","title":"Software Engineer","company":"Google","location":"CA, US","url":"https://..."}]
      ` : 'Unfortunately, I could not find any relevant job postings at the moment. Let me help you with general career advice instead.'}`,
    };


    const response = await streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt.content,
      messages: [systemPrompt, ...messages],
      temperature: 0.7, // Add some creativity while keeping responses focused
      maxTokens: 1000,  // Limit response length
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}