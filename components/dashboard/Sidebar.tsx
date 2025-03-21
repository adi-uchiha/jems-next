'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  User, 
  ChevronLeft, 
  ChevronRight,
  FileSpreadsheet,
  BarChart,
  CalendarDays,
  HelpCircle
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

const menuItems = [
  { 
    title: 'Dashboard', 
    icon: Activity, 
    href: '/dashboard',
    badge: null
  },
  { 
    title: 'My Jobs', 
    icon: Briefcase, 
    href: '/dashboard/jobs',
    badge: '12'
  },
  { 
    title: 'Chat Assistant', 
    icon: MessageSquare, 
    href: '/dashboard/chat',
    badge: 'New'
  },
  { 
    title: 'Applications', 
    icon: FileSpreadsheet, 
    href: '/dashboard/applications',
    badge: null
  },
  { 
    title: 'Analytics', 
    icon: BarChart, 
    href: '/dashboard/analytics',
    badge: null
  },
  { 
    title: 'Calendar', 
    icon: CalendarDays, 
    href: '/dashboard/calendar',
    badge: null
  },
  { 
    title: 'Settings', 
    icon: Settings, 
    href: '/dashboard/settings',
    badge: null
  },
  { 
    title: 'Profile', 
    icon: User, 
    href: '/dashboard/profile',
    badge: null
  },
];

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <motion.aside 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)]",
        "bg-background/80 backdrop-blur-xl border-r border-border/50",
        "transition-all duration-300 ease-in-out z-30",
        isCollapsed ? "w-16" : "w-64",
        "dark:bg-background/20 dark:border-border/20"
      )}
      initial={false}
      animate={{
        width: isCollapsed ? 64 : 256,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "flex items-center justify-center",
          "h-10 my-2" // Consistent height with menu items
        )}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className={cn(
              "text-primary hover:text-primary hover:bg-primary/10",
              "h-8 w-8 p-0", // Fixed size for better centering
              "flex items-center justify-center"
            )}
          >
            {isCollapsed ? 
              <ChevronRight className="h-4 w-4" /> : 
              <ChevronLeft className="h-4 w-4" />
            }
          </Button>
        </div>
        
        <nav className="space-y-2 px-2">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center h-10 gap-3 rounded-md transition-colors",
                // Center icon when collapsed
                isCollapsed ? "justify-center px-0" : "px-3",
                "hover:bg-accent/50 dark:hover:bg-accent/20",
                pathname === item.href ? 
                  "bg-accent text-accent-foreground dark:bg-accent/30" : 
                  "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center",
                // Adjust icon container size
                isCollapsed ? "w-8 h-8" : "w-4 h-4",
                "flex-shrink-0"
              )}>
                <item.icon className="w-4 h-4" />
              </div>
              
              <motion.span 
                className="flex-1 whitespace-nowrap"
                animate={{
                  opacity: isCollapsed ? 0 : 1,
                  display: isCollapsed ? "none" : "block",
                }}
                transition={{
                  duration: 0.2,
                  delay: isCollapsed ? 0 : 0.1
                }}
              >
                {item.title}
              </motion.span>
              
              {!isCollapsed && item.badge && (
                <motion.span 
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-full whitespace-nowrap",
                    item.badge === 'New' ? 
                      "bg-primary/20 text-primary" : 
                      "bg-muted text-muted-foreground"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.badge}
                </motion.span>
              )}
            </Link>
          ))}
        </nav>

        <motion.div 
          className="mt-auto px-2 pb-4"
          animate={{
            opacity: isCollapsed ? 0 : 1,
            height: isCollapsed ? 0 : "auto",
          }}
          transition={{ duration: 0.2 }}
        >
          {!isCollapsed && (
            <div className="bg-accent/50 dark:bg-accent/20 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Need help?</p>
              <Button 
                size="sm" 
                className="w-full gap-2"
                variant="outline"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Support</span>
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.aside>
  );
}