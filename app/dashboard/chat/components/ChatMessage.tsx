// dashboard/chat/components/ChatMessage.tsx

import { Badge } from "@/components/ui/badge";
import { Message } from "ai/react";
import { motion } from "framer-motion";
import { BotIcon, Briefcase, Building, ExternalLink, MapPin, UserIcon } from "lucide-react";
import Image from "next/image";
import Markdown from "react-markdown";
import { getSourceIcon } from "@/lib/utils/job-utils";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source_site?: string;  // Add source_site field
}

interface ChatMessageProps {
  message: Message;
  isNew?: boolean;
}

// More robust parsing function
function parseJobRecommendations(content: string): { text: string; jobs: Job[] } {
  const marker = "JOB_RECOMMENDATIONS:";
  const markerIndex = content.indexOf(marker);

  // If marker not found, return all content as text
  if (markerIndex === -1) {
    return { text: content, jobs: [] };
  }

  const textPart = content.substring(0, markerIndex).trim();
  const recommendationsSection = content.substring(markerIndex + marker.length);

  let jobs: Job[] = [];

  try {
    // Find potential JSON arrays in the text
    const matches = recommendationsSection.match(/\[[\s\S]*?\]/g);
    
    if (matches && matches.length > 0) {
      // Try parsing each potential JSON array
      for (const match of matches) {
        try {
          const parsedData = JSON.parse(match);
          if (Array.isArray(parsedData)) {
            const validJobs = parsedData.filter(job =>
              job &&
              typeof job === 'object' &&
              'id' in job &&
              'title' in job &&
              'company' in job &&
              'location' in job &&
              'url' in job &&
              'source_site' in job  // Add source_site check
            );
            
            if (validJobs.length > 0) {
              jobs = validJobs;
              break; // Use the first valid array found
            }
          }
        } catch (parseError) {
          console.debug("Failed to parse potential JSON array:", parseError);
          continue; // Try next match if available
        }
      }
    }

    // Get text after the JSON array
    const jsonEndIndex = recommendationsSection.lastIndexOf(']') + 1;
    const remainingText = jsonEndIndex > 0 
      ? recommendationsSection.substring(jsonEndIndex).trim()
      : recommendationsSection;

    return {
      text: textPart + (remainingText ? '\n\n' + remainingText : ''),
      jobs
    };

  } catch (e) {
    console.error("ChatMessage: Failed to parse job recommendations:", e);
    return { text: content, jobs: [] };
  }
}


export function ChatMessage({ message, isNew = false }: ChatMessageProps) {
  // Only parse if it's an assistant message
  console.log("CHATMESSAGE: Rendering message:", message.content);
  const { text, jobs } = message.role === 'assistant'
    ? parseJobRecommendations(message.content)
    : { text: message.content, jobs: [] }; // User messages are just text

  return (
    <motion.div
      // Add conditional styling for assistant messages maybe?
      className={`flex gap-4 px-4 py-3 ${message.role === 'user' ? 'justify-end' : ''}`}
      initial={isNew ? { y: 5, opacity: 0 } : false}
      animate={isNew ? { y: 0, opacity: 1 } : false}
      transition={{ duration: 0.3 }} // Add transition duration
    >
      {/* Avatar (Consider swapping order for user messages) */}
      {message.role === "assistant" && (
        <div className="size-8 border rounded-lg p-1.5 flex items-center justify-center shrink-0 text-muted-foreground bg-card">
           <BotIcon size={16} />
        </div>
      )}

      {/* Message Bubble */}
      <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
         <div className={`rounded-lg p-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {/* Text Content */}
            {text && (
               <div className="text-sm">
               {/* Use prose for better markdown styling if you have tailwind typography */}
               <Markdown>
                  {text}
               </Markdown>
               </div>
            )}

            {/* Job Recommendations */}
            {jobs.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border/50"></div>
                  <h4 className="text-sm font-medium text-muted-foreground px-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Recommended Jobs
                  </h4>
                  <div className="h-px flex-1 bg-border/50"></div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {jobs.map((job) => (
                    <a
                      key={job.id}
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-lg border bg-card p-4
                        hover:border-primary/50 hover:shadow-md
                        transition-all duration-300 ease-in-out
                        dark:hover:shadow-primary/5"
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Content */}
                      <div className="relative space-y-3">
                        {/* Title and Source Icon */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-card-foreground/90 group-hover:text-primary 
                            transition-colors duration-300 line-clamp-2">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Image
                              src={getSourceIcon(job.url, job.source_site)}
                              alt={job.source_site || "Source"}
                              width={16}
                              height={16}
                              className="opacity-60 group-hover:opacity-100 transition-opacity"
                            />
                            <ExternalLink className="w-4 h-4 text-muted-foreground/40 
                              group-hover:text-primary/70 transition-colors" />
                          </div>
                        </div>

                        {/* Company and Location */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 
                              transition-colors">
                              <Building className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-muted-foreground/70 group-hover:text-muted-foreground 
                              transition-colors line-clamp-1">
                              {job.company}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 
                              transition-colors">
                              <MapPin className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-muted-foreground/70 group-hover:text-muted-foreground 
                              transition-colors line-clamp-1">
                              {job.location || "Remote/Unspecified"}
                            </span>
                          </div>
                        </div>

                        {/* Source and Apply Badge */}
                        <div className="flex items-center justify-between pt-2">
                          <Badge 
                            variant="secondary"
                            className="bg-primary/10 hover:bg-primary/20 text-primary 
                              group-hover:bg-primary/30 transition-colors"
                          >
                            View Details
                          </Badge>
                          <span className="text-xs text-muted-foreground/60 group-hover:text-muted-foreground/80 
                            transition-colors">
                            via {job.source_site || "Job Board"}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
         </div>
      </div>

       {/* Avatar for User (Optional, place after bubble) */}
       {message.role === "user" && (
        <div className="size-8 border rounded-lg p-1.5 flex items-center justify-center shrink-0 text-muted-foreground bg-card">
           <UserIcon size={16} />
        </div>
      )}
    </motion.div>
  );
}