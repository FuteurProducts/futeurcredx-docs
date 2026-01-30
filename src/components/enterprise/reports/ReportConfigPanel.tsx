// Enterprise Report Configuration Panel - Report customization and generation

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, FileText, FileSpreadsheet, Table, Download, Mail, Clock, Play, Loader2 } from 'lucide-react';
import type { ReportTemplate, ReportConfig, ReportFilters, DeliveryOption, ScheduleFrequency } from './types';

interface ReportConfigPanelProps {
  template: ReportTemplate | null;
  filters: ReportFilters;
  onGenerate: (config: ReportConfig) => void;
  isGenerating: boolean;
}

const FormatIcon: React.FC<{ format: string; selected: boolean }> = ({ format, selected }) => {
  const baseClass = `h-5 w-5 ${selected ? 'text-primary' : 'text-muted-foreground'}`;
  switch (format) {
    case 'pdf':
      return <FileText className={baseClass} />;
    case 'xlsx':
      return <FileSpreadsheet className={baseClass} />;
    case 'csv':
      return <Table className={baseClass} />;
    default:
      return <FileText className={baseClass} />;
  }
};

export const ReportConfigPanel: React.FC<ReportConfigPanelProps> = ({
  template,
  filters,
  onGenerate,
  isGenerating,
}) => {
  const [config, setConfig] = useState<Partial<ReportConfig>>({
    name: '',
    format: 'pdf',
    delivery: 'download',
    options: {},
  });

  // Reset config when template changes
  useEffect(() => {
    if (template) {
      const defaultOptions: Record<string, boolean | string> = {};
      template.options.forEach((opt) => {
        defaultOptions[opt.id] = opt.defaultValue;
      });
      setConfig({
        templateId: template.id,
        name: template.name,
        format: template.defaultFormat,
        delivery: 'download',
        options: defaultOptions,
      });
    }
  }, [template]);

  const handleOptionChange = (optionId: string, value: boolean | string) => {
    setConfig((prev) => ({
      ...prev,
      options: { ...prev.options, [optionId]: value },
    }));
  };

  const handleGenerate = () => {
    if (!template) return;
    onGenerate({
      templateId: template.id,
      name: config.name || template.name,
      format: config.format || template.defaultFormat,
      filters,
      options: config.options || {},
      delivery: config.delivery || 'download',
      schedule: config.schedule,
    });
  };

  if (!template) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-lg border border-border shadow-sm h-full flex items-center justify-center"
      >
        <div className="text-center p-8">
          <Settings className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">Select a report template to configure</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card rounded-lg border border-border shadow-sm h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Configure Report</h2>
        <p className="text-sm text-muted-foreground mt-1">{template.name}</p>
      </div>

      {/* Config Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Basic Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Basic Settings</h3>
          
          {/* Report Name */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Report Name</label>
            <input
              type="text"
              value={config.name || ''}
              onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full h-9 px-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Format Selection */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Format</label>
            <div className="flex gap-2">
              {template.supportedFormats.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setConfig((prev) => ({ ...prev, format: fmt }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                    config.format === fmt
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <FormatIcon format={fmt} selected={config.format === fmt} />
                  <span className="text-sm font-medium uppercase">{fmt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scope Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Scope</h3>
          <div className="bg-muted/50 rounded-md p-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Product:</span>{' '}
                <span className="font-medium">{filters.product}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Segment:</span>{' '}
                <span className="font-medium">{filters.segment}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Geography:</span>{' '}
                <span className="font-medium">{filters.geography}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Period:</span>{' '}
                <span className="font-medium">{filters.timeWindow}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Options */}
        {template.options.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Report Options</h3>
            <div className="space-y-2">
              {template.options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={config.options?.[opt.id] === true}
                    onChange={(e) => handleOptionChange(opt.id, e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Delivery</h3>
          <div className="space-y-2">
            {(['download', 'email', 'schedule'] as DeliveryOption[]).map((option) => (
              <label
                key={option}
                className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                  config.delivery === option
                    ? 'bg-primary/5 border-primary/30'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={config.delivery === option}
                  onChange={() => setConfig((prev) => ({ ...prev, delivery: option }))}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <div className="flex items-center gap-2">
                  {option === 'download' && <Download className="h-4 w-4 text-muted-foreground" />}
                  {option === 'email' && <Mail className="h-4 w-4 text-muted-foreground" />}
                  {option === 'schedule' && <Clock className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm font-medium capitalize">{option === 'download' ? 'Download Only' : option === 'email' ? 'Email to Me' : 'Schedule Recurring'}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Schedule Options */}
          {config.delivery === 'schedule' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="pl-7 space-y-3 pt-2"
            >
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Frequency</label>
                  <select
                    value={config.schedule?.frequency || 'weekly'}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        schedule: { frequency: e.target.value as ScheduleFrequency, ...prev.schedule },
                      }))
                    }
                    className="w-full h-8 px-2 text-sm bg-background border border-border rounded-md"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Day</label>
                  <select
                    value={config.schedule?.dayOfWeek || 'Monday'}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        schedule: { frequency: prev.schedule?.frequency || 'weekly', ...prev.schedule, dayOfWeek: e.target.value },
                      }))
                    }
                    className="w-full h-8 px-2 text-sm bg-background border border-border rounded-md"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Time</label>
                  <select
                    value={config.schedule?.time || '08:00'}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        schedule: { frequency: prev.schedule?.frequency || 'weekly', ...prev.schedule, time: e.target.value },
                      }))
                    }
                    className="w-full h-8 px-2 text-sm bg-background border border-border rounded-md"
                  >
                    {['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 h-11 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Generate Report
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ReportConfigPanel;
