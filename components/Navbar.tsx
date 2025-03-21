
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing pages
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400"
            >
              JobView
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Home
              </Link>
              <Link to="/saved" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/saved' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Saved Jobs
              </Link>
              <Link to="/applied" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/applied' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                Applied
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative w-64">
              <Input
                type="search"
                placeholder="Search jobs..."
                className="pl-9 h-9 w-full bg-gray-50 border-gray-200 focus:bg-white transition-all"
              />
              <Search className="absolute left-2.5 top-2 h-4.5 w-4.5 text-gray-400" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Button variant="default" size="sm" className="font-medium">
              Post a Job
            </Button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="relative mb-4">
              <Input
                type="search"
                placeholder="Search jobs..."
                className="pl-9 h-9 w-full bg-gray-50 border-gray-200"
              />
              <Search className="absolute left-2.5 top-2 h-4.5 w-4.5 text-gray-400" />
            </div>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}>
                Home
              </Link>
              <Link to="/saved" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/saved' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}>
                Saved Jobs
              </Link>
              <Link to="/applied" className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/applied' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}>
                Applied
              </Link>
              <Button variant="default" size="sm" className="font-medium mt-2">
                Post a Job
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
