import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface SortIndicatorProps {
  field: string;
  currentSort: string | null;
  direction: 'asc' | 'desc';
}

export function SortIndicator({ field, currentSort, direction }: SortIndicatorProps) {
  if (currentSort !== field) {
    return <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/50 ml-1 inline" />;
  }
  return direction === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-foreground ml-1 inline" />
    : <ChevronDown className="w-3.5 h-3.5 text-foreground ml-1 inline" />;
}
