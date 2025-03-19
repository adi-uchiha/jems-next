import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Wrapper, WrapperWithQuery } from "@/components/wrapper";
import { createMetadata } from "@/lib/metadata";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";


export const metadata = createMetadata({
	title: {
		template: "%s | JEMS.",
		default: "JEMS.",
	},
	description: "Find jobs easily.",
	metadataBase: new URL("https://jems-next.vercel.app/"),
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon/favicon.ico" sizes="any" />
			</head>
			<body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
			<NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
				<ThemeProvider attribute="class" defaultTheme="dark">
					<Wrapper>
						<WrapperWithQuery>{children}</WrapperWithQuery>
					</Wrapper>
					<Toaster richColors closeButton />
				</ThemeProvider>
			</body>
		</html>
	);
}

