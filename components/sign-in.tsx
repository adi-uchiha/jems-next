"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { signIn } from "@/lib/auth-client";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Key, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	return (
		<Card className="z-50 rounded-md rounded-t-none w-[95vw] sm:w-full sm:max-w-md mx-auto">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
						/>
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
							<Link
								href="/forget-password"
								className="ml-auto inline-block text-sm underline"
							>
								Forgot your password?
							</Link>
						</div>
						<PasswordInput
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="password"
							placeholder="Password"
						/>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox
							onClick={() => {
								setRememberMe(!rememberMe);
							}}
						/>
						<Label>Remember me</Label>
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={loading}
						onClick={async () => {
							await signIn.email(
								{
									email: email,
									password: password,
									callbackURL: "/dashboard",
									rememberMe,
								},
								{
									onRequest: () => {
										setLoading(true);
									},
									onResponse: () => {
										setLoading(false);
									},
									onError: (ctx) => {
										toast.error(ctx.error.message);
									},
								},
							);
						}}
					>
						{loading ? <Loader2 size={16} className="animate-spin" /> : "Login"}
					</Button>


					<div className="grid grid-cols-3 gap-2">
						<Button
							variant="outline"
							className="gap-2"
							onClick={async () => {
								await signIn.social({
									provider: "github",
									callbackURL: "/dashboard",
								});
							}}
						>
							<GitHubLogoIcon />
						</Button>

						<Button
							variant="outline"
							className=" gap-2"
							onClick={async () => {
								await signIn.social({
									provider: "google",
									callbackURL: "/onboarding",
								});
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="0.98em"
								height="1em"
								viewBox="0 0 256 262"
							>
								<path
									fill="#4285F4"
									d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
								/>
								<path
									fill="#34A853"
									d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
								/>
								<path
									fill="#FBBC05"
									d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
								/>
								<path
									fill="#EB4335"
									d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
								/>
							</svg>
						</Button>

						<Button
							variant="outline"
							className="gap-2"
							onClick={async () => {
								await signIn.social({
									provider: "linkedin",
									callbackURL: "/dashboard",
								});
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 448 512" fill="currentColor"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" fill="currentColor"></path></svg>
						</Button>
					</div>

					<Button
						variant="outline"
						className="gap-2"
						onClick={async () => {
							await signIn.passkey({
								fetchOptions: {
									onSuccess(context) {
										router.push("/dashboard");
									},
									onError(context) {
										toast.error(context.error.message);
									},
								},
							});
						}}
					>
						<Key size={16} />
						Sign-in with Passkey
					</Button>
				</div>
			</CardContent>
			<CardFooter>
				<div className="flex justify-center w-full border-t py-4">
					<p className="text-center text-xs text-neutral-500">
						Secured by <span className="text-green-500">JEMS.</span>
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}
