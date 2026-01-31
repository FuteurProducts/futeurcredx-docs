// Product Penetration Table - Wallet share and cross-sell opportunities
import React from 'react';
import { motion } from 'framer-motion';
import { Info, ArrowRight, TrendingUp } from 'lucide-react';
import type { ProductPenetration } from './types';

interface ProductPenetrationTableProps {
  data: ProductPenetration[];
  onViewOpportunity?: (product: string) => void;
}

export const ProductPenetrationTable: React.FC<ProductPenetrationTableProps> = ({ data, onViewOpportunity }) => {
  const totalOpportunity = data.reduce((sum, p) => sum + p.opportunity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-border p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Product Penetration & Wallet Share</h3>
          <div className="relative group">
            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-foreground text-background text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Current vs eligible product adoption
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-lg">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-sm font-semibold text-success">{totalOpportunity}% total opportunity</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Product</th>
              <th className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Held</th>
              <th className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Eligible</th>
              <th className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Opportunity</th>
              <th className="py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Gap</th>
              <th className="py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <motion.tr
                key={product.product}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="py-4">
                  <span className="font-semibold text-foreground">{product.product}</span>
                </td>
                <td className="py-4 text-center">
                  <span className="inline-flex items-center justify-center w-12 h-8 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
                    {product.held}%
                  </span>
                </td>
                <td className="py-4 text-center">
                  <span className="inline-flex items-center justify-center w-12 h-8 bg-muted text-foreground rounded-lg font-semibold text-sm">
                    {product.eligible}%
                  </span>
                </td>
                <td className="py-4 text-center">
                  <span className="inline-flex items-center justify-center w-12 h-8 bg-success/10 text-success rounded-lg font-semibold text-sm">
                    {product.opportunity}%
                  </span>
                </td>
                <td className="py-4">
                  <div className="w-full max-w-[120px]">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${product.eligible}%`,
                          background: `linear-gradient(to right, hsl(var(--primary)) ${(product.held / product.eligible) * 100}%, hsl(var(--muted)) ${(product.held / product.eligible) * 100}%)`,
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <button
                    onClick={() => onViewOpportunity?.(product.product)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    View
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductPenetrationTable;
