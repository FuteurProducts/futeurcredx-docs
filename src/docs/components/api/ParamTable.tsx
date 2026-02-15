import type { EndpointParam } from '@/docs/data/endpoints';

import { cn } from '@/lib/utils';

interface ParamTableProps {
  params: EndpointParam[];
  className?: string;
}

const locationColors: Record<string, { bg: string; text: string }> = {
  query: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  path: { bg: 'bg-purple-500/15', text: 'text-purple-400' },
  header: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  body: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
};

export function ParamTable({ params, className }: ParamTableProps) {
  if (params.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-gray-800',
        className,
      )}
    >
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="bg-gray-900">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              Required
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">
              Default
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {params.map((param, index) => {
            const locStyle = locationColors[param.type] ?? {
              bg: 'bg-gray-500/15',
              text: 'text-gray-400',
            };

            return (
              <tr
                key={param.name}
                className={cn(
                  'border-t border-gray-800/50 transition-colors duration-150 hover:bg-gray-800/30',
                  index === 0 && 'border-t-0',
                )}
              >
                <td className="px-4 py-3">
                  <code className="rounded bg-gray-800/50 px-1.5 py-0.5 font-mono text-xs text-gray-200">
                    {param.name}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                      locStyle.bg,
                      locStyle.text,
                    )}
                  >
                    {param.type}
                  </span>
                  {param.dataType && (
                    <span className="ml-1.5 text-xs text-gray-500">
                      {param.dataType}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {param.required ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      <span className="text-xs text-red-400">required</span>
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-400/70">optional</span>
                  )}
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {param.default !== undefined ? (
                    <code className="font-mono text-xs text-gray-400">
                      {String(param.default)}
                    </code>
                  ) : (
                    <span className="text-gray-600">&mdash;</span>
                  )}
                </td>
                <td className="max-w-xs px-4 py-3 text-sm text-gray-400">
                  {param.description}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
