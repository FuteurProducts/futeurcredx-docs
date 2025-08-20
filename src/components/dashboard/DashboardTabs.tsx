import React from 'react';
import { BarChart3, Key } from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 p-2 bg-blue-50/50 backdrop-blur-sm rounded-2xl border border-blue-200 my-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
            }`}>
            <BarChart3 className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('api-keys')}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
              activeTab === 'api-keys'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
            }`}>
            <Key className="w-5 h-5" />
            API Keys
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardTabs;
