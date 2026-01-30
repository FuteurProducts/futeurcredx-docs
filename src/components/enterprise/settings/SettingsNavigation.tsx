// Enterprise Settings Navigation - Left rail with sections

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Shield, Key, Lock, Globe, Webhook, Database, Clock, 
  CheckCircle, EyeOff, Cpu, Bell, Plug, Mail, CreditCard, FileText,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { settingsSections } from './mockData';

interface SettingsNavigationProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  shield: Shield,
  key: Key,
  lock: Lock,
  globe: Globe,
  webhook: Webhook,
  database: Database,
  clock: Clock,
  'check-circle': CheckCircle,
  'eye-off': EyeOff,
  cpu: Cpu,
  bell: Bell,
  plug: Plug,
  mail: Mail,
  'credit-card': CreditCard,
  'file-text': FileText,
};

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  activeSection,
  onSectionChange,
}) => {
  // Group sections by category
  const categories = settingsSections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {} as Record<string, typeof settingsSections>);

  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(Object.keys(categories))
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card rounded-lg border border-border shadow-sm h-full overflow-y-auto"
    >
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Settings</h2>
      </div>

      <div className="p-2">
        {Object.entries(categories).map(([category, sections]) => {
          const isExpanded = expandedCategories.has(category);

          return (
            <div key={category} className="mb-1">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-2 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                <span className="uppercase tracking-wider">{category}</span>
              </button>

              {/* Section Items */}
              {isExpanded && (
                <div className="space-y-0.5">
                  {sections.map((section) => {
                    const Icon = iconMap[section.icon] || FileText;
                    const isActive = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        onClick={() => onSectionChange(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{section.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SettingsNavigation;
