"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Wrapper(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full dark:bg-black bg-white relative flex justify-center">
      <div className="bg-white dark:bg-black border-b py-2 flex justify-between items-center border-border absolute z-50 w-full lg:w-8/12 px-4 md:px-1">
        <Link href="/">
          <div className="flex gap-2 cursor-pointer">
            <Logo className="w-6 h-6" />
            <p className="dark:text-white text-black">JEMS.</p>
          </div>
        </Link>
        <div className="z-50 flex items-center">
          <ThemeToggle />
        </div>
      </div>
      <div className="mt-20 lg:w-7/12 w-full">{props.children}</div>
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
