import { useState } from 'react';

import {
  Calendar,
  ChevronDown,
  GitBranch,
  Minus,
  Plus,
  Tag,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { releases } from '@/docs/data/changelog';

type VersionType = 'major' | 'minor' | 'patch';

function getVersionType(version: string): VersionType {
  const parts = version.replace(/^v/, '').split('.');
  const minor = parseInt(parts[1] ?? '0', 10);
  const patch = parseInt(parts[2] ?? '0', 10);
  if (minor === 0 && patch === 0) return 'major';
  if (patch === 0) return 'minor';
  return 'patch';
}

function getVersionBadgeStyles(type: VersionType): string {
  switch (type) {
    case 'major':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'minor':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'patch':
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
}

function getVersionLabel(type: VersionType): string {
  switch (type) {
    case 'major':
      return 'Major';
    case 'minor':
      return 'Minor';
    case 'patch':
      return 'Patch';
  }
}

function getChangeTypeStyles(type: string): { icon: typeof Plus; color: string } {
  switch (type) {
    case 'added':
      return { icon: Plus, color: 'text-emerald-400' };
    case 'changed':
      return { icon: GitBranch, color: 'text-blue-400' };
    case 'fixed':
      return { icon: Tag, color: 'text-amber-400' };
    case 'removed':
      return { icon: Minus, color: 'text-red-400' };
    default:
      return { icon: Tag, color: 'text-gray-400' };
  }
}

export default function Changelog() {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    () => new Set(releases.length > 0 ? [releases[0].version] : []),
  );

  function toggleVersion(version: string) {
    setExpandedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(version)) {
        next.delete(version);
      } else {
        next.add(version);
      }
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Changelog
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          A chronological record of all API changes, new features, and
          improvements.
        </p>
      </div>

      {/* Version Legend */}
      <div className="flex flex-wrap gap-3">
        {(['major', 'minor', 'patch'] as VersionType[]).map((type) => (
          <div
            key={type}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
              getVersionBadgeStyles(type),
            )}
          >
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                type === 'major' ? 'bg-red-400' : type === 'minor' ? 'bg-blue-400' : 'bg-gray-400',
              )}
            />
            {getVersionLabel(type)}
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative space-y-6">
        {/* Vertical line */}
        <div
          className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-gray-700 via-gray-800 to-transparent"
          aria-hidden="true"
        />

        {releases.map((entry) => {
          const versionType = getVersionType(entry.version);
          const isExpanded = expandedVersions.has(entry.version);

          return (
            <div key={entry.version} className="relative flex gap-5">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border',
                    versionType === 'major'
                      ? 'border-red-500/30 bg-red-500/10'
                      : versionType === 'minor'
                        ? 'border-blue-500/30 bg-blue-500/10'
                        : 'border-gray-700 bg-gray-800/50',
                  )}
                >
                  <Tag
                    className={cn(
                      'h-4 w-4',
                      versionType === 'major'
                        ? 'text-red-400'
                        : versionType === 'minor'
                          ? 'text-blue-400'
                          : 'text-gray-500',
                    )}
                  />
                </div>
              </div>

              {/* Content */}
              <div
                className={cn(
                  'min-w-0 flex-1 overflow-hidden rounded-xl border transition-all duration-200',
                  isExpanded
                    ? 'border-gray-700 bg-gray-900/50'
                    : 'border-gray-800 bg-gray-900/30',
                )}
              >
                {/* Header */}
                <button
                  type="button"
                  onClick={() => toggleVersion(entry.version)}
                  className={cn(
                    'flex w-full items-center gap-3 px-5 py-4 text-left',
                    'transition-all duration-200 hover:bg-gray-800/30',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
                  )}
                  aria-expanded={isExpanded}
                >
                  {/* Version Badge */}
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold',
                      getVersionBadgeStyles(versionType),
                    )}
                  >
                    {entry.version}
                  </span>

                  {/* Date */}
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {entry.date}
                  </span>

                  {/* Title */}
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                    {entry.title}
                  </span>

                  {/* Chevron */}
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 flex-shrink-0 text-gray-500 transition-transform duration-200',
                      isExpanded && 'rotate-180',
                    )}
                  />
                </button>

                {/* Expanded Changes */}
                {isExpanded && (
                  <div className="border-t border-gray-800/50 px-5 py-4">
                    {entry.entries.map((changeEntry, idx) => {
                      const { icon: ChangeIcon, color } = getChangeTypeStyles(
                        changeEntry.type,
                      );

                      return (
                        <div key={`${changeEntry.type}-${idx}`} className="mb-4 last:mb-0">
                          <h4
                            className={cn(
                              'mb-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider',
                              color,
                            )}
                          >
                            <ChangeIcon className="h-3.5 w-3.5" />
                            {changeEntry.type}
                          </h4>
                          <p className="pl-5 text-sm leading-relaxed text-gray-400">
                            <span className="mr-2 text-gray-600">--</span>
                            {changeEntry.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {releases.length === 0 && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-12 text-center">
          <Tag className="mx-auto mb-4 h-8 w-8 text-gray-600" />
          <p className="text-gray-400">No changelog entries yet.</p>
        </div>
      )}
    </div>
  );
}
