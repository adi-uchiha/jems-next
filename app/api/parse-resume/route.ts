// app/api/parse-resume/route.ts

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI, GoogleGenerativeAIError } from "@google/generative-ai";
import { headers } from "next/headers";
import { promptTemplate } from "./prompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ error: "No file URL provided" }, { status: 400 });
    }

    // Fetch the file from the URL
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = promptTemplate;

    const result = await model.generateContent([
      prompt,
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
      // Remove ```json and ``` from the response
      const cleanedAnalysis = analysis
        .replace(/```json\s*/g, '')    // Remove ```json anywhere in the text
        .replace(/```\s*$/g, '')       // Remove trailing ```
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
        .split('\n')                   // Split into lines
        .filter(line => line.trim())   // Remove empty lines
        .join('\n'); 
      
      // Parse the cleaned response
      const parsedAnalysis = JSON.parse(cleanedAnalysis.trim())
      return NextResponse.json({ resumeData: parsedAnalysis });
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return NextResponse.json({ error: "Failed to parse resume data" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing resume:", error);

    if (error instanceof GoogleGenerativeAIError) {
      return NextResponse.json({ error: "AI processing failed: " + error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to process resume" }, { status: 500 });
  }
}

// Configure cors and other options
export const config = {
  api: {
    bodyParser: false,
  },
}