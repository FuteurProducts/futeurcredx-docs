"use client"

import { getCrossDomainUrl } from "@/utils/domainUtils";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Search, Sparkles, ChevronRight, Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

type DocsHeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function DocsHeader({ searchQuery, setSearchQuery }: DocsHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleDashboardClick = () => {
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const targetPath = isSignedIn ? "/dashboard" : "/login";

    if (isLocalhost) {
      navigate(targetPath);
    } else {
      window.location.href = getCrossDomainUrl(targetPath);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#0d0d0f] border-b border-gray-200 dark:border-white/10">
      {/* Top Tier */}
      <header className="relative flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <a href="https://www.futeurcredx.com" className="flex items-center flex-shrink-0">
            <h1 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">FUTEURCREDX</h1>
          </a>
        </div>

        <div className="flex-1 flex justify-center mx-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
            <input
              ref={searchInputRef}
              className="w-full h-9 pl-10 pr-20 rounded-md text-sm transition-all duration-200 bg-gray-100 dark:bg-[#0d0d0f] border border-gray-300 dark:border-white/80 text-black dark:text-white placeholder-gray-500 dark:placeholder-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-white/50 border-transparent focus:border-blue-500 dark:focus:border-white/50"
              type="text"
              placeholder="Search for API.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <kbd className="absolute top-1/2 right-3 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-gray-100 dark:bg-[#0d0d0f] border-gray-300 dark:border-gray-600 px-1.5 font-mono text-xs text-gray-600 dark:text-gray-400 sm:flex">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={handleDashboardClick}
              className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200"
            >
              <span>Dashboard</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center w-9 h-9 rounded-full text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors duration-200"
            >
              <Sun className="w-5 h-5 transition-transform duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-5 h-5 transition-transform duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Bottom Tier */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-white/10" />
          <nav className="flex space-x-8 text-sm font-medium">
            <Link to="/docs" className={`py-3 transition-colors ${location.pathname === '/docs' ? 'text-black dark:text-white border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>Docs</Link>
            <Link to="/docs/api-reference" className={`py-3 transition-colors ${location.pathname === '/docs/api-reference' ? 'text-black dark:text-white border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}>API Reference</Link>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors py-3">Changelog</a>
          </nav>
        </div>
      </div>
    </div>
  );
}

