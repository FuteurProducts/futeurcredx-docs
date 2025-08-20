import { Button } from "@/components/ui/button";
import { ArrowUpRight, Copy, Edit3, FileText } from "lucide-react";

type DocsPageProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export default function DocsPage({ searchQuery, setSearchQuery }: DocsPageProps) {
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
                <a href="#" className="block px-3 py-2 text-sm bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white rounded-md">
                  Introduction
                </a>
               
               
                <a
                  href="#"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-md"
                >
                  Launch Checklist
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-md"
                >
                  Dashboard
                  <span className="text-xs">›</span>
                </a>
              </nav>
            </div>

            {/* SDK Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">SDK</h3>
              <nav className="space-y-1">
              
                <a
                  href="#"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-md"
                >
                  Web
                </a>
               
              </nav>
            </div>

            {/* CardSwitcher Section */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Lumiq</h3>
              <nav className="space-y-1">
                <a
                  href="#"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-md"
                >
                  Quickstart
                </a>
               
                <a
                  href="#"
                  className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-md"
                >
                  Testing
                </a>
               
                <a
                  href="#"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-md"
                >
                  LUMIQ AI
                  <span className="px-1.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded">Beta</span>
                </a>
               
              </nav>
            </div>

           
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">General</div>

            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Introduction</h1>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent text-gray-600 border-gray-300 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-white">
                <Copy className="h-4 w-4" />
                Copy page
              </Button>
            </div>

            {/* API Mockup Image */}
            <div className="my-8 max-w-4xl mx-auto">
              <img src="/ApiDocs.png" alt="API Documentation Mockup" className="w-full rounded-lg shadow-lg" />
            </div>

            {/* Content Text */}
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                FuteurCredX provides developers with powerful financial data through our flagship API, the Lumiq Credit Journey. This service grants direct access to comprehensive Experian credit data, enabling you to build sophisticated financial products and services.
              </p>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                The Lumiq Credit Journey API delivers a wealth of information, including the FSR Score, Intelliscore Plus, industry payment insights, and detailed credit health analytics. You can access critical data points such as risk factors, credit inquiries, tradelines, industry risk, collections, business obligations, and credit utilization. Gaining access is straightforward—simply create an account to start integrating our powerful credit data into your applications.
              </p>
            </div>

            {/* Quickstart Guides */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="#" className="group block p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                <div className="flex justify-between items-start">
                  <FileText className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  <ArrowUpRight className="h-5 w-5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Reference</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Explore and integrate with API endpoints</p>
                </div>
              </a>
              <a href="#" className="group block p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                <div className="flex justify-between items-start">
                  <Edit3 className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  <ArrowUpRight className="h-5 w-5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">LUMIQ Quickstart Guide</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Get started with LUMIQ in just a few minutes</p>
                </div>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
