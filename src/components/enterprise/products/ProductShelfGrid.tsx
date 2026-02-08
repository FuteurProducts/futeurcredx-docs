// Product Shelf Grid - View 1: Products grouped by family
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { PortfolioKPITiles } from '../analytics/PortfolioKPITiles';
import { ProductShelfCard } from './ProductShelfCard';
import { mockShelfKPIs } from './mockData';
import type { BankProduct, ProductFamily, ProductsFilters } from './types';

interface ProductShelfGridProps {
  products: BankProduct[];
  filters: ProductsFilters;
}

const familyOrder: ProductFamily[] = [
  'Credit Cards',
  'Lines of Credit',
  'Term Loans',
  'SBA Programs',
  'Equipment Finance',
  'Commercial Auto',
  'Commercial Real Estate',
  'Deposits',
  'Treasury',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const ProductShelfGrid: React.FC<ProductShelfGridProps> = ({ products, filters }) => {
  const [collapsedFamilies, setCollapsedFamilies] = useState<Set<string>>(new Set());

  const toggleFamily = (family: string) => {
    setCollapsedFamilies((prev) => {
      const next = new Set(prev);
      if (next.has(family)) {
        next.delete(family);
      } else {
        next.add(family);
      }
      return next;
    });
  };

  // Filter products
  const filtered = products.filter((p) => {
    if (filters.productFamily !== 'All' && p.family !== filters.productFamily) return false;
    if (filters.status !== 'All' && p.status !== filters.status) return false;
    return true;
  });

  // Group by family
  const grouped = familyOrder
    .map((family) => ({
      family,
      products: filtered.filter((p) => p.family === family),
    }))
    .filter((g) => g.products.length > 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* KPI Row */}
      <motion.div variants={itemVariants}>
        <PortfolioKPITiles kpis={mockShelfKPIs} />
      </motion.div>

      {/* Grouped Sections */}
      {grouped.map(({ family, products: familyProducts }) => {
        const isCollapsed = collapsedFamilies.has(family);
        return (
          <motion.div key={family} variants={itemVariants}>
            {/* Family Header */}
            <button
              onClick={() => toggleFamily(family)}
              className="flex items-center gap-2 mb-4 group/header"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
              <h3 className="text-base font-semibold text-foreground">{family}</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {familyProducts.length}
              </span>
            </button>

            {/* Cards Grid */}
            {!isCollapsed && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {familyProducts.map((product) => (
                  <ProductShelfCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </motion.div>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No products match the current filters.
        </div>
      )}
    </motion.div>
  );
};

export default ProductShelfGrid;
