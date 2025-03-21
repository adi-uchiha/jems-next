// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('models/gemini-1.5-pro-latest'),
    messages,
    system: 'respond in markdown format only', 
    temperature: 0.7,
    maxTokens: 1024, 
  });

  return result.toDataStreamResponse();
}