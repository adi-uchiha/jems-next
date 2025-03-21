
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { ReactElement, ReactNode } from "react";

interface DashboardChartProps {
  title: string;
  children: ReactElement; // This fixes the type error
  className?: string;
  config: any;
}

const DashboardChart = ({ title, children, className, config }: DashboardChartProps) => {
  return (
    <Card className={cn("overflow-hidden bg-card/30 backdrop-blur-sm border-border/30", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-60" config={config}>
          {children}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardChart;
