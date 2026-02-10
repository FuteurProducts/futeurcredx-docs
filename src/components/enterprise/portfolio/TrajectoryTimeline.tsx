import React from 'react';

import { cn } from '@/lib/utils';

import type { TrajectoryEvent } from '@/data/creditSignalsData';

const TrajectoryRow: React.FC<{ event: TrajectoryEvent }> = ({ event }) => {
  const dotColor =
    event.sentiment === 'positive'
      ? 'bg-emerald-500'
      : event.sentiment === 'negative'
        ? 'bg-red-500'
        : 'bg-amber-500';

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <div className="flex flex-col items-center mt-1">
        <div className={cn('w-2.5 h-2.5 rounded-full', dotColor)} />
        <div className="w-px flex-1 bg-border" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm text-foreground">{event.description}</p>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {new Date(event.date).toLocaleDateString()}
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{event.source}</div>
      </div>
    </div>
  );
};

export interface TrajectoryTimelineProps {
  events: TrajectoryEvent[];
  className?: string;
}

export const TrajectoryTimeline: React.FC<TrajectoryTimelineProps> = ({ events, className }) => (
  <div className={cn('', className)}>
    {events.map((event) => (
      <TrajectoryRow key={event.id} event={event} />
    ))}
  </div>
);

export default TrajectoryTimeline;
