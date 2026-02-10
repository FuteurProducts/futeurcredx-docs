// Alert Thresholds Panel - Risk alert configuration

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Bell, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AlertThreshold } from '../types';

interface AlertThresholdsPanelProps {
  thresholds: AlertThreshold[];
  onSave: (thresholds: AlertThreshold[]) => void;
}

export const AlertThresholdsPanel: React.FC<AlertThresholdsPanelProps> = ({
  thresholds: initialThresholds,
  onSave,
}) => {
  const [thresholds, setThresholds] = useState(initialThresholds);
  const [hasChanges, setHasChanges] = useState(false);

  const updateThreshold = (id: string, value: number) => {
    setThresholds((prev) =>
      prev.map((t) => (t.id === id ? { ...t, value } : t))
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(thresholds);
    setHasChanges(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Risk Alert Thresholds</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure when alerts are triggered for portfolio monitoring
          </p>
        </div>
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-info/10 border border-info/20 rounded-xl">
        <Info className="h-5 w-5 text-info mt-0.5" />
        <div className="text-sm text-info">
          <p className="font-medium">How thresholds work</p>
          <p className="text-info/80 mt-1">
            When a metric crosses the threshold, an alert is generated in the Early Warning System
            and optionally sent via configured notification channels.
          </p>
        </div>
      </div>

      {/* Threshold Sliders */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        {thresholds.map((threshold) => {
          const percentage = ((threshold.value - threshold.min) / (threshold.max - threshold.min)) * 100;

          return (
            <div key={threshold.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{threshold.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{threshold.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-semibold text-foreground">{threshold.value}</span>
                  <span className="text-sm text-muted-foreground ml-1">{threshold.unit}</span>
                </div>
              </div>

              <div className="relative">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={threshold.min}
                  max={threshold.max}
                  value={threshold.value}
                  onChange={(e) => updateThreshold(threshold.id, Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{threshold.min}{threshold.unit}</span>
                <span>{threshold.max}{threshold.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AlertThresholdsPanel;
