// dashboard/chat/components/ChatMessage.tsx

import { Message } from "ai/react";
import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "lucide-react";
import Markdown from "react-markdown";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
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
              'url' in job
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
            <div className="mt-4 space-y-3 border-t pt-3"> {/* Add border */}
               <h4 className="text-sm font-medium text-muted-foreground">
                  Recommended Jobs
               </h4>
               <div className="grid gap-3 sm:grid-cols-2">
                  {jobs.map((job) => (
                  <a
                     key={job.id}
                     href={job.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="block p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                     <div className="font-medium text-card-foreground">{job.title}</div>
                     <div className="text-sm text-muted-foreground mt-1">
                        {job.company} • {job.location}
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