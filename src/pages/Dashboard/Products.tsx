import React, { useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import {
  ProductsGlobalControls,
  ProductShelfGrid,
  PortfolioPenetrationDashboard,
  PreQualificationPipeline,
  ProductPerformanceDashboard,
  EligibilityMatrix,
  mockBankProducts,
} from '@/components/enterprise/products';
import type { ProductsFilters } from '@/components/enterprise/products/types';
import { BankDisclaimer } from '@/components/shared/BankDisclaimer';

// ============================================
// MAIN COMPONENT
// ============================================

const Products: React.FC = () => {
  const { toast } = useToast();

  const [filters, setFilters] = useState<ProductsFilters>({
    viewMode: 'shelf',
    productFamily: 'All',
    segment: 'all',
    status: 'All',
    timeWindow: '30d',
  });

  const handleFiltersChange = (newFilters: ProductsFilters) => {
    if (newFilters.viewMode !== filters.viewMode) {
      toast({
        title: 'View changed',
        description: `Switched to ${newFilters.viewMode} view.`,
      });
    }
    setFilters(newFilters);
  };

  // ============================================
  // RENDER MODES
  // ============================================

  const renderActiveMode = () => {
    switch (filters.viewMode) {
      case 'shelf':
        return <ProductShelfGrid products={mockBankProducts} filters={filters} />;
      case 'penetration':
        return <PortfolioPenetrationDashboard filters={filters} />;
      case 'prequalification':
        return <PreQualificationPipeline filters={filters} />;
      case 'performance':
        return <ProductPerformanceDashboard filters={filters} />;
      case 'eligibility':
        return <EligibilityMatrix filters={filters} />;
      default:
        return <ProductShelfGrid products={mockBankProducts} filters={filters} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/50 p-6 space-y-6">
      <BankDisclaimer compact />

      {/* Global Controls */}
      <ProductsGlobalControls
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Mode Content */}
      {renderActiveMode()}

      {/* Data Lineage Footer */}
      <div className="mt-8 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Data Sources: Product Management, LUMIQ AI Signal Engine, Underwriting, CRM
          </span>
          <span>|</span>
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
          <span>|</span>
          <span>Products: {mockBankProducts.length} active</span>
        </div>
      </div>
    </div>
  );
};

export default Products;
