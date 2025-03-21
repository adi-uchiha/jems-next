
import { cn } from "@/lib/utils";

interface BadgeProps {
  text: string;
  variant?: "outline" | "filled";
  color?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
  icon?: React.ReactNode;
}

const badgeVariants = {
  outline: {
    default: "border-gray-200 text-gray-700",
    success: "border-green-200 text-green-700",
    warning: "border-yellow-200 text-yellow-700",
    danger: "border-red-200 text-red-700",
    info: "border-blue-200 text-blue-700",
  },
  filled: {
    default: "bg-gray-100 text-gray-800 border-transparent",
    success: "bg-green-100 text-green-800 border-transparent",
    warning: "bg-yellow-100 text-yellow-800 border-transparent",
    danger: "bg-red-100 text-red-800 border-transparent",
    info: "bg-blue-100 text-blue-800 border-transparent",
  },
};

export const Badge = ({
  text,
  variant = "outline",
  color = "default",
  className,
  icon,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border",
        badgeVariants[variant][color],
        "transition-all duration-200",
        className
      )}
    >
      {icon && <span className="h-3.5 w-3.5">{icon}</span>}
      {text}
    </span>
  );
};

export default Badge;
