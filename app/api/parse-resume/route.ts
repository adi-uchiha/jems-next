// app/api/parse-resume/route.ts

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI, GoogleGenerativeAIError } from "@google/generative-ai";
import { headers } from "next/headers";
import {promptTemplate} from "./prompt"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export const maxDuration = 30; //Because This request take 15-20 seconds to process
const resumePrompt = promptTemplate;

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Get file URL from request
    const { fileUrl } = await req.json();
    if (!fileUrl) {
      return NextResponse.json(
        { error: "No file URL provided" }, 
        { status: 400 }
      );
    }

    // Fetch PDF from uploadthing URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }

    // Convert PDF to base64
    const buffer = await response.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content with PDF and prompt
    const result = await model.generateContent([
      resumePrompt,
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Data,
        },
      },
    ]);

    const aiResponse = await result.response;
    const analysis = aiResponse.text();

    try {
      // Clean and parse the response
      const cleanedAnalysis = analysis
        .replace(/```json\s*/g, '')
        .replace(/```\s*$/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .split('\n')
        .filter(line => line.trim())
        .join('\n');

      const parsedResume = JSON.parse(cleanedAnalysis.trim());

      // Add metadata
      const resumeData = {
        ...parsedResume,
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: session.user.id,
      };

      return NextResponse.json(
        { resumeData }, 
        { 
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

    } catch (parseError) {
      console.error("Error parsing LLM response:", parseError);
      return NextResponse.json(
        { error: "Failed to parse resume data" }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error processing resume:", error);

    if (error instanceof GoogleGenerativeAIError) {
      return NextResponse.json({ error: "AI processing failed: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to process resume" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};