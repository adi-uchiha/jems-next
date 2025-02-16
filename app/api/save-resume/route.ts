import { NextResponse } from "next/server"

export async function POST(req: Request) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return NextResponse.json(
    { success: true, message: "Resume saved successfully" },
    { headers: { 'Content-Type': 'application/json' } }
  )
}