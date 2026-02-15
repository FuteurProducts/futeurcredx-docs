import { cn } from '@/lib/utils';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface MethodBadgeProps {
  method: HttpMethod;
  className?: string;
}

const methodColors: Record<HttpMethod, { bg: string; text: string }> = {
  GET: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  POST: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  DELETE: { bg: 'bg-red-500/15', text: 'text-red-400' },
  PUT: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  PATCH: { bg: 'bg-purple-500/15', text: 'text-purple-400' },
};

export function MethodBadge({ method, className }: MethodBadgeProps) {
  const colors = methodColors[method];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5',
        'font-mono text-xs font-bold uppercase',
        colors.bg,
        colors.text,
        className,
      )}
    >
      {method}
    </span>
  );
}
