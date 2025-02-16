// app/api/parse-resume/route.ts

import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { GoogleGenerativeAI, GoogleGenerativeAIError } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    // Check authentication
    //todo

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

    const prompt = `Please analyze this resume and provide the following information in JSON format:
    {
      "personalInfo": {
        "name": "",
        "email": "",
        "phone": "",
        "location": ""
      },
      "education": [{
        "degree": "",
        "institution": "",
        "year": "",
        "gpa": ""
      }],
      "experience": [{
        "title": "",
        "company": "",
        "duration": "",
        "responsibilities": []
      }],
      "skills": [],
      "certifications": []
    }
    
    Please ensure all fields are properly filled based on the resume content.
    Return ONLY the JSON, with no additional text.`

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
    console.log("Gemini response:", result)
    const response = await result.response
    const analysis = response.text()
    console.log("Analysis:", analysis)
    return NextResponse.json(
      { analysis: "Done" },
      { 
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
    try {
      // Parse the response to ensure it's valid JSON
      const parsedAnalysis = JSON.parse(analysis.trim())
      return NextResponse.json(
        { analysis: parsedAnalysis },
        { 
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    } catch (error) {
      console.error("Error parsing Gemini response:", error)
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