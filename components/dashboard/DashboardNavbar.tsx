'use client'

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { BellIcon, User, Settings, LogOut, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

const pathNames = {
  '/dashboard': 'Dashboard',
  '/dashboard/jobs': 'My Jobs',
  '/dashboard/chat': 'Chat Assistant',
  '/dashboard/applications': 'Applications',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/calendar': 'Calendar',
  '/dashboard/settings': 'Settings',
  '/dashboard/profile': 'Profile'
};

export function DashboardNavbar() {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();
  const [notifications] = useState([
    { id: 1, title: 'New job match', description: '3 new jobs match your profile' },
    { id: 2, title: 'Application update', description: 'Interview scheduled for Frontend Role' }
  ]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl z-40 dark:bg-background/20 dark:border-border/20 pr-8 pl-4">
      <div 
        className={cn(
          "flex items-center justify-between h-full transition-all duration-300",
          "mx-auto",
          isCollapsed ? "ml-16" : "ml-64",
          "pr-6 pl-8", // Increased left padding for better alignment
          "max-w-[2000px]" // Increased max-width for better use of space
        )}
      >
        {/* Left section - Logo & Breadcrumb */}
        <div className="flex items-center gap-8"> {/* Increased gap */}
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="JEMS Logo"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="font-bold text-xl hidden sm:inline-block tracking-tight">
              JEMS
            </span>
          </Link>

          <div className="h-8 w-px bg-border/50 dark:bg-border/40" />

          
        </div>

        {/* Center section - Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-12"> {/* Adjusted width and margin */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search anything..." 
              className={cn(
                "w-full pl-9",
                "bg-background/50 dark:bg-background/50",
                "border-border/50 dark:border-border/50",
                "focus:ring-primary/20",
                "h-10" // Increased height for better visibility
              )}
            />
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-6"> {/* Increased gap */}
          {/* Welcome message */}
          <span className="hidden xl:block text-sm">
            Welcome back, <span className="font-semibold text-foreground">John Doe</span>
          </span>

          <div className="h-6 w-px bg-border/50 dark:bg-border/40" />
          
          <div className="flex items-center gap-4"> {/* Increased gap */}
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "relative text-muted-foreground hover:text-foreground",
                    "focus-visible:ring-1 focus-visible:ring-ring",
                    "transition-colors",
                    "h-10 w-10" // Increased button size
                  )}
                >
                  <BellIcon className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    NOTIFICATIONS
                  </DropdownMenuLabel>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Mark all as read
                  </Button>
                </div>
                {notifications.map(notification => (
                  <DropdownMenuItem key={notification.id} className="p-4">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="gap-3 px-3 h-10" // Adjusted padding and height
                >
                  <Avatar className="h-8 w-8"> {/* Increased avatar size */}
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>UI</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block font-medium">
                    John Doe
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 p-3 border-b border-border/50">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>UI</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@example.com</p>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}