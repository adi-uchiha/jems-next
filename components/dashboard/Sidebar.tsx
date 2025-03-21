'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    <aside 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)]",
        "bg-background/80 backdrop-blur-xl border-r border-border/50",
        "transition-all duration-300 ease-in-out z-30",
        isCollapsed ? "w-16" : "w-64",
        "dark:bg-background/20 dark:border-border/20"
      )}
    >
      <div className="flex flex-col h-full">
        <Button 
          variant="ghost" 
          size="sm" 
          className="self-end m-2 text-muted-foreground hover:text-foreground"
          onClick={toggleSidebar}
        >
          {isCollapsed ? 
            <ChevronRight className="h-4 w-4" /> : 
            <ChevronLeft className="h-4 w-4" />
          }
        </Button>
        
        <nav className="space-y-2 px-2 py-4">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                "hover:bg-accent/50 dark:hover:bg-accent/20",
                pathname === item.href ? 
                  "bg-accent text-accent-foreground dark:bg-accent/30" : 
                  "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && (
                <span className="flex-1">{item.title}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className={cn(
                  "px-2 py-0.5 text-xs rounded-full",
                  item.badge === 'New' ? 
                    "bg-primary/20 text-primary" : 
                    "bg-muted text-muted-foreground"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-2 pb-4">
          {!isCollapsed && (
            <div className="bg-accent/50 dark:bg-accent/20 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Need help?</p>
              <Button 
                size="sm" 
                className="w-full gap-2"
                variant="outline"
              >
                <HelpCircle className="h-4 w-4" />
                Support
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}