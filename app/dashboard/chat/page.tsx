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
import { cn } from "@/lib/utils";

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

      // Improved JSON extraction
      const jsonMatch = recommendationsSection.match(/```json\s*([\s\S]*)$/); // Capture everything after ```json
      if (jsonMatch && jsonMatch[1]) {
        let jsonString = jsonMatch[1].trim();
        // Remove closing ``` if present, or stop at end of string
        jsonString = jsonString.replace(/```\s*$/, "").trim();
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
        // Fallback: Try parsing the whole section as JSON if no ``` markers
        const fallbackJson = recommendationsSection.trim();
        if (fallbackJson.startsWith("[")) {
          jobs = JSON.parse(fallbackJson);
          jobs = jobs.filter(job => 
            job.id && 
            job.title && 
            job.company && 
            job.location && 
            job.url
          );
          console.log("Fallback parsed jobs:", jobs);
        } else {
          console.error("No valid JSON found in recommendations section:", recommendationsSection);
        }
      }
    } catch (e) {
      console.error("Failed to parse job recommendations:", e);
    }
  }

  return (
    <motion.div
      className="flex flex-col gap-6 px-6 w-full max-w-4xl first-of-type:pt-4"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex gap-4">
        <div className="size-8 border rounded-lg p-1.5 flex flex-col justify-center items-center shrink-0 text-zinc-500">
          {message.role === "assistant" ? <BotIcon className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div className="text-foreground dark:text-foreground/90 text-base">
            {textContent ? (
              <Markdown>{textContent}</Markdown>
            ) : (
              <p className="text-red-500">[No content to display]</p>
            )}
          </div>
        </div>
      </div>
      
      {jobs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-base font-medium text-muted-foreground mb-4">
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
  }, [messages]);

  return (
    <main className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] p-4 bg-background">
      <div className={cn(
        "flex flex-col w-full max-w-5xl",
        "h-[80vh]",
        "border rounded-lg overflow-hidden",
        "bg-card/50 dark:bg-card/40",
        "backdrop-blur-sm",
        "border-border/50 dark:border-border/30",
        "shadow-sm dark:shadow-none"
      )}>
        <ScrollArea 
          ref={scrollAreaRef} 
          className="flex-1 px-4 py-6"
        >
          {messages.length === 0 && <ChatOverview />}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} className="h-px" />
        </ScrollArea>

        <form
          onSubmit={handleSubmit}
          className={cn(
            "p-4 border-t flex gap-3 items-end",
            "border-border/50 dark:border-border/30",
            "bg-background/50 dark:bg-background/50",
            "backdrop-blur-sm"
          )}
        >
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
            className={cn(
              "flex-1",
              "h-12",
              "px-4",
              "text-base",
              "bg-card/50 dark:bg-card/40",
              "border-border/50 dark:border-border/30",
              "focus:ring-primary/20 dark:focus:ring-primary/30"
            )}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            size="lg"
            className="px-6"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </main>
  );
}