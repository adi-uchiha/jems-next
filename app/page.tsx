import { SignInButton, SignInFallback } from "@/components/sign-in-btn";
import { Suspense } from "react";

export default async function Home() {
	const features = [
		"Email & Password",
		"Organization | Teams",
		"Passkeys",
		"Multi Factor",
		"Password Reset",
		"Email Verification",
		"Roles & Permissions",
		"Rate Limiting",
		"Session Management",
	];
	return (
		<div className="min-h-[80vh] flex items-center justify-center overflow-hidden no-visible-scrollbar px-6 md:px-0">
			<main className="flex flex-col gap-4 row-start-2 items-center justify-center">
				<div className="flex flex-col gap-1">
					<h3 className="font-bold text-4xl text-black dark:text-white text-center">
						JEMS.
					</h3>
					<p className="text-center break-words text-sm md:text-base">
						Find better jobs easily{" "}
						 <br />
					</p>
				</div>
				<div className="md:w-10/12 w-full flex flex-col gap-4">
					<div className="flex flex-col gap-3 pt-2 flex-wrap">
						<div className="border-y py-2 border-dotted bg-secondary/60 opacity-80">
							<div className="text-xs flex items-center gap-2 justify-center text-muted-foreground ">
								<span className="text-center">
									Work in progress...
								</span>
							</div>
						</div>
						<div className="flex gap-2 justify-center flex-wrap">
							{features.map((feature) => (
								<span
									className="border-b pb-1 text-muted-foreground text-xs cursor-pointer hover:text-foreground duration-150 ease-in-out transition-all hover:border-foreground flex items-center gap-1"
									key={feature}
								>
									{feature}.
								</span>
							))}
						</div>
					</div>
					{/* @ts-ignore */}
					<Suspense fallback={<SignInFallback />}>
						{/* @ts-ignore */}
						<SignInButton />
					</Suspense>
				</div>
			</main>
		</div>
	);
}
