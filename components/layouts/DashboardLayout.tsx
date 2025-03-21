'use client'

import { motion } from "framer-motion";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <Sidebar />
      <motion.main 
        className="pt-16 min-h-[calc(100vh-4rem)]"
        animate={{
          marginLeft: isCollapsed ? 64 : 256
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.main>
    </div>
  );
}