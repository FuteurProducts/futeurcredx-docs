import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Icon component
const Icon = ({ name, className = "", style }: { name: string; className?: string; style?: React.CSSProperties }) => {
  const iconMap: Record<string, string> = {
    'bell': '/icons/recording-01.svg',
    'mail': '/icons/mail-01.svg',
    'check': '/icons/check.svg',
    'chevron-down': '/icons/chevron-down.svg',
  };

  // Inline SVG icons for phone, slack, clock
  if (name === 'phone') {
    return (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" style={{ filter: 'brightness(0) opacity(0.7)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    );
  }

  if (name === 'slack') {
    return (
      <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 24 24" style={{ filter: 'brightness(0) opacity(0.7)' }}>
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 5.042a2.528 2.528 0 0 1-2.52-2.52A2.528 2.528 0 0 1 18.956 0a2.528 2.528 0 0 1 2.523 2.522v2.52H18.956zM18.956 6.313a2.528 2.528 0 0 1 2.523 2.521 2.528 2.528 0 0 1-2.523 2.521h-6.313A2.528 2.528 0 0 1 10.12 8.834a2.528 2.528 0 0 1 2.523-2.521h6.313zM13.042 18.956a2.528 2.528 0 0 1 2.521 2.523A2.528 2.528 0 0 1 13.042 24a2.528 2.528 0 0 1-2.52-2.522v-2.521h2.52zM13.042 17.688a2.528 2.528 0 0 1-2.52-2.521 2.527 2.527 0 0 1 2.52-2.521 2.527 2.527 0 0 1 2.521 2.521v6.313a2.528 2.528 0 0 1-2.521 2.522v-6.313z"/>
      </svg>
    );
  }

  if (name === 'clock') {
    return (
      <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" style={{ filter: 'brightness(0) opacity(0.7)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  const rawSrc = name.startsWith('/') ? name : (iconMap[name] || '/icons/file-02.svg');
  const baseUrl = import.meta.env.BASE_URL || '/';
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const src = rawSrc.startsWith('/') ? `${normalizedBaseUrl}${rawSrc.slice(1)}` : rawSrc;
  const shouldApplyFilter = !rawSrc.startsWith('/icons-black/');

  return (
    <img
      src={src}
      alt={name}
      className={`w-5 h-5 ${className}`}
      style={style || (shouldApplyFilter ? { filter: 'brightness(0) opacity(0.7)' } : undefined)}
    />
  );
};

// Toggle Switch Component
const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        enabled ? 'bg-primary' : 'bg-muted'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

// Dropdown Component
const Dropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-[0.875rem] font-medium text-foreground bg-card border border-border rounded-xl hover:border-primary transition-colors"
      >
        <span>{options.find(opt => opt.value === value)?.label || value}</span>
        <Icon name="chevron-down" className="w-4 h-4 ml-2" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-[0.875rem] hover:bg-muted transition-colors ${
                  value === option.value ? 'bg-muted text-primary' : 'text-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  sms: boolean;
  slack: boolean;
  frequency: string;
}

const Notifications: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'api-alerts',
      title: 'API Alerts',
      description: 'Critical API errors and downtime',
      email: true,
      sms: true,
      slack: true,
      frequency: 'immediate',
    },
    {
      id: 'usage-reports',
      title: 'Usage Reports',
      description: 'Daily/weekly usage summaries',
      email: true,
      sms: false,
      slack: true,
      frequency: 'daily',
    },
    {
      id: 'security-alerts',
      title: 'Security Alerts',
      description: 'Suspicious activity and access attempts',
      email: true,
      sms: true,
      slack: true,
      frequency: 'immediate',
    },
    {
      id: 'billing-notifications',
      title: 'Billing Notifications',
      description: 'Invoices and payment reminders',
      email: true,
      sms: false,
      slack: false,
      frequency: 'weekly',
    },
    {
      id: 'product-updates',
      title: 'Product Updates',
      description: 'New features and API changes',
      email: true,
      sms: false,
      slack: true,
      frequency: 'weekly',
    },
  ]);

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Summary' },
    { value: 'monthly', label: 'Monthly Report' },
  ];

  const updateSetting = (id: string, field: keyof NotificationSetting, value: boolean | string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, [field]: value } : setting
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Icon name="bell" className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Notification Preferences</h1>
        </div>
        <p className="text-[0.9375rem] text-muted-foreground ml-[52px]">
          Configure how and when you receive alerts and updates
        </p>
      </div>

      {/* Notification Channels Header */}
      <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border">
        <div className="grid grid-cols-5 gap-4 items-center">
          <div className="col-span-2">
            <span className="text-[0.875rem] font-medium text-muted-foreground">Notification Type</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Icon name="mail" className="w-4 h-4" />
            <span className="text-[0.875rem] font-medium text-muted-foreground">Email</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Icon name="phone" className="w-4 h-4" />
            <span className="text-[0.875rem] font-medium text-muted-foreground">SMS</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Icon name="slack" className="w-4 h-4" />
            <span className="text-[0.875rem] font-medium text-muted-foreground">Slack</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Icon name="clock" className="w-4 h-4" />
            <span className="text-[0.875rem] font-medium text-muted-foreground">Frequency</span>
          </div>
        </div>
      </div>

      {/* Notification Settings Grid */}
      <div className="space-y-4">
        {settings.map((setting) => (
          <motion.div
            key={setting.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-2xl p-6 lg:p-8 border border-border"
          >
            <div className="grid grid-cols-5 gap-4 items-center">
              {/* Notification Type */}
              <div className="col-span-2">
                <h3 className="text-[1rem] font-semibold text-foreground mb-1">
                  {setting.title}
                </h3>
                <p className="text-[0.875rem] text-muted-foreground">
                  {setting.description}
                </p>
              </div>

              {/* Email Toggle */}
              <div className="flex items-center justify-center">
                <ToggleSwitch
                  enabled={setting.email}
                  onChange={(enabled) => updateSetting(setting.id, 'email', enabled)}
                />
              </div>

              {/* SMS Toggle */}
              <div className="flex items-center justify-center">
                <ToggleSwitch
                  enabled={setting.sms}
                  onChange={(enabled) => updateSetting(setting.id, 'sms', enabled)}
                />
              </div>

              {/* Slack Toggle */}
              <div className="flex items-center justify-center">
                <ToggleSwitch
                  enabled={setting.slack}
                  onChange={(enabled) => updateSetting(setting.id, 'slack', enabled)}
                />
              </div>

              {/* Frequency Dropdown */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-[180px]">
                  <Dropdown
                    value={setting.frequency}
                    onChange={(value) => updateSetting(setting.id, 'frequency', value)}
                    options={frequencyOptions}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Integration Status */}
      <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border">
        <h2 className="text-[1.125rem] font-semibold text-foreground mb-4">Integration Status</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
              <Icon name="check" className="w-3 h-3" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <span className="text-[0.9375rem] text-foreground">Email verified</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
              <Icon name="check" className="w-3 h-3" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <span className="text-[0.9375rem] text-foreground">SMS enabled</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
              <Icon name="check" className="w-3 h-3" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <span className="text-[0.9375rem] text-foreground">Slack connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;

