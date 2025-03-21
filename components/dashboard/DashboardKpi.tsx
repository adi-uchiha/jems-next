
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
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend !== undefined) && (
          <p className="text-xs text-muted-foreground">
            {description}
            {trend !== undefined && (
              <span className={cn("ml-1", trend > 0 ? "text-green-500" : "text-red-500")}>
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
