import { useCallback, useState } from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SchemaField {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  example?: unknown;
  children?: SchemaField[];
}

interface SchemaViewerProps {
  schema: SchemaField[];
  title?: string;
  className?: string;
}

const typeColors: Record<string, string> = {
  string: 'text-emerald-400 bg-emerald-500/15',
  number: 'text-amber-400 bg-amber-500/15',
  integer: 'text-amber-400 bg-amber-500/15',
  boolean: 'text-purple-400 bg-purple-500/15',
  object: 'text-blue-400 bg-blue-500/15',
  array: 'text-cyan-400 bg-cyan-500/15',
};

function getTypeColorClass(type: string): string {
  const lowerType = type.toLowerCase();
  for (const [key, value] of Object.entries(typeColors)) {
    if (lowerType.includes(key)) {
      return value;
    }
  }
  return 'text-gray-400 bg-gray-500/15';
}

interface FieldRowProps {
  field: SchemaField;
  depth: number;
}

function FieldRow({ field, depth }: FieldRowProps) {
  const hasChildren = field.children && field.children.length > 0;
  const [expanded, setExpanded] = useState(depth < 1);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const colorClass = getTypeColorClass(field.type);

  return (
    <div>
      <div
        className={cn(
          'group flex items-start gap-3 py-2.5 transition-colors duration-150',
          hasChildren && 'cursor-pointer hover:bg-gray-800/30',
          depth > 0 && 'border-l border-gray-800 pl-4',
        )}
        style={{ marginLeft: depth > 0 ? depth * 16 : 0 }}
        onClick={hasChildren ? toggleExpanded : undefined}
        onKeyDown={
          hasChildren
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleExpanded();
                }
              }
            : undefined
        }
        role={hasChildren ? 'button' : undefined}
        tabIndex={hasChildren ? 0 : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
      >
        {/* Chevron for expandable */}
        {hasChildren ? (
          <span className="mt-0.5 flex-shrink-0 text-gray-500" aria-hidden="true">
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        ) : (
          <span className="w-4 flex-shrink-0" aria-hidden="true" />
        )}

        {/* Field info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <code className="font-mono text-sm font-medium text-gray-200">
              {field.name}
            </code>
            <span
              className={cn(
                'inline-flex rounded-md px-1.5 py-0.5 text-xs font-medium',
                colorClass,
              )}
            >
              {field.type}
            </span>
            {field.required && (
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-xs text-red-400">required</span>
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-gray-400">
            {field.description}
          </p>
          {field.example !== undefined && (
            <div className="mt-1">
              <span className="text-xs text-gray-500">Example: </span>
              <code className="font-mono text-xs text-gray-400">
                {typeof field.example === 'string'
                  ? `"${field.example}"`
                  : JSON.stringify(field.example)}
              </code>
            </div>
          )}
        </div>
      </div>

      {/* Nested children */}
      {hasChildren && expanded && (
        <div>
          {field.children?.map((child) => (
            <FieldRow key={child.name} field={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SchemaViewer({ schema, title, className }: SchemaViewerProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-800 bg-gray-900/50',
        className,
      )}
    >
      {title && (
        <div className="border-b border-gray-800 px-4 py-3">
          <h4 className="text-sm font-semibold text-gray-200">{title}</h4>
        </div>
      )}
      <div className="p-4">
        {schema.map((field) => (
          <FieldRow key={field.name} field={field} depth={0} />
        ))}
      </div>
    </div>
  );
}
