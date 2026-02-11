import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Shield, UserCheck, AlertTriangle, CheckCircle } from 'lucide-react';

const BUSINESSES = [
  'Stellar Dynamics LLC', 'Metro Logistics Corp', 'Apex Construction Group',
  'Coastal Hospitality Group', 'GreenLeaf Organics LLC', 'Pacific Healthcare Partners',
  'TechVenture Solutions Inc', 'Urban Retail Partners LP', 'Precision Manufacturing Co',
  'Summit Marine Services'
];

const EVENT_TEMPLATES = [
  { type: 'score', icon: TrendingUp, color: 'text-info', template: (b: string) => `${b} scored: ${650 + Math.floor(Math.random() * 200)}` },
  { type: 'approve', icon: CheckCircle, color: 'text-success', template: (b: string) => `${b} — application approved` },
  { type: 'risk', icon: Shield, color: 'text-warning', template: (b: string) => `${b} — risk flag updated` },
  { type: 'kyc', icon: UserCheck, color: 'text-success', template: (b: string) => `${b} — KYC verification complete` },
  { type: 'alert', icon: AlertTriangle, color: 'text-warning', template: (b: string) => `${b} — EWS alert triggered` },
];

interface TickerEvent {
  id: number;
  text: string;
  icon: React.ElementType;
  color: string;
  time: string;
}

export function LiveActivityTicker() {
  const [events, setEvents] = useState<TickerEvent[]>([]);
  const [counter, setCounter] = useState(0);

  const generateEvent = useCallback(() => {
    const biz = BUSINESSES[Math.floor(Math.random() * BUSINESSES.length)];
    const tmpl = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
    const now = new Date();
    return {
      id: Date.now() + Math.random(),
      text: tmpl.template(biz),
      icon: tmpl.icon,
      color: tmpl.color,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  }, []);

  useEffect(() => {
    // Seed with 3 events
    setEvents([generateEvent(), generateEvent(), generateEvent()]);
  }, [generateEvent]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => [generateEvent(), ...prev.slice(0, 4)]);
      setCounter(c => c + 1);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [generateEvent]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
          </span>
          <span className="text-caption font-semibold text-foreground">Live Activity</span>
        </div>
        <span className="text-caption text-muted-foreground ml-auto">{35293 + counter} events today</span>
      </div>
      <div className="space-y-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {events.slice(0, 4).map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 py-1.5 text-caption"
            >
              <event.icon className={`w-3.5 h-3.5 ${event.color} shrink-0`} />
              <span className="text-foreground truncate flex-1">{event.text}</span>
              <span className="text-muted-foreground shrink-0">{event.time}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
