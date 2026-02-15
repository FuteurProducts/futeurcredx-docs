import type { ReactNode } from 'react';

import { AlertTriangle, Info, Lightbulb, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

type CalloutType = 'info' | 'warning' | 'danger' | 'tip';

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
}

const calloutConfig: Record<
  CalloutType,
  {
    icon: typeof Info;
    borderColor: string;
    bgColor: string;
    iconColor: string;
    titleColor: string;
  }
> = {
  info: {
    icon: Info,
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-500/5',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'border-l-amber-500',
    bgColor: 'bg-amber-500/5',
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-400',
  },
  danger: {
    icon: XCircle,
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-500/5',
    iconColor: 'text-red-500',
    titleColor: 'text-red-400',
  },
  tip: {
    icon: Lightbulb,
    borderColor: 'border-l-emerald-500',
    bgColor: 'bg-emerald-500/5',
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-400',
  },
};

export function Callout({ type, title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-r-xl border-l-4 p-4',
        config.borderColor,
        config.bgColor,
      )}
      role="note"
    >
      <div className="flex gap-3">
        <Icon
          className={cn('mt-0.5 h-5 w-5 flex-shrink-0', config.iconColor)}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          {title && (
            <p className={cn('mb-1 text-sm font-semibold', config.titleColor)}>
              {title}
            </p>
          )}
          <div className="text-sm leading-relaxed text-gray-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
