import { useState } from 'react';
import { ContentRenderer } from '@/components/content/ContentRenderer';

type DocsPageProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

type Section = 'introduction' | 'dashboard' | 'launch-checklist' | 'sdk-web' | 'quickstart';

export default function DocsPage({ searchQuery, setSearchQuery }: DocsPageProps) {
  const [activeSection, setActiveSection] = useState<Section>('introduction');

  const renderContent = () => <ContentRenderer section={activeSection} setActiveSection={setActiveSection} />;

  const NavLink = ({ section, children }: { section: Section, children: React.ReactNode }) => (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); setActiveSection(section); }}
      className={`block px-3 py-2 text-sm rounded-md ${activeSection === section ? 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'}`}
    >
      {children}
    </a>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-80 border-r dark:border-gray-900 dark:bg-[#0d0d0f] hidden md:block">
          <div className="p-6 space-y-8">
            {/* General Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">General</h3>
              <nav className="space-y-1">
                <NavLink section="introduction">Introduction</NavLink>
                <NavLink section="launch-checklist">Launch Checklist</NavLink>
                <NavLink section="dashboard">Dashboard</NavLink>
              </nav>
            </div>

            {/* SDK Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-8 mb-3">SDK</h3>
              <nav className="space-y-1">
                <NavLink section="sdk-web">Web</NavLink>
              </nav>
            </div>
          
           

            {/* Lumiq Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-8 mb-3">Lumiq</h3>
              <nav className="space-y-1">
                <NavLink section="quickstart">Quickstart</NavLink>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 min-h-screen">
          <div className="max-w-4xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
