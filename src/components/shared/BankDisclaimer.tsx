import { ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DISCLAIMER_TEXT, DISCLAIMER_SHORT } from '@/constants/bankTerminology';

interface BankDisclaimerProps {
  compact?: boolean;
  className?: string;
}

export function BankDisclaimer({ compact = false, className }: BankDisclaimerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg border text-xs',
        compact
          ? 'px-3 py-1.5 bg-muted/50 border-border text-muted-foreground'
          : 'px-4 py-2.5 bg-amber-50/50 border-amber-200/60 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800/30 dark:text-amber-200',
        className,
      )}
    >
      <ShieldAlert className={cn('flex-shrink-0 mt-0.5', compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      <span className="leading-relaxed">
        {compact ? DISCLAIMER_SHORT : DISCLAIMER_TEXT}
      </span>
    </div>
  );
}

export default BankDisclaimer;
