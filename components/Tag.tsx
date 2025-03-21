
import { cn } from "@/lib/utils";

interface TagProps {
  text: string;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "gray";
  size?: "sm" | "md";
  className?: string;
}

const tagColors = {
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  green: "bg-green-50 text-green-700 border-green-200",
  red: "bg-red-50 text-red-700 border-red-200",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  gray: "bg-gray-50 text-gray-700 border-gray-200",
};

const tagSizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-0.5",
};

export const Tag = ({
  text,
  color = "blue",
  size = "sm",
  className,
}: TagProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        tagColors[color],
        tagSizes[size],
        "transition-all duration-200 animate-scale-in",
        className
      )}
    >
      {text}
    </span>
  );
};

export default Tag;
