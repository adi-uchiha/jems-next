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
    // Since the AI is sending JSON directly after JOB_RECOMMENDATIONS:, 
    // we can try to parse it directly
    const jsonStartIndex = recommendationsSection.indexOf('[');
    const jsonEndIndex = recommendationsSection.lastIndexOf(']') + 1;
    
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
      const jsonString = recommendationsSection.substring(jsonStartIndex, jsonEndIndex);
      const parsedData = JSON.parse(jsonString);

      if (Array.isArray(parsedData)) {
        jobs = parsedData.filter(job =>
          job &&
          typeof job.id === 'string' &&
          typeof job.title === 'string' &&
          typeof job.company === 'string' &&
          typeof job.location === 'string' &&
          typeof job.url === 'string'
        );
        console.log(`ChatMessage: Successfully parsed ${jobs.length} jobs`);
      }
    }

    // Get any remaining text after the JSON array
    const remainingText = recommendationsSection.substring(jsonEndIndex).trim();
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