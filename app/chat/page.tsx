"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, User, Bot, Loader2, ExternalLink, Linkedin, Globe, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { jobs } from "@/app/api/chat/jobs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessagesSquare } from "lucide-react"
import ReactMarkdown from 'react-markdown'

interface Message {
  role: "user" | "assistant"
  content: string
  jobRecommendations?: JobRecommendation[]
}

interface JobRecommendation {
  id: string
  source: 'glassdoor' | 'google' | 'linkedin' | 'indeed'  // Add this line
  title: string
  company: string
  location: string
  url: string
  salaryRange?: {
    min: number
    max: number
    currency: string
  }
}

// Add this helper function before the ChatPage component
const getSourceIcon = (source: string) => {
  switch (source) {
    case 'linkedin':
      return <Linkedin className="w-4 h-4" />
    case 'glassdoor':
      return <Search className="w-4 h-4" />
    case 'google':
      return <Globe className="w-4 h-4" />
    case 'indeed':
      return <Search className="w-4 h-4" />
    default:
      return <Globe className="w-4 h-4" />
  }
}

// Add this constant before the ChatPage component
const QUICK_MESSAGES = [
  "Can you find jobs for me",
  "How can I improve my resume",
  "Which certifications should I pursue",
  "What jobs should I target?"
] as const

// Add this helper function for markdown styling
const MarkdownStyles = {
  p: "mb-4",
  h1: "text-2xl font-bold mb-4",
  h2: "text-xl font-bold mb-3",
  h3: "text-lg font-bold mb-2",
  ul: "list-disc pl-6 mb-4",
  ol: "list-decimal pl-6 mb-4",
  li: "mb-1",
  strong: "font-bold",
  em: "italic",
  blockquote: "border-l-4 border-primary pl-4 italic mb-4",
  code: "bg-muted rounded px-1 py-0.5",
  pre: "bg-muted rounded p-4 mb-4 overflow-x-auto",
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      if (data.error) {
        toast.error(data.error)
        return
      }

      // Process job recommendations with proper typing
      const jobIds = data.message.match(/\[\[JOBS\]\](.*?)(?=\n|$)/)?.[1]?.split(',') || []
      const jobRecommendations = jobIds
        .map((id: string) => jobs.find(job => job.id === id.trim()))
        .filter((job:any): job is JobRecommendation => Boolean(job))

      // Remove the [[JOBS]] marker from the message
      const cleanMessage = data.message.replace(/\[\[JOBS\]\].*?(?=\n|$)/, '')

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: cleanMessage,
        jobRecommendations
      }])

      toast.success("Message sent successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl h-[calc(100vh-4rem)] p-4">
      <Card className="h-full flex flex-col">
        <CardContent className="flex-1 p-4 flex flex-col">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 mb-4 ${
                    message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
                    ${message.role === "assistant" ? "bg-primary" : "bg-muted"}`}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 max-w-[80%] space-y-4
                    ${message.role === "assistant" 
                      ? "bg-muted" 
                      : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className={MarkdownStyles.p}>{children}</p>,
                          h1: ({ children }) => <h1 className={MarkdownStyles.h1}>{children}</h1>,
                          h2: ({ children }) => <h2 className={MarkdownStyles.h2}>{children}</h2>,
                          h3: ({ children }) => <h3 className={MarkdownStyles.h3}>{children}</h3>,
                          ul: ({ children }) => <ul className={MarkdownStyles.ul}>{children}</ul>,
                          ol: ({ children }) => <ol className={MarkdownStyles.ol}>{children}</ol>,
                          li: ({ children }) => <li className={MarkdownStyles.li}>{children}</li>,
                          strong: ({ children }) => <strong className={MarkdownStyles.strong}>{children}</strong>,
                          em: ({ children }) => <em className={MarkdownStyles.em}>{children}</em>,
                          blockquote: ({ children }) => (
                            <blockquote className={MarkdownStyles.blockquote}>{children}</blockquote>
                          ),
                          code: ({ children }) => <code className={MarkdownStyles.code}>{children}</code>,
                          pre: ({ children }) => <pre className={MarkdownStyles.pre}>{children}</pre>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    
                    {message.jobRecommendations && message.jobRecommendations.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm">Recommended Jobs:</h3>
                        <div className="grid gap-2">
                          {message.jobRecommendations.map((job) => (
                            <div 
                              key={job.id}
                              className="bg-background rounded-lg p-3 shadow-sm"
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{job.title}</h4>
                                    <span className="text-muted-foreground">
                                      {getSourceIcon(job.source)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{job.company}</p>
                                  <p className="text-sm text-muted-foreground">{job.location}</p>
                                  {job.salaryRange && (
                                    <p className="text-sm text-muted-foreground">
                                      {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()} /year
                                    </p>
                                  )}
                                </div>
                                <a
                                  href={job.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 mb-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                  </div>
                  <div className="rounded-lg p-3 bg-muted">
                    Thinking...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="mt-4 space-y-2">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    disabled={isLoading}
                  >
                    <MessagesSquare className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {QUICK_MESSAGES.map((message) => (
                    <DropdownMenuItem
                      key={message}
                      onClick={() => {
                        setInput(message)
                      }}
                      className="cursor-pointer"
                    >
                      {message}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}