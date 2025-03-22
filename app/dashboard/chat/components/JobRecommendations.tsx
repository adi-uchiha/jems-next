import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { JobRecommendationCard } from "./JobRecommendationCard";
import { motion } from "framer-motion";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
}

interface JobRecommendationsProps {
  jobs: Job[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export function JobRecommendations({ jobs }: JobRecommendationsProps) {
  if (!jobs.length) return null;

  return (
    <motion.div
      className="w-full mt-4"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <ScrollArea className="w-full whitespace-nowrap rounded-lg pb-2">
        <div className="flex gap-4 p-1">
          {jobs.map((job) => (
            <motion.div key={job.id} variants={item}>
              <JobRecommendationCard
                job={job}
                className="animate-fade-in"
              />
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </motion.div>
  );
}