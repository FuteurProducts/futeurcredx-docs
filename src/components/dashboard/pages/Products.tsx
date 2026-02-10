import { useState } from 'react';
import { useUser } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BankDisclaimer } from '@/components/shared/BankDisclaimer';
import { DataLineageFooter } from '@/components/shared/DataLineageFooter';
import {
  CATEGORIES,
  COLOR_CLASSES,
  PRODUCTS,
  ProductIcon,
  STATUS_CONFIG,
  type Product,
  type ProductCategory,
} from '@/data/productCatalogData';

const Products = () => {
  useUser();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search and category
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Count per category (ignoring search for the pill counts)
  const categoryCounts: Record<string, number> = { All: PRODUCTS.length };
  for (const p of PRODUCTS) {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
      {/* LEFT SIDE - Main Content */}
      <div className="card flex-1 min-w-0 bg-card rounded-2xl p-4 sm:p-6">
        <div className="mb-4"><BankDisclaimer compact /></div>
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            API Product Catalog
          </h1>
          <p className="text-[0.9375rem] text-muted-foreground mt-1">
            Browse and explore available APIs across credit, identity, banking, and compliance.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setActiveCategory(cat.value);
                if (selectedProduct && cat.value !== 'All' && selectedProduct.category !== cat.value) {
                  setSelectedProduct(null);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-[0.8125rem] font-semibold transition-all ${
                activeCategory === cat.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {cat.label}
              <span className="ml-1.5 opacity-70">{categoryCounts[cat.value] ?? 0}</span>
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const statusCfg = STATUS_CONFIG[product.status];
            return (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`group flex flex-col p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] hover:shadow-lg ${COLOR_CLASSES[product.color].bg} ${COLOR_CLASSES[product.color].border} ${
                  selectedProduct?.id === product.id ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${COLOR_CLASSES[product.color].iconBg} transition-transform group-hover:scale-110`}>
                    <ProductIcon name={product.icon} className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant={statusCfg.variant} className="text-[0.6875rem]">
                    {statusCfg.label}
                  </Badge>
                </div>
                <h3 className="text-[0.9375rem] font-semibold text-foreground mb-1.5">
                  {product.title}
                </h3>
                <p className="text-[0.8125rem] text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
                  {product.description}
                </p>
                <div className="mt-auto flex items-center gap-2">
                  <span className="text-[0.6875rem] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-[0.6875rem] text-muted-foreground">
                    {product.details.apiEndpoint}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-12 h-12 text-muted-foreground/40 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-[0.9375rem] font-medium text-muted-foreground">No products found</p>
            <p className="text-[0.8125rem] text-muted-foreground/70 mt-1">Try adjusting your search or category filter.</p>
          </div>
        )}

        {/* Product Details (when selected) */}
        {selectedProduct && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${COLOR_CLASSES[selectedProduct.color].iconBg}`}>
                  <ProductIcon name={selectedProduct.icon} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-foreground">{selectedProduct.title}</h3>
                    <Badge variant={STATUS_CONFIG[selectedProduct.status].variant} className="text-[0.6875rem]">
                      {STATUS_CONFIG[selectedProduct.status].label}
                    </Badge>
                  </div>
                  <p className="text-[0.875rem] text-muted-foreground">{selectedProduct.details.apiEndpoint}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-[0.9375rem] text-muted-foreground mb-6">{selectedProduct.description}</p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-1">
              {selectedProduct.details.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[0.8125rem] text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6 md:grid-cols-1">
              <div className="p-3 bg-muted rounded-xl">
                <div className="text-[0.6875rem] text-muted-foreground mb-1">Rate Limit</div>
                <div className="text-[0.875rem] font-semibold text-foreground">{selectedProduct.details.rateLimit}</div>
              </div>
              <div className="p-3 bg-muted rounded-xl">
                <div className="text-[0.6875rem] text-muted-foreground mb-1">Response</div>
                <div className="text-[0.875rem] font-semibold text-foreground">{selectedProduct.details.responseTime}</div>
              </div>
              <div className="p-3 bg-muted rounded-xl">
                <div className="text-[0.6875rem] text-muted-foreground mb-1">Pricing</div>
                <div className="text-[0.875rem] font-semibold text-foreground">{selectedProduct.details.pricing}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {selectedProduct.status === 'Coming Soon' ? (
                <Button
                  onClick={() => {
                    toast.success('You will be notified when this API launches.', {
                      description: `We'll send updates about ${selectedProduct.title}.`,
                    });
                  }}
                  className="flex-1 h-11 rounded-xl font-semibold text-[0.875rem]"
                >
                  Notify Me at Launch
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      toast.success('Opening sandbox environment...', {
                        description: 'You can test this API with sample data',
                      });
                    }}
                    className="flex-1 h-11 rounded-xl font-semibold text-[0.875rem]"
                  >
                    Try in Sandbox
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast.info('Opening documentation...', {
                        description: 'API reference and integration guides',
                      });
                    }}
                    className="flex-1 h-11 rounded-xl font-semibold text-[0.875rem]"
                  >
                    View Documentation
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE - Sidebar */}
      <div className="card-sidebar w-full mt-6 lg:mt-0 lg:w-[21.25rem] lg:shrink-0 bg-card rounded-2xl p-4 sm:p-6">
        {/* Search */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-muted border border-border rounded-xl text-[0.9375rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Product List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredProducts.map((product) => {
            const statusCfg = STATUS_CONFIG[product.status];
            return (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`w-full flex items-start p-4 rounded-xl text-left transition-all hover:bg-muted ${
                  selectedProduct?.id === product.id ? 'bg-muted border border-border' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${COLOR_CLASSES[product.color].iconBg} shrink-0 mr-3`}>
                  <ProductIcon name={product.icon} className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[0.875rem] font-semibold text-foreground truncate">
                      {product.title}
                    </span>
                    <Badge variant={statusCfg.variant} className="text-[0.5625rem] px-1.5 py-0 shrink-0">
                      {statusCfg.label}
                    </Badge>
                  </div>
                  <div className="text-[0.75rem] text-muted-foreground line-clamp-1">
                    {product.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-6" />

        {/* Status Legend */}
        <div className="mb-6">
          <h4 className="text-[0.8125rem] font-semibold text-foreground mb-3">Status Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Badge variant="success" className="text-[0.6875rem]">GA</Badge>
              <span className="text-[0.8125rem] text-muted-foreground">Generally Available -- production-ready</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Badge variant="warning" className="text-[0.6875rem]">Beta</Badge>
              <span className="text-[0.8125rem] text-muted-foreground">Public beta -- API may change</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Badge variant="secondary" className="text-[0.6875rem]">Coming Soon</Badge>
              <span className="text-[0.8125rem] text-muted-foreground">In development -- not yet available</span>
            </div>
          </div>
        </div>

        {/* Browse All Button */}
        <Button
          onClick={() => {
            setSearchQuery('');
            setActiveCategory('All');
            setSelectedProduct(null);
            toast.info('Showing all available products');
          }}
          className="w-full h-12 rounded-xl font-semibold text-[0.9375rem]"
        >
          Reset Filters
        </Button>
      </div>

      {/* Data Source Footer */}
      <div className="w-full mt-6 lg:mt-0">
        <DataLineageFooter
          meta={{
            lastUpdated: new Date().toISOString(),
            dataSources: ['LUMIQ AI Product Registry'],
          }}
        />
      </div>
    </div>
  );
};

export default Products;
