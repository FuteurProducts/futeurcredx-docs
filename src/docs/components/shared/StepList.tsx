import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Step {
  step: number;
  title: string;
  description: string;
  children?: ReactNode;
}

interface StepListProps {
  steps: Step[];
}

function StepItem({
  step,
  isLast,
}: {
  step: Step;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-5">
      {/* Vertical connector line */}
      {!isLast && (
        <div
          className="absolute left-5 top-12 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-blue-500/40 to-transparent"
          aria-hidden="true"
        />
      )}

      {/* Numbered circle */}
      <div className="flex-shrink-0">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            'bg-gradient-to-br from-blue-500 to-indigo-600',
            'text-sm font-bold text-white shadow-lg shadow-blue-500/20',
          )}
          aria-hidden="true"
        >
          {step.step}
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-8">
        <h3 className="mb-1.5 text-lg font-semibold text-white">
          {step.title}
        </h3>
        <p className="mb-4 leading-relaxed text-gray-400">
          {step.description}
        </p>
        {step.children && (
          <div className="mt-3">{step.children}</div>
        )}
      </div>
    </div>
  );
}

export function StepList({ steps }: StepListProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <StepItem
          key={step.step}
          step={step}
          isLast={index === steps.length - 1}
        />
      ))}
    </div>
  );
}
