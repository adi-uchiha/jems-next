"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MoonIcon, SunIcon, MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

interface ListItemProps {
  href: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ListItem = ({ className, children, title, href, ...props }: ListItemProps) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        href={href}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
);

const Header = () => {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4",
        {
          "bg-background/80 backdrop-blur-md shadow-sm": scrolled,
          "bg-transparent": !scrolled
        }
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="JEMS Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Centered Navigation */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <NavigationMenu className="mx-auto">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px] md:w-[500px] md:grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex flex-col h-full p-6 rounded-md bg-gradient-to-b from-muted/50 to-muted"
                        href="#features"
                      >
                        <div className="text-sm font-medium mb-2 text-primary">AI-Powered</div>
                        <div className="text-lg font-medium">Job Matching</div>
                        <p className="text-sm text-muted-foreground mt-auto">
                          JEMS uses advanced AI to match your skills with the perfect job opportunities.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="#chat" title="Chat Assistant" className="">
                    Get personalized job recommendations through our AI chat.
                  </ListItem>
                  <ListItem href="#process" title="Real-Time Scraping" className="">
                    Fresh listings from top job boards, updated in real-time.
                  </ListItem>
                  <ListItem href="#testimonials" title="Smart Filtering" className="">
                    No more duplicate listings or irrelevant positions.
                  </ListItem>
                </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>How It Works</NavigationMenuTrigger>
                <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px]">
                  <ListItem href="#process" title="Step 1: Upload Resume" className="">
                    Share your skills and experience with JEMS.
                  </ListItem>
                  <ListItem href="#process" title="Step 2: Set Preferences" className="">
                    Tell us what you're looking for in your next role.
                  </ListItem>
                  <ListItem href="#process" title="Step 3: Get Matches" className="">
                    Receive personalized job recommendations.
                  </ListItem>
                </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Section - Updated Authentication Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {isDark ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {session ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Controls - Updated */}
        <div className="md:hidden flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {isDark ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-9 w-9"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Menu Dropdown - Updated */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[65px] p-4 bg-background/80 backdrop-blur-md border-b border-border">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#process"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              {session ? (
                <Button asChild className="w-full">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/sign-in">Login</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
