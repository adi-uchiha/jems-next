import { useState, useEffect } from "react";
import Link from "next/link"; // Changed to Next.js Link
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check system preference on mount
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
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
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-12",
        {
          "bg-background/80 backdrop-blur-md shadow-sm": scrolled,
          "bg-transparent": !scrolled
        }
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white font-bold text-xl">
            J
          </div>
          <span className="text-xl font-bold">JEMS</span>
        </div>

        <NavigationMenu className="hidden md:flex">
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
            <NavigationMenuItem>
              <NavigationMenuLink
                className="px-4 py-2 inline-flex items-center justify-center"
                href="#testimonials"
              >
                Testimonials
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="px-4 py-2 inline-flex items-center justify-center"
                href="#cta"
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                href="/dashboard"
                className="px-4 py-2 inline-flex items-center justify-center"
              >
                Dashboard
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" className="text-sm hidden sm:inline-flex">
            Login
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Sign Up Free
          </Button>
        </div>
      </div>
    </header>
  );
};

interface ListItemProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  [key: string]: any;
}

const ListItem = ({ className, title, children, ...props }: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
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
};

export default Header;
