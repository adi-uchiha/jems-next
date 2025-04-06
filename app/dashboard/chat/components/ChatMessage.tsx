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
  isNew?: boolean;  // Add this prop
}

function parseJobRecommendations(content: string): { text: string; jobs: Job[] } {
  if (!content.includes("JOB_RECOMMENDATIONS:")) {
    return { text: content, jobs: [] };
  }

  try {
    const [text, recommendationsSection] = content.split("JOB_RECOMMENDATIONS:");
    let jobs: Job[] = [];

    // Try to extract JSON from markdown code block
    const jsonMatch = recommendationsSection.match(/```json\s*([\s\S]*?)```/);
    const jsonString = jsonMatch 
      ? jsonMatch[1].trim()
      : recommendationsSection.trim();

    try {
      jobs = JSON.parse(jsonString);
      jobs = jobs.filter(job => 
        job.id && 
        job.title && 
        job.company && 
        job.location && 
        job.url
      );
    } catch (e) {
      console.error("Failed to parse job recommendations:", e);
    }

    return {
      text: text.trim(),
      jobs
    };
  } catch (e) {
    console.error("Error processing message content:", e);
    return { text: content, jobs: [] };
  }
}

export function ChatMessage({ message, isNew = false }: ChatMessageProps) {
  const { text, jobs } = parseJobRecommendations(message.content);

  return (
    <motion.div
      className="flex gap-4 px-4 py-3 first:pt-6"
      initial={isNew ? { y: 5, opacity: 0 } : false}
      animate={isNew ? { y: 0, opacity: 1 } : false}
    >
      {/* Avatar */}
      <div className="size-8 border rounded-lg p-1.5 flex items-center justify-center shrink-0 text-muted-foreground">
        {message.role === "assistant" ? <BotIcon size={16} /> : <UserIcon size={16} />}
      </div>

      {/* Message Content */}
      <div className="flex flex-col gap-3 w-full">
        {/* Text Content */}
        <div className="text-sm text-foreground">
          <Markdown>{text}</Markdown>
        </div>

        {/* Job Recommendations */}
        {jobs.length > 0 && (
          <div className="mt-4 space-y-3">
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
                  <div className="font-medium">{job.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {job.company} • {job.location}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}