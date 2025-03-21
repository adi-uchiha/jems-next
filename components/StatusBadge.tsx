
import { cn } from "@/lib/utils";

type StatusType = "idle" | "scraping" | "success" | "error";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "idle":
        return "bg-secondary text-secondary-foreground";
      case "scraping":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 animate-pulse";
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "idle":
        return "Ready";
      case "scraping":
        return "Scraping...";
      case "success":
        return "Completed";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300",
        getStatusStyles(),
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full mr-1.5", 
        status === "idle" ? "bg-gray-400" : 
        status === "scraping" ? "bg-blue-500 animate-pulse" : 
        status === "success" ? "bg-green-500" : 
        "bg-red-500"
      )} />
      {getStatusText()}
    </span>
  );
}
