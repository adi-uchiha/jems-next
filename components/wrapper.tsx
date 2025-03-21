"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Wrapper(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="bg-background/80 backdrop-blur-sm border-b py-3 flex justify-between items-center border-border/40 fixed z-50 w-full px-4 md:px-6 lg:px-8">
        <Link href="/">
          <div className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-opacity">
            <Logo className="w-6 h-6 text-primary" />
            <p className="font-semibold text-lg tracking-tight">JEMS.</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>
      <main className="pt-[4.5rem] w-full">{props.children}</main>
    </div>
  );
}

const queryClient = new QueryClient();

export function WrapperWithQuery(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
