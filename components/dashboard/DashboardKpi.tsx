import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DashboardKpiProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  icon?: LucideIcon;
  className?: string;
}

const DashboardKpi = ({ 
  title, 
  value, 
  description, 
  trend, 
  icon: Icon, 
  className 
}: DashboardKpiProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden",
        "bg-card/50 backdrop-blur-sm",
        "border-border/60 hover:border-border/80",
        "dark:bg-card/40 dark:border-border/30 dark:hover:border-border/50",
        "transition-all duration-200",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground/70" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {(description || trend !== undefined) && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
            {trend !== undefined && (
              <span 
                className={cn(
                  "ml-1 font-medium",
                  trend > 0 
                    ? "text-green-500 dark:text-green-400" 
                    : "text-red-500 dark:text-red-400"
                )}
              >
                {trend > 0 ? "+" : ""}{trend}%
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardKpi;
