import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { ProductReadinessItem } from '@/data/creditSignalsData';
import { DemoMetaBadge } from '@/components/shared/DemoMetaBadge';
import { ReadinessBadge } from './ReadinessBadge';

const DATA_SOURCES = [
  'D&B Commercial',
  'Experian BizID',
  'Banking Data Feed',
  'Secretary of State',
];

interface ProductReadinessTableProps {
  products: ProductReadinessItem[];
  className?: string;
}

export const ProductReadinessTable: React.FC<ProductReadinessTableProps> = ({
  products,
  className,
}) => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  return (
    <div className={cn('bg-card rounded-xl border border-border', className)}>
      <div className="flex items-center justify-between p-5 pb-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Product Readiness Indicators</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Based on observed signal patterns — not a lending determination
          </p>
        </div>
        <DemoMetaBadge lastUpdated="2026-01-28T10:00:00Z" dataSources={DATA_SOURCES} />
      </div>
      <div className="p-5">
        <div className="space-y-1">
          <div className="grid grid-cols-12 gap-4 px-5 py-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Readiness</div>
            <div className="col-span-3">Key Qualifying Signal</div>
            <div className="col-span-3">Key Concern</div>
          </div>
          {products.map((item) => (
            <div key={item.productId}>
              <button
                onClick={() =>
                  setExpandedProduct(
                    expandedProduct === item.productId ? null : item.productId
                  )
                }
                className="w-full grid grid-cols-12 gap-4 items-center px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <div className="col-span-4 flex items-center gap-2">
                  {expandedProduct === item.productId ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.productName}</div>
                    <div className="text-[10px] text-muted-foreground">{item.facilitySize}</div>
                  </div>
                </div>
                <div className="col-span-2">
                  <ReadinessBadge readiness={item.readiness} />
                </div>
                <div className="col-span-3 text-xs text-foreground/80 truncate">
                  {item.qualifyingSignal}
                </div>
                <div className="col-span-3 text-xs text-foreground/80 truncate">
                  {item.concern}
                </div>
              </button>
              {expandedProduct === item.productId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="ml-9 px-3 pb-3"
                >
                  <div className="bg-muted/50 rounded-lg p-3 text-xs space-y-1.5">
                    <div>
                      <span className="text-muted-foreground">Facility: </span>
                      <span className="text-foreground">{item.facilitySize}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Qualifying Signal: </span>
                      <span className="text-foreground">{item.qualifyingSignal}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Concern: </span>
                      <span className="text-foreground">{item.concern}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-1">
                      <Info className="h-2.5 w-2.5" />
                      <span>
                        This indicator is for informational purposes only and does not constitute a
                        lending decision
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReadinessTable;
