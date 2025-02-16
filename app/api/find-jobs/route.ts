import { NextResponse } from "next/server"

export async function POST(req: Request) {
  await new Promise(resolve => setTimeout(resolve, 2500))
  
  return NextResponse.json(
    { 
      success: true, 
      jobs: [
        { id: 1, title: "Software Engineer", company: "Example Corp" },
        { id: 2, title: "Frontend Developer", company: "Tech Co" }
      ]
    },
    { headers: { 'Content-Type': 'application/json' } }
  )
}