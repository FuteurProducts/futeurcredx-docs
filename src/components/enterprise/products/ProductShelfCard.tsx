// Product Shelf Card - Individual bank product display
import React from 'react';
import { motion } from 'framer-motion';
import type { BankProduct } from './types';

interface ProductShelfCardProps {
  product: BankProduct;
}

const statusColors: Record<string, string> = {
  Active: 'bg-success/10 text-success border-success/30',
  Pilot: 'bg-warning/10 text-warning border-warning/30',
  Sunset: 'bg-destructive/10 text-destructive border-destructive/30',
};

const tierColors: Record<string, string> = {
  'Tier 1': 'bg-primary/10 text-primary',
  'Tier 2': 'bg-info/10 text-info',
  'Tier 3': 'bg-muted text-muted-foreground',
};

export const ProductShelfCard: React.FC<ProductShelfCardProps> = ({ product }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:border-primary/30 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground leading-tight pr-2">{product.name}</h4>
        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusColors[product.status]}`}>
          {product.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2rem]">{product.description}</p>

      {/* Terms Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2 bg-muted rounded-lg">
          <div className="text-[10px] text-muted-foreground font-medium">Rate</div>
          <div className="text-xs font-semibold text-foreground truncate">{product.terms.rateRange}</div>
        </div>
        <div className="p-2 bg-muted rounded-lg">
          <div className="text-[10px] text-muted-foreground font-medium">Term</div>
          <div className="text-xs font-semibold text-foreground truncate">{product.terms.termRange}</div>
        </div>
        <div className="p-2 bg-muted rounded-lg">
          <div className="text-[10px] text-muted-foreground font-medium">Amount</div>
          <div className="text-xs font-semibold text-foreground truncate">{product.terms.amountRange}</div>
        </div>
        <div className="p-2 bg-muted rounded-lg">
          <div className="text-[10px] text-muted-foreground font-medium">Collateral</div>
          <div className="text-xs font-semibold text-foreground truncate">{product.terms.collateral}</div>
        </div>
      </div>

      {/* Footer: Tier + Segments */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tierColors[product.eligibilityTier]}`}>
          {product.eligibilityTier}
        </span>
        {product.targetSegments.slice(0, 2).map((seg) => (
          <span key={seg} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
            {seg}
          </span>
        ))}
        {product.targetSegments.length > 2 && (
          <span className="text-[10px] text-muted-foreground">+{product.targetSegments.length - 2}</span>
        )}
      </div>
    </motion.div>
  );
};

export default ProductShelfCard;
