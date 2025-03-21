
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface Session {
  id: string;
  startTime: string;
  endTime: string;
  status: "completed" | "in-progress" | "failed";
  jobsScraped: number;
}

const sessions: Session[] = [
  {
    id: "SS-1234",
    startTime: "2023-10-01 09:30:45",
    endTime: "2023-10-01 09:45:12",
    status: "completed",
    jobsScraped: 124,
  },
  {
    id: "SS-1235",
    startTime: "2023-10-02 14:22:10",
    endTime: "2023-10-02 14:40:05",
    status: "completed",
    jobsScraped: 87,
  },
  {
    id: "SS-1236",
    startTime: "2023-10-03 11:15:30",
    endTime: "",
    status: "in-progress",
    jobsScraped: 45,
  },
  {
    id: "SS-1237",
    startTime: "2023-10-04 16:10:22",
    endTime: "2023-10-04 16:12:15",
    status: "failed",
    jobsScraped: 3,
  },
  {
    id: "SS-1238",
    startTime: "2023-10-05 10:05:18",
    endTime: "2023-10-05 10:25:32",
    status: "completed",
    jobsScraped: 102,
  },
];

const ScrapingSessionTable = () => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Recent Scraping Sessions</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          View All
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session ID</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Jobs Scraped</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.id}</TableCell>
                <TableCell>{session.startTime}</TableCell>
                <TableCell>{session.endTime || "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn({
                      "bg-green-500/10 text-green-500 border-green-500/20": session.status === "completed",
                      "bg-blue-500/10 text-blue-500 border-blue-500/20": session.status === "in-progress",
                      "bg-red-500/10 text-red-500 border-red-500/20": session.status === "failed",
                    })}
                  >
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{session.jobsScraped}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ScrapingSessionTable;
