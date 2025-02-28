import { auth } from "@/lib/auth"
import { db } from "@/lib/database/db"
import { NextResponse } from "next/server"
import { GoogleGenerativeAI, GoogleGenerativeAIError } from "@google/generative-ai"
import { headers } from "next/headers"
import { jobs } from "./jobs" // Add this import

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		})

		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			)
		}

		const resume = await db
			.selectFrom("resumes")
			.selectAll()
			.where("userId", "=", session.user.id)
			.where("status", "=", "active")
			.orderBy("updatedAt", "desc")
			.limit(1)
			.executeTakeFirst()

		if (!resume) {
			return NextResponse.json(
				{ error: "No resume found" },
				{ status: 404 }
			)
		}

		const { message } = await req.json()

		// Check if message is asking for job recommendations
		const isAskingForJobs = /jobs?|opportunities|positions|roles|career|work|hiring|opening|vacant|apply/i.test(message)
		if(isAskingForJobs) {
			console.log("User is asking for job recommendations")
		}
		const systemContext = `You are a career advisor AI assistant. You have access to the user's resume data:
		Personal Info: ${resume.personalInfoName}, ${resume.personalInfoEmail}
		Education: ${resume.education}
		Experience: ${resume.experience}
		Projects: ${resume.projects}
		Skills: ${resume.technicalSkills}
		Achievements: ${resume.certificationsAchievements}
		
		${isAskingForJobs ? `
		You have access to the following job listings:
		${JSON.stringify(jobs, null, 2)}

		Analyze the user's resume and suggest relevant positions from the available listings.
		Format your job recommendations with the special marker "[[JOBS]]" followed by the job IDs you recommend, separated by commas.
		Example: "Based on your experience, here are some relevant positions: [[JOBS]]gd-1009652565066,li-4168150744"
		
		Consider the following when recommending jobs:
		1. Match the user's skills and experience level
		2. Consider their location preference (US or India based jobs)
		3. Prioritize jobs that match their career interests
		4. Include a mix of opportunities if appropriate
		` : `
		Focus on providing career advice and answering the user's specific questions.
		Do not include job recommendations unless explicitly asked.
		`}

		Please keep responses professional and relevant to career development.

		User's question: ${message}`

		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
		const result = await model.generateContent([{ text: systemContext }])
		const response = await result.response
		const analysis = response.text()
		
		return NextResponse.json(
			{ message: analysis },
			{ headers: { 'Content-Type': 'application/json' } }
		)

	} catch (error) {
		console.error("Chat error:", error)
		
		if (error instanceof GoogleGenerativeAIError) {
			return NextResponse.json(
				{ error: "AI processing failed: " + error.message },
				{ status: 500 }
			)
		}
		
		return NextResponse.json(
			{ error: "Failed to process chat" },
			{ status: 500 }
		)
	}
}