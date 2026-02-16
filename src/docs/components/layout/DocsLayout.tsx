import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { DocsFooter } from '@/docs/components/layout/DocsFooter';
import { DocsNavbar } from '@/docs/components/layout/DocsNavbar';
import { Sidebar } from '@/docs/components/layout/Sidebar';
import { SearchSpotlight } from '@/docs/components/search/SearchSpotlight';
import { useDocsContext } from '@/docs/contexts/DocsContext';

/**
 * Main docs layout shell.
 * Expects to be rendered inside a DocsProvider (provided by DocsApp).
 * Structure: sticky navbar + sidebar + scrollable content area.
 */
export function DocsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { searchOpen, setSearchOpen } = useDocsContext();

  const handleMenuToggle = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Set docs-specific browser tab title and meta tags
  useEffect(() => {
    document.title = 'FuteurCredX Docs — LumiqAI API Documentation';
    const setMeta = (name: string, content: string) => {
      const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (el) {
        el.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };
    const desc = 'Developer documentation for the LumiqAI credit analytics API. Quickstart guides, API reference, sandbox data, and integration examples.';
    setMeta('description', desc);
    setMeta('og:title', 'FuteurCredX Docs — LumiqAI API Documentation');
    setMeta('og:description', desc);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <DocsNavbar onMenuToggle={handleMenuToggle} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

        <main
          className={cn(
            'min-h-[calc(100vh-4rem)] flex-1 overflow-x-hidden',
            'px-4 py-6 lg:px-8 lg:py-10',
          )}
        >
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>

      <DocsFooter />

      <SearchSpotlight isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

export default DocsLayout;
