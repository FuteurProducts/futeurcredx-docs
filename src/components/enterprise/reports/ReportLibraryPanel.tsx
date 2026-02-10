// Enterprise Report Library Panel - Template catalog with search and categories

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, FileSpreadsheet, Table, ChevronDown, ChevronRight } from 'lucide-react';
import type { ReportTemplate, ReportCategory } from './types';
import { categoryLabels } from './mockData';
import { EmptyState } from '@/components/ui/empty-state';

interface ReportLibraryPanelProps {
  templates: ReportTemplate[];
  selectedTemplateId: string | null;
  onSelectTemplate: (template: ReportTemplate) => void;
}

const categoryOrder: ReportCategory[] = ['portfolio', 'underwriting', 'customer', 'compliance', 'api'];

const FormatIcon: React.FC<{ format: string }> = ({ format }) => {
  switch (format) {
    case 'pdf':
      return <FileText className="h-4 w-4 text-destructive" />;
    case 'xlsx':
      return <FileSpreadsheet className="h-4 w-4 text-success" />;
    case 'csv':
      return <Table className="h-4 w-4 text-info" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
};

export const ReportLibraryPanel: React.FC<ReportLibraryPanelProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<ReportCategory>>(
    new Set(categoryOrder)
  );

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;
    const query = searchQuery.toLowerCase();
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
    );
  }, [templates, searchQuery]);

  const groupedTemplates = useMemo(() => {
    const groups: Record<ReportCategory, ReportTemplate[]> = {
      portfolio: [],
      underwriting: [],
      customer: [],
      compliance: [],
      api: [],
    };
    filteredTemplates.forEach((t) => {
      groups[t.category].push(t);
    });
    return groups;
  }, [filteredTemplates]);

  const toggleCategory = (category: ReportCategory) => {
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
      className="bg-card rounded-2xl border border-border shadow-sm h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-h6 font-semibold text-foreground mb-3">Report Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-9 pr-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredTemplates.length === 0 && searchQuery.trim() && (
          <EmptyState
            icon={FileText}
            title="No reports found"
            description="No reports match your current search. Try different keywords or create a new report."
          />
        )}
        {categoryOrder.map((category) => {
          const categoryTemplates = groupedTemplates[category];
          if (categoryTemplates.length === 0) return null;

          const isExpanded = expandedCategories.has(category);

          return (
            <div key={category} className="mb-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span>{categoryLabels[category]}</span>
                <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
                  {categoryTemplates.length}
                </span>
              </button>

              {/* Template Items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {categoryTemplates.map((template) => (
                      <motion.button
                        key={template.id}
                        onClick={() => onSelectTemplate(template)}
                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                          selectedTemplateId === template.id
                            ? 'bg-primary/10 border border-primary/30'
                            : 'hover:bg-muted/50'
                        }`}
                        whileHover={{ x: 2 }}
                      >
                        <FormatIcon format={template.defaultFormat} />
                        <div className="flex-1 min-w-0">
                          <p className="text-body-2 font-medium text-foreground truncate">
                            {template.name}
                          </p>
                          <p className="text-caption text-muted-foreground truncate mt-0.5">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {template.supportedFormats.map((fmt) => (
                              <span
                                key={fmt}
                                className="text-[10px] px-1.5 py-0.5 bg-muted rounded uppercase"
                              >
                                {fmt}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ReportLibraryPanel;
