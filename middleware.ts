import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth";

export async function middleware(request: NextRequest) {
	const cookies = getSessionCookie(request);
	if (!cookies) {
		console.log("No session cookie found");
		console.log(request)
		return NextResponse.redirect(new URL("/", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/onboarding"],
};
