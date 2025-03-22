"use client";

import { Message, useChat } from "ai/react"; // v4 import
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BotIcon, UserIcon } from "lucide-react";
import { JobRecommendations } from "./components/JobRecommendations";

// Simplified content extraction
function getMessageContent(message: Message): string {
  const content = message.content || "";
  console.log("Raw message content:", content);
  return content.trim();
}

// Render a single message
function ChatMessage({ message }: { message: Message }) {
  const content = getMessageContent(message);
  
  // Extract job recommendations if present
  const hasRecommendations = content.includes("JOB_RECOMMENDATIONS:");
  let textContent = content;
  let jobs: { id: string; title: string; company: string; location: string; url: string }[] = [];

  if (hasRecommendations) {
    try {
      const [text, recommendationsSection] = content.split("JOB_RECOMMENDATIONS:");
      textContent = text.trim();
      console.log("Text content:", textContent);
      console.log("Recommendations section:", recommendationsSection);

      // Extract JSON from markdown code block
      const jsonMatch = recommendationsSection.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        const jsonString = jsonMatch[1].trim();
        console.log("Extracted JSON:", jsonString);
        jobs = JSON.parse(jsonString);

        // Validate and filter job data
        jobs = jobs.filter(job => 
          job.id && 
          job.title && 
          job.company && 
          job.location && 
          job.url
        );
        console.log("Parsed jobs:", jobs);
      } else {
        console.error("No valid JSON found in recommendations section:", recommendationsSection);
      }
    } catch (e) {
      console.error("Failed to parse job recommendations:", e);
    }
  }

  return (
    <motion.div
      className="flex flex-col gap-4 px-4 w-full max-w-2xl first-of-type:pt-4"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex gap-4">
        <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
          {message.role === "assistant" ? <BotIcon /> : <UserIcon />}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="text-foreground dark:text-foreground/90">
            {textContent ? (
              <Markdown>{textContent}</Markdown>
            ) : (
              <p className="text-red-500">[No content to display]</p>
            )}
          </div>
        </div>
      </div>
      
      {jobs.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Recommended Jobs
          </h3>
          <JobRecommendations jobs={jobs} />
        </div>
      )}
    </motion.div>
  );
}

// Empty state component (unchanged)
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
          This is a chatbot powered by JEMS, built with Pinecone and Next.js. Start typing to ask anything!
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
  });

  // Auto-scroll to bottom and log messages
  useEffect(() => {
    if (scrollAreaRef.current && messagesEndRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    console.log("Current messages:", JSON.stringify(messages, null, 2));
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