import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { createMetadata } from "@/lib/metadata";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
            <Toaster richColors closeButton />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

