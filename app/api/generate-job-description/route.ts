import { NextResponse } from "next/server";
import db from "lib/database/db.ts";
import { GoogleGenerativeAI, GoogleGenerativeAIError } from "@google/generative-ai"
import { promptTemplate } from './prompt'
import {auth} from "@/lib/auth";
import {resumeDetails} from 'path_to_resume_data'  // @Shelke, pls help, i need to import table where parsed resume data is stored

// Initialize OpenAI with your API key (ensure OPENAI_API_KEY is set in your env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const {resume, userId} = req.body;
    if (!resume || !userId) {
        return res.status(400).json({error: 'Missing resume or user'});
    }
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
  }
  catch (error){
    console.error("Error:", error)
  }

  try {
    // const prompt = `I have attached a resume in this message, I want you to parse and analyze it and come up with a job description that best suits this resume. Keep in mind that the key skills mentioned in your generated Job Description must be the key skills present in the resume:\n\n${resume}`;
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})
    const systemPrompt = promptTemplate
    const resumeData = await resumeDetails(userId)

    const messages = [
      {role: "system", content: systemPrompt},
      {role: "user", content: resumeData}
    ]
    try{
      const result = await model.generateContent(messages)

      return NextResponse.json(
          {jobDescription: result},
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
      )
    }
    catch (error){
      console.error("Error in generating Job Description: ", error)
      if (error instanceof GoogleGenerativeAIError) {
        return NextResponse.json(
            {error: "AI processing failed: " + error.message},
            {
              status: 500,
              headers: {
                'Content-Type':'application/json',
              }
            }
        )
      }
    }
  } catch (error) {
    console.error('Error generating job description:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}