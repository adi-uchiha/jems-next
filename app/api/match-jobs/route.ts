import { NextResponse } from "next/server"

export async function POST(req: Request) {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return NextResponse.json(
    { 
      success: true, 
      matches: [
        { jobId: 1, matchScore: 85 },
        { jobId: 2, matchScore: 92 }
      ]
    },
    { headers: { 'Content-Type': 'application/json' } }
  )
}