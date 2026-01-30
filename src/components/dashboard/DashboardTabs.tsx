import React from 'react';

// Neutrade-style Icon component
const Icon = ({ name, className = "", active = false }: { name: string; className?: string; active?: boolean }) => {
  const iconMap: Record<string, string> = {
    'overview': '/icons/disc-02.svg',
    'api-keys': '/icons/lock-03.svg',
    'analytics': '/icons/disc-02.svg',
    'products': '/icons/file-02.svg',
    'reports': '/icons/file-02.svg',
    'users': '/icons/building-01.svg',
  };
  
  return (
    <img 
      src={iconMap[name] || '/icons/file-02.svg'} 
      alt={name}
      className={`w-5 h-5 ${className}`}
      style={{ filter: active ? 'brightness(0) invert(1)' : 'brightness(0) opacity(0.6)' }}
    />
  );
};

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: 'overview' },
  { id: 'api-keys', label: 'API Keys', icon: 'api-keys' },
  { id: 'analytics', label: 'Analytics', icon: 'analytics' },
  { id: 'products', label: 'Products', icon: 'products' },
  { id: 'reports', label: 'Reports', icon: 'reports' },
  { id: 'users', label: 'Users', icon: 'users' },
];

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="hidden md:block bg-[var(--n-2)]">
      <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-1 p-1.5 bg-[var(--n-surface-1)] rounded-2xl border border-[var(--n-stroke)] my-4 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[var(--n-primary)] text-white shadow-sm'
                    : 'text-[var(--n-secondary)] hover:text-[var(--n-primary)] hover:bg-[var(--n-surface-2)]'
                }`}
              >
                <Icon name={tab.icon} active={isActive} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardTabs;
