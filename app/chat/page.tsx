// components/chat-interface.tsx
"use client";

import { Message } from "ai";
import { useChat } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown"; // Import react-markdown

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BotIcon, UserIcon } from "lucide-react"; // Assuming these exist

// Parse raw streaming text from parts or content
function parseRawText(rawText: string): string {
  const lines = rawText.split("\n");
  let textContent = "";

  for (const line of lines) {
    if (line.startsWith('0:"')) {
      const text = line.slice(3).replace(/\\n/g, "\n").replace(/\\"/g, '"');
      textContent += text.endsWith('"') ? text.slice(0, -1) : text;
    }
  }

  return textContent.trim();
}

// Render a single message
function ChatMessage({ message }: { message: Message }) {
  const content = message.parts?.length
    ? message.parts.map((part) => {
        if (part.type === "text") {
          return parseRawText(part.text); // Parse raw text from parts
        }
        return ""; // Handle other part types if needed (e.g., tool-invocation)
      }).join("")
    : parseRawText(message.content); // Fallback to content if no parts

  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full max-w-2xl first-of-type:pt-4`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {message.role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="text-zinc-800 dark:text-zinc-300">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </motion.div>
  );
}

// Empty state component
function ChatOverview() {
  return (
    <motion.div
      className="max-w-2xl mt-20 mx-4"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="border-none bg-muted/50 rounded-2xl p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400">
        <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
          <span>Chat</span>
        </p>
        <p>
          This is a chatbot powered by Google Gemini, built with Next.js and the Vercel AI SDK. Start typing to ask anything!
        </p>
      </div>
    </motion.div>
  );
}

export default function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    streamProtocol: "text", // Matches your API setup
  });

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current && messagesEndRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-4 bg-background">
      <div className="flex flex-col h-[500px] w-full max-w-2xl border rounded-lg">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          {messages.length === 0 && <ChatOverview />}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
        </ScrollArea>
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t flex gap-2 relative items-end w-full"
        >
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </main>
  );
}