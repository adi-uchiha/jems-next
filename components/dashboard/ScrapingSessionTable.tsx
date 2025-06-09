"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ScrapingSession {
  id: number;
  started_at: string;
  ended_at: string | null;
  status: string;
  total_jobs: number;
}

const ScrapingSessionTable = () => {
  const [sessions, setSessions] = useState<ScrapingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch("/api/dashboard/scraping-sessions");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      success: "bg-green-500/20 text-green-500 border-green-500/20",
      completed: "bg-green-500/20 text-green-500 border-green-500/20",
      running: "bg-blue-500/20 text-blue-500 border-blue-500/20",
      failed: "bg-red-500/20 text-red-500 border-red-500/20",
    };
    return (
      variants[status.toLowerCase()] ||
      "bg-gray-500/20 text-gray-500 border-gray-500/20"
    );
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <div className="p-4 text-center">Loading sessions...</div>;
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Recent Scraping Sessions
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          View All
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Jobs Scraped</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.id}</TableCell>
                  <TableCell>{formatDateTime(session.started_at)}</TableCell>
                  <TableCell>
                    {session.ended_at
                      ? formatDateTime(session.ended_at)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        getStatusBadge(session.status),
                        "capitalize"
                      )}
                    >
                      {session.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {session.total_jobs}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScrapingSessionTable;
