import { ExternalLink, Github, Menu, Search } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useDocsContext } from '@/docs/contexts/DocsContext';

interface DocsNavbarProps {
  onMenuToggle?: () => void;
}

export function DocsNavbar({ onMenuToggle }: DocsNavbarProps) {
  const { setSearchOpen } = useDocsContext();

  return (
    <header
      className={cn(
        'sticky top-0 z-50',
        'flex h-16 items-center justify-between',
        'border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl',
        'px-4 lg:px-6',
      )}
    >
      {/* Left: Logo + hamburger */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuToggle}
          className={cn(
            'rounded-lg p-2 text-gray-400 hover:text-white',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
            'lg:hidden',
          )}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2.5"
          aria-label="FuteurCredX Docs home"
        >
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent">
            FuteurCredX
          </span>
          <span className="rounded-md bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-400">
            Docs
          </span>
        </a>
      </div>

      {/* Right: Search, links */}
      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className={cn(
            'hidden items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-1.5 sm:flex',
            'text-sm text-gray-400',
            'transition-all duration-200 hover:border-gray-600 hover:text-gray-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
          )}
          aria-label="Search documentation"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Search...</span>
          <kbd className="ml-2 rounded border border-gray-600 bg-gray-700/50 px-1.5 py-0.5 text-xs text-gray-500">
            Ctrl+K
          </kbd>
        </button>

        {/* Mobile search icon */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className={cn(
            'rounded-lg p-2 text-gray-400 hover:text-white sm:hidden',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
          )}
          aria-label="Search documentation"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Dashboard link */}
        <a
          href="https://sandbox.futeurcredx.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white md:flex',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
          )}
          aria-label="Open dashboard (opens in new tab)"
        >
          Dashboard
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>

        {/* GitHub link */}
        <a
          href="https://github.com/futeurcredx"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'rounded-lg p-2 text-gray-400 hover:text-white',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
          )}
          aria-label="View on GitHub (opens in new tab)"
        >
          <Github className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
