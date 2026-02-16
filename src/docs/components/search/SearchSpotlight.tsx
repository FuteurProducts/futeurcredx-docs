import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Fuse from 'fuse.js';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Search,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { endpoints } from '@/docs/data/endpoints';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  path: string;
  section: 'API Reference' | 'FAQ' | 'Pages';
}

/**
 * Static page entries for search. API endpoints and FAQ items
 * will be imported from data modules when they exist.
 */
const staticPages: SearchItem[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'FuteurCredX API documentation overview',
    path: '/',
    section: 'Pages',
  },
  {
    id: 'quickstart',
    title: 'Quickstart',
    description: 'Get started with the FuteurCredX API in 5 minutes',
    path: '/quickstart',
    section: 'Pages',
  },
  {
    id: 'authentication',
    title: 'Authentication',
    description: 'Learn about API key and Bearer token authentication',
    path: '/authentication',
    section: 'Pages',
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    description: 'Complete API endpoint documentation',
    path: '/api-reference',
    section: 'Pages',
  },
  {
    id: 'sandbox',
    title: 'Sandbox',
    description: 'Test with pre-seeded sandbox data across 4 banks',
    path: '/sandbox',
    section: 'Pages',
  },
  {
    id: 'errors',
    title: 'Errors',
    description: 'Error codes, response formats, and troubleshooting',
    path: '/errors',
    section: 'Pages',
  },
  {
    id: 'data-models',
    title: 'Data Models',
    description: 'Schema definitions for all API resources',
    path: '/data-models',
    section: 'Pages',
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    description: 'Real-time event notifications for your application',
    path: '/webhooks',
    section: 'Pages',
  },
  {
    id: 'changelog',
    title: 'Changelog',
    description: 'Latest updates and version history',
    path: '/changelog',
    section: 'Pages',
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Frequently asked questions about the FuteurCredX API',
    path: '/faq',
    section: 'Pages',
  },
];

const sectionIcons: Record<string, typeof Search> = {
  'API Reference': BookOpen,
  FAQ: HelpCircle,
  Pages: FileText,
};

const sectionColors: Record<string, string> = {
  'API Reference': 'bg-blue-500/15 text-blue-400',
  FAQ: 'bg-amber-500/15 text-amber-400',
  Pages: 'bg-emerald-500/15 text-emerald-400',
};

interface SearchSpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchSpotlight({ isOpen, onClose }: SearchSpotlightProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Build search index
  const fuse = useMemo(() => {
    const allItems: SearchItem[] = [...staticPages];

    // Index API endpoints for search
    endpoints.forEach((ep) => {
      allItems.push({
        id: `ep-${ep.id}`,
        title: `${ep.method} ${ep.path}`,
        description: ep.title,
        path: `/api-reference#${ep.id}`,
        section: 'API Reference',
      });
    });

    return new Fuse(allItems, {
      keys: ['title', 'description', 'path'],
      threshold: 0.4,
      includeScore: true,
    });
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) {
      return staticPages.slice(0, 8);
    }
    return fuse.search(query).map((r) => r.item).slice(0, 10);
  }, [query, fuse]);

  // Group results by section
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    for (const item of results) {
      if (!groups[item.section]) {
        groups[item.section] = [];
      }
      groups[item.section].push(item);
    }
    return groups;
  }, [results]);

  const flatResults = results;

  const handleSelect = useCallback(
    (item: SearchItem) => {
      navigate(item.path);
      onClose();
      setQuery('');
    },
    [navigate, onClose],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (flatResults[activeIndex]) {
            handleSelect(flatResults[activeIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [flatResults, activeIndex, handleSelect, onClose],
  );

  // Reset state and focus on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      // Use a timeout to ensure the input exists in the DOM
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active result into view
  useEffect(() => {
    if (resultsRef.current) {
      const activeElement = resultsRef.current.querySelector(
        `[data-index="${activeIndex}"]`,
      );
      activeElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  if (!isOpen) {
    return null;
  }

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="Close search"
      />

      {/* Modal */}
      <div
        className={cn(
          'relative z-10 w-full max-w-xl',
          'overflow-hidden rounded-2xl border border-gray-700',
          'bg-gray-900 shadow-2xl shadow-black/50',
          'animate-in fade-in zoom-in-95 duration-150',
        )}
        role="dialog"
        aria-label="Search documentation"
        aria-modal="true"
      >
        {/* Search input */}
        <div className="flex items-center border-b border-gray-800 px-4">
          <Search className="h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documentation..."
            className={cn(
              'flex-1 bg-transparent px-3 py-4 text-sm text-white',
              'placeholder:text-gray-500',
              'focus:outline-none',
            )}
            aria-label="Search query"
            autoComplete="off"
          />
          <kbd className="rounded border border-gray-700 bg-gray-800 px-1.5 py-0.5 text-xs text-gray-500">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={resultsRef}
          className="max-h-80 overflow-y-auto p-2"
          role="listbox"
          aria-label="Search results"
        >
          {flatResults.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {Object.entries(groupedResults).map(([section, items]) => {
            const SectionIcon = sectionIcons[section] ?? FileText;
            const colorClass = sectionColors[section] ?? 'bg-gray-500/15 text-gray-400';

            return (
              <div key={section} className="mb-2">
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {section}
                </div>
                {items.map((item) => {
                  const currentIndex = flatIndex;
                  flatIndex += 1;
                  const isActive = currentIndex === activeIndex;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      data-index={currentIndex}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(currentIndex)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left',
                        'transition-colors duration-100',
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:bg-gray-800/50',
                      )}
                      role="option"
                      aria-selected={isActive}
                    >
                      <SectionIcon
                        className="h-4 w-4 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="truncate text-xs text-gray-500">
                          {item.description}
                        </div>
                      </div>
                      <span
                        className={cn(
                          'flex-shrink-0 rounded-md px-2 py-0.5 text-xs font-medium',
                          colorClass,
                        )}
                      >
                        {section}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 border-t border-gray-800 px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <kbd className="rounded border border-gray-700 bg-gray-800 px-1 py-0.5 text-[10px]">
              ↑↓
            </kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <kbd className="rounded border border-gray-700 bg-gray-800 px-1 py-0.5 text-[10px]">
              ↵
            </kbd>
            Select
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <kbd className="rounded border border-gray-700 bg-gray-800 px-1 py-0.5 text-[10px]">
              Esc
            </kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
