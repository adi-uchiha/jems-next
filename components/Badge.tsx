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
    default: "border-border/50 text-foreground dark:border-border/30 dark:text-foreground/90",
    success: "border-green-200/80 text-green-700 dark:border-green-500/30 dark:text-green-400",
    warning: "border-yellow-200/80 text-yellow-700 dark:border-yellow-500/30 dark:text-yellow-400",
    danger: "border-red-200/80 text-red-700 dark:border-red-500/30 dark:text-red-400",
    info: "border-blue-200/80 text-blue-700 dark:border-blue-500/30 dark:text-blue-400",
  },
  filled: {
    default: "bg-muted/50 text-foreground border-transparent dark:bg-muted/20",
    success: "bg-green-100/50 text-green-800 border-transparent dark:bg-green-500/20 dark:text-green-300",
    warning: "bg-yellow-100/50 text-yellow-800 border-transparent dark:bg-yellow-500/20 dark:text-yellow-300",
    danger: "bg-red-100/50 text-red-800 border-transparent dark:bg-red-500/20 dark:text-red-300",
    info: "bg-blue-100/50 text-blue-800 border-transparent dark:bg-blue-500/20 dark:text-blue-300",
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
        "transition-all duration-200 hover:opacity-80",
        className
      )}
    >
      {icon && <span className="h-3.5 w-3.5">{icon}</span>}
      {text}
    </span>
  );
};

export default Badge;
