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
  const pathname = usePathname();
  const [notifications] = useState([
    { id: 1, title: 'New job match', description: '3 new jobs match your profile' },
    { id: 2, title: 'Application update', description: 'Interview scheduled for Frontend Role' }
  ]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl z-40 dark:bg-background/20 dark:border-border/20">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section - Logo and Page Title */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Image
              src="/images/logo.png"
              alt="JEMS Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-semibold text-xl hidden sm:inline-block">
              JEMS
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">
              {pathNames[pathname as keyof typeof pathNames]}
            </h1>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="w-full pl-9 bg-muted/50"
            />
          </div>
        </div>

        {/* Right section - Theme, Notifications, Profile */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "relative text-muted-foreground hover:text-foreground",
                  "focus-visible:ring-1 focus-visible:ring-ring",
                  "transition-colors"
                )}
              >
                <BellIcon className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map(notification => (
                <DropdownMenuItem key={notification.id} className="p-4">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">
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
                className="gap-2 h-8 px-2 sm:px-3"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>UI</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">User</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}