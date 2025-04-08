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
  let jsonString: string | null = null;

  // Prioritize extracting from ```json block
  const jsonBlockMatch = recommendationsSection.match(/```json\s*([\s\S]*?)\s*```/);

  if (jsonBlockMatch && jsonBlockMatch[1]) {
    jsonString = jsonBlockMatch[1].trim();
    console.log("ChatMessage: Found JSON block:", jsonString);
  } else {
     // --- Fallback REMOVED ---
     // If no explicit json block, assume no structured jobs were intended or correctly formatted
     console.warn("ChatMessage: JOB_RECOMMENDATIONS marker found, but no ```json block. Treating as text.");
     // Return the rest of the section as text if needed, or just the text part
     // For simplicity, let's just return the text before the marker for now.
     // If the AI includes text after the marker BUT outside a ```json block, it will be ignored.
     return { text: textPart, jobs: [] };
  }

  if (jsonString) {
    try {
      // Attempt to parse the extracted JSON string
      const parsedData = JSON.parse(jsonString);

      // Validate if it's an array and filter for valid job objects
      if (Array.isArray(parsedData)) {
        jobs = parsedData.filter(job =>
          job && // Check if job is not null/undefined
          typeof job.id === 'string' &&
          typeof job.title === 'string' &&
          typeof job.company === 'string' &&
          typeof job.location === 'string' &&
          typeof job.url === 'string'
        );
        console.log(`ChatMessage: Parsed ${jobs.length} valid jobs.`);
      } else {
         console.warn("ChatMessage: Parsed data is not an array.", parsedData);
      }

    } catch (e: unknown) {
      // Log the specific error and the string that failed
      console.error("ChatMessage: Failed to parse job recommendations JSON.", {
         error: e instanceof Error ? e.message : String(e),
         jsonStringAttempted: jsonString // Log the string we tried to parse
      });
      // Keep jobs as empty array on error
    }
  }

  return {
    text: textPart, // Return only the text part before the marker
    jobs
  };
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