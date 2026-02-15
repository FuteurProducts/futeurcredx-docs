import { cn } from '@/lib/utils';

import { useDocsContext } from '@/docs/contexts/DocsContext';

interface BankSelectorProps {
  className?: string;
}

const BANKS = [
  { id: 'chase', label: 'Chase', color: 'bg-blue-500' },
  { id: 'wellsfargo', label: 'Wells Fargo', color: 'bg-red-500' },
  { id: 'santander', label: 'Santander', color: 'bg-red-600' },
  { id: 'citi', label: 'Citi', color: 'bg-blue-600' },
] as const;

export function BankSelector({ className }: BankSelectorProps) {
  const { selectedBank, setSelectedBank } = useDocsContext();

  return (
    <div className={cn('relative', className)}>
      <select
        value={selectedBank}
        onChange={(e) => setSelectedBank(e.target.value)}
        className={cn(
          'w-full appearance-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5',
          'pr-10 text-sm text-gray-200',
          'transition-all duration-200',
          'hover:border-gray-600',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
        )}
        aria-label="Select sandbox bank"
      >
        {BANKS.map((bank) => (
          <option key={bank.id} value={bank.id}>
            {bank.label}
          </option>
        ))}
      </select>

      {/* Custom indicator dot */}
      <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
        <span
          className={cn(
            'h-2 w-2 rounded-full',
            BANKS.find((b) => b.id === selectedBank)?.color ?? 'bg-gray-500',
          )}
          aria-hidden="true"
        />
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
