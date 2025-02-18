// app/api/parse-resume/route.ts

import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { GoogleGenerativeAI, GoogleGenerativeAIError } from "@google/generative-ai"
import { headers } from "next/headers"
import { promptTemplate } from "./prompt"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    // console.log(session)
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }
    //Testing purposes only - remove before production
    // return NextResponse.json(
    //   {
    //     success: true,
    //     message: "Parse resume response"
    //   }
    // )

    // Validate content type
    const contentType = req.headers.get('content-type')
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: "Invalid content type. Expected multipart/form-data" },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Handle multipart form data
    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')

    // Create prompt for Gemini with file data
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = promptTemplate

    // Send to Gemini with the PDF file
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Data
        }
      }
    ])
    // console.log("Gemini response:", result)
    const response = await result.response
    const analysis = response.text()
    // console.log("Analysis:", analysis)
    
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
      
      return NextResponse.json(
        { resumeData: parsedAnalysis },
        { 
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    } catch (error) {
      console.error("Error parsing Gemini response:", error)
      // console.log("Cleaned content:", cleanedAnalysis)

      return NextResponse.json(
        { error: "Failed to parse resume data" },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }
  } catch (error) {
    console.error("Error processing resume:", error)
    
    // Handle Gemini API specific errors
    if (error instanceof GoogleGenerativeAIError) {
      return NextResponse.json(
        { error: "AI processing failed: " + error.message },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to process resume" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}

// Configure cors and other options
export const config = {
  api: {
    bodyParser: false,
  },
}