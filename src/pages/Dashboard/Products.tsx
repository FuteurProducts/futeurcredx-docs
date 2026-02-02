import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/AuthContext';

// ============================================
// PRODUCTS DATA (like Chase Business Cards)
// ============================================

interface Product {
  id: string;
  title: string;
  description: string;
  color: 'yellow' | 'purple' | 'green' | 'blue';
  icon: 'chart' | 'bell' | 'shield' | 'zap';
  details: {
    features: string[];
    pricing: string;
    apiEndpoint: string;
    rateLimit: string;
    responseTime: string;
  };
}

const products: Product[] = [
  {
    id: "credit-score",
    title: "Credit Score API",
    description: "Get real-time credit scores for individuals and businesses with comprehensive risk assessment.",
    color: "yellow",
    icon: "chart",
    details: {
      features: [
        "Real-time credit score retrieval",
        "Risk level assessment (Low/Medium/High)",
        "Historical score tracking",
        "Multi-bureau support (Experian, TransUnion, Equifax)"
      ],
      pricing: "Starting at $0.10/call",
      apiEndpoint: "/v1/credit/score",
      rateLimit: "1000 calls/minute",
      responseTime: "< 200ms"
    }
  },
  {
    id: "credit-report",
    title: "Credit Report API",
    description: "Access detailed credit reports including payment history, accounts, and public records.",
    color: "purple",
    icon: "bell",
    details: {
      features: [
        "Complete credit history",
        "Payment behavior analysis",
        "Account summaries",
        "Public records and collections"
      ],
      pricing: "Starting at $0.50/call",
      apiEndpoint: "/v1/credit/report",
      rateLimit: "500 calls/minute",
      responseTime: "< 500ms"
    }
  },
  {
    id: "lumiq-experian",
    title: "Lumiq Experian",
    description: "Enterprise-grade Experian data integration with advanced scoring models.",
    color: "green",
    icon: "shield",
    details: {
      features: [
        "Experian business data",
        "FICO score integration",
        "Fraud detection signals",
        "Identity verification"
      ],
      pricing: "Enterprise pricing",
      apiEndpoint: "/v1/experian/ext/score",
      rateLimit: "2000 calls/minute",
      responseTime: "< 300ms"
    }
  },
  {
    id: "credit-journey",
    title: "Credit Journey",
    description: "Track credit improvement progress with personalized recommendations and insights.",
    color: "blue",
    icon: "zap",
    details: {
      features: [
        "Score progress tracking",
        "Personalized improvement tips",
        "Goal setting and milestones",
        "Monthly credit monitoring"
      ],
      pricing: "Starting at $0.25/call",
      apiEndpoint: "/v1/credit/journey",
      rateLimit: "1000 calls/minute",
      responseTime: "< 250ms"
    }
  },
];

// Color classes for cards — semantic tokens for dark mode + white-label theming
const colorClasses = {
  yellow: {
    bg: "bg-warning/10",
    border: "border-warning/30",
    iconBg: "bg-warning",
  },
  purple: {
    bg: "bg-purple-500/10 dark:bg-purple-400/10",
    border: "border-purple-300/50 dark:border-purple-500/30",
    iconBg: "bg-purple-500 dark:bg-purple-400",
  },
  green: {
    bg: "bg-success/10",
    border: "border-success/30",
    iconBg: "bg-success",
  },
  blue: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    iconBg: "bg-primary",
  },
};

// Icons
const ProductIcon = ({ name, className = "" }: { name: string; className?: string }) => {
  switch (name) {
    case 'chart':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'bell':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'zap':
      return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    default:
      return null;
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

const Products = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mode, setMode] = useState({ id: "0", title: "Expert mode" });
  const [searchQuery, setSearchQuery] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const modes = [
    { id: "0", title: "Expert mode" },
    { id: "1", title: "Basic mode" },
  ];

  const firstName = user?.firstName || 'there';

  // Filter products based on search
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
      {/* LEFT SIDE - Main Content (like NeuraAI left panel) */}
      <div className="card flex-1 min-w-0 bg-card rounded-2xl p-4 sm:p-6">
        {/* Mode Selector */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <select
              value={mode.id}
              onChange={(e) => {
                const selected = modes.find(m => m.id === e.target.value);
                if (selected) setMode(selected);
              }}
              className="h-10 pl-4 pr-10 bg-card border border-border rounded-xl text-[0.9375rem] font-semibold text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {modes.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-[2.5rem] md:text-[1.75rem] font-semibold text-foreground leading-tight">
            Hello {firstName},
          </h1>
          <h2 className="text-[2.5rem] md:text-[1.75rem] font-semibold text-muted-foreground leading-tight">
            How can I help you today?
          </h2>
        </div>

        {/* Product Cards Carousel */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-none scroll-smooth"
        >
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`group flex flex-col shrink-0 w-64 p-6 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] hover:shadow-lg ${colorClasses[product.color].bg} ${colorClasses[product.color].border} ${
                selectedProduct?.id === product.id ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              <h3 className="text-[1.125rem] font-semibold text-foreground mb-2">
                {product.title}
              </h3>
              <p className="text-[0.875rem] text-muted-foreground mb-auto line-clamp-3 min-h-[4rem]">
                {product.description}
              </p>
              <div className={`mt-4 w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[product.color].iconBg} transition-transform group-hover:scale-110`}>
                <ProductIcon name={product.icon} className="w-5 h-5 text-white" />
              </div>
            </button>
          ))}
        </div>

        {/* Product Details (when selected) */}
        {selectedProduct && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[selectedProduct.color].iconBg}`}>
                  <ProductIcon name={selectedProduct.icon} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-[1.25rem] font-semibold text-foreground">{selectedProduct.title}</h3>
                  <p className="text-[0.875rem] text-muted-foreground">{selectedProduct.details.apiEndpoint}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted"
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
              <button
                onClick={() => navigate('/dashboard?tab=api-keys')}
                className="flex-1 h-11 bg-foreground text-white rounded-xl font-semibold text-[0.875rem] hover:bg-foreground/90 transition-colors"
              >
                Try in Sandbox
              </button>
              <button
                onClick={() => window.open('https://docs.lumiq.ai', '_blank')}
                className="flex-1 h-11 bg-muted text-foreground rounded-xl font-semibold text-[0.875rem] hover:bg-muted transition-colors"
              >
                View Documentation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE - Sidebar (like NeuraAI right panel) */}
      <div className="card-sidebar w-full mt-6 lg:mt-0 lg:w-[21.25rem] lg:shrink-0 bg-card rounded-2xl p-4 sm:p-6">
        {/* Search */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search for product"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-muted border border-border rounded-xl text-[0.9375rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Product List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`w-full flex items-start p-4 rounded-xl text-left transition-all hover:bg-muted ${
                selectedProduct?.id === product.id ? 'bg-muted border border-border' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[0.9375rem] font-semibold text-foreground mb-1">
                  {product.title}
                </div>
                <div className="text-[0.8125rem] text-muted-foreground line-clamp-2">
                  {product.description}
                </div>
              </div>
              {product.icon === 'chart' && (
                <img 
                  src="/credit-back.jpg" 
                  alt="" 
                  className="w-14 h-14 rounded-xl object-cover ml-3 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-6" />

        {/* Quick Links */}
        <div className="space-y-2">
          <button
            onClick={() => setSelectedProduct(products.find(p => p.id === 'credit-score') || null)}
            className="w-full flex items-center p-3 rounded-xl text-left hover:bg-muted transition-colors"
          >
            <div className="text-[0.9375rem] font-semibold text-foreground">
              What's the best API for credit scores?
            </div>
          </button>
          <button
            onClick={() => setSelectedProduct(products.find(p => p.id === 'credit-score') || null)}
            className="w-full flex items-center p-3 rounded-xl text-left hover:bg-muted transition-colors"
          >
            <div className="text-[0.9375rem] font-semibold text-foreground">
              How do I integrate the Credit API?
            </div>
          </button>
          <button
            onClick={() => setSelectedProduct(products.find(p => p.id === 'credit-report') || null)}
            className="w-full flex items-center p-3 rounded-xl text-left hover:bg-muted transition-colors"
          >
            <div className="text-[0.9375rem] font-semibold text-foreground">
              Can you explain the pricing model?
            </div>
          </button>
        </div>

        {/* Browse All Button */}
        <button
          onClick={() => {
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full h-12 mt-6 bg-foreground text-white rounded-xl font-semibold text-[0.9375rem] hover:bg-foreground/90 transition-colors"
        >
          Browse All Products
        </button>
      </div>
    </div>
  );
};

export default Products;

