import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import dashboardService from '@/services/dashboardService';
import { logger } from '@/utils/logger';

// ============================================
// TYPES
// ============================================

interface BusinessInsight {
  id: string;
  userId: string;
  name: string;
  city?: string;
  state?: string;
  legalStruct?: string;
  yearFounded?: number;
  empCount?: number;
  score?: {
    score: number;
    type: string;
  };
  recommendation?: {
    score: number;
    recommendations: Array<{
      cardName: string;
      fitScore: number;
      reason: string;
      suggestedUsage: string;
    }>;
  };
  applications?: Array<{
    id: string;
    cardName: string;
    status: string;
    createdAt: string;
  }>;
  createdAt: string;
}

interface ApplicationStats {
  totalBusinesses?: number;
  totalApplications?: number;
  businessesWithApplications?: number;
  applicationRate?: number;
}

// ============================================
// MINI CHART DATA GENERATOR
// ============================================

const generateMiniChartData = (score: number, positive: boolean) => {
  const baseValue = score || 50;
  return Array.from({ length: 12 }, (_, i) => ({
    name: String(i + 1),
    price: baseValue + (Math.random() * 30 - 15) + (positive ? i * 2 : -i * 2)
  }));
};

// ============================================
// COUNT UP ANIMATION HOOK
// ============================================

const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return count;
};

// ============================================
// CUSTOM DROPDOWN COMPONENT
// ============================================

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between gap-2 h-10 px-4 min-w-[160px]
          bg-card border border-border rounded-xl
          text-[0.875rem] font-medium text-foreground
          hover:bg-muted transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          ${isOpen ? 'ring-2 ring-primary/20 border-primary' : ''}
        `}
      >
        <span className={selectedOption?.value === 'all' ? 'text-muted-foreground' : 'text-foreground'}>
          {selectedOption?.label || placeholder}
        </span>
        <svg 
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          strokeWidth={2} 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-full w-max bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-2.5 text-left text-[0.875rem] font-medium
                transition-colors duration-150
                ${value === option.value 
                  ? 'bg-primary text-white' 
                  : 'text-foreground hover:bg-muted'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const Users = () => {
  const { getToken } = useAuth();
  const [businesses, setBusinesses] = useState<BusinessInsight[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessInsight | null>(null);

  // Search and filters
  const [search, setSearch] = useState('');
  const [hasScoreFilter, setHasScoreFilter] = useState<string>('all');
  const [hasAppsFilter, setHasAppsFilter] = useState<string>('all');
  const [hasRecsFilter, setHasRecsFilter] = useState<string>('all');

  // Animated counts
  const animatedTotalBusinesses = useCountUp(stats?.totalBusinesses || 0, 1500);
  const animatedTotalApplications = useCountUp(stats?.totalApplications || 0, 1500);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        if (!token) return;

        // Build filters
        const filters: any = { limit: 100, page: 1 };
        if (search.trim()) filters.search = search.trim();
        if (hasScoreFilter === 'yes') filters.hasScore = true;
        if (hasScoreFilter === 'no') filters.hasScore = false;
        if (hasAppsFilter === 'yes') filters.hasApplications = true;
        if (hasAppsFilter === 'no') filters.hasApplications = false;
        if (hasRecsFilter === 'yes') filters.hasRecommendation = true;
        if (hasRecsFilter === 'no') filters.hasRecommendation = false;

        // Fetch businesses
        const response = await dashboardService.getBusinessInsights(filters);
        setBusinesses(response.data || []);

        // Fetch stats
        try {
          const statsResponse = await dashboardService.getApplicationStats();
          setStats(statsResponse);
        } catch {
          // Fallback stats
          const allBiz = response.data || [];
      let totalApps = 0;
          allBiz.forEach((b: BusinessInsight) => {
            totalApps += (b.applications?.length || 0);
          });
          setStats({
            totalBusinesses: allBiz.length,
        totalApplications: totalApps,
            businessesWithApplications: allBiz.filter((b: BusinessInsight) => (b.applications?.length || 0) > 0).length,
          });
        }
      } catch (err) {
        logger.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [search, hasScoreFilter, hasAppsFilter, hasRecsFilter]);

  // Pie chart data for business breakdown
  const pieData = [
    { name: 'With Apps', color: '#FD8965', value: stats?.businessesWithApplications || 0 },
    { name: 'With Score', color: '#FFB560', value: businesses.filter(b => b.score).length },
    { name: 'With Recs', color: '#E5C7F7', value: businesses.filter(b => b.recommendation).length },
    { name: 'Active', color: '#FAD5F4', value: Math.max(0, (stats?.businessesWithApplications || 0)) },
    { name: 'Other', color: '#C7DEFF', value: Math.max(0, (stats?.totalBusinesses || 0) - (businesses.filter(b => b.score || b.recommendation || (b.applications?.length || 0) > 0).length)) },
  ];

  const COLORS = ['#FD8965', '#FFB560', '#E5C7F7', '#FAD5F4', '#C7DEFF'];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Get score color
  const getScoreColor = (score?: number) => {
    if (!score) return '#6F767E';
    if (score >= 750 || (score <= 10 && score >= 8)) return '#32AE60';
    if (score >= 650 || (score <= 10 && score >= 5)) return '#0C68E9';
    return '#F04D1A';
  };

    return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
      {/* LEFT: Users List (like Prices) */}
      <div className="card flex-1 min-w-0 bg-card rounded-2xl p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 text-[1.125rem] font-semibold text-foreground">
          Users
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, city, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-muted border border-border rounded-xl text-[0.9375rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <CustomDropdown
            value={hasScoreFilter}
            onChange={setHasScoreFilter}
            options={[
              { value: 'all', label: 'All Scores' },
              { value: 'yes', label: 'With Score' },
              { value: 'no', label: 'Without Score' },
            ]}
          />
          
          <CustomDropdown
            value={hasAppsFilter}
            onChange={setHasAppsFilter}
            options={[
              { value: 'all', label: 'All Applications' },
              { value: 'yes', label: 'With Applications' },
              { value: 'no', label: 'Without Applications' },
            ]}
          />
          
          <CustomDropdown
            value={hasRecsFilter}
            onChange={setHasRecsFilter}
            options={[
              { value: 'all', label: 'All Recommendations' },
              { value: 'yes', label: 'With Recommendations' },
              { value: 'no', label: 'Without Recommendations' },
            ]}
          />

          {(search || hasScoreFilter !== 'all' || hasAppsFilter !== 'all' || hasRecsFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setHasScoreFilter('all');
                setHasAppsFilter('all');
                setHasRecsFilter('all');
              }}
              className="h-10 px-4 bg-foreground text-white rounded-xl text-[0.875rem] font-medium hover:bg-foreground/90 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="-mx-3 space-y-2">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex items-center h-20 px-3 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full mr-4" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-32 mb-2" />
                  <div className="h-3 bg-muted rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-[1rem]">No users found matching your criteria</p>
            <button
              onClick={() => {
                setSearch('');
                setHasScoreFilter('all');
                setHasAppsFilter('all');
                setHasRecsFilter('all');
              }}
              className="mt-4 h-10 px-6 bg-primary text-white rounded-xl text-[0.875rem] font-semibold hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="-mx-3 space-y-2 md:-mx-2">
            {businesses.map((business) => {
              const appCount = business.applications?.length || 0;
              const hasApps = appCount > 0;
              const hasScore = !!business.score;
              const chartData = generateMiniChartData(business.score?.score || 50, hasApps || hasScore);
              const isPositive = hasApps || hasScore;

              return (
                <div
                  key={business.id}
                  onClick={() => setSelectedBusiness(business)}
                  className="flex justify-between items-center h-20 px-3 rounded-2xl border border-transparent transition-all hover:border-border hover:shadow-[0_0_0.875rem_-0.25rem_rgba(0,0,0,0.05),0_2rem_3rem_-0.5rem_rgba(0,0,0,0.05)] cursor-pointer md:h-18 md:px-2"
                >
                  {/* Avatar & Name - Full width for name */}
                  <div className="flex items-center flex-1 min-w-0 mr-4">
                    <div className="mr-4 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{getInitials(business.name)}</span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[0.9375rem] font-semibold text-foreground">
                        {business.name}
                      </div>
                      <div className="text-[0.75rem] text-muted-foreground opacity-75">
                        {business.legalStruct || business.city || 'Business'}
                      </div>
                    </div>
                  </div>

                  {/* Applications Count - Before the chart */}
                  <div className="shrink-0 mr-4 md:hidden">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.8125rem] font-semibold ${
                      appCount > 0 
                        ? 'bg-[#DFF9E8] text-[#32AE60]' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {appCount} {appCount === 1 ? 'app' : 'apps'}
                    </div>
                  </div>

                  {/* Credit Score */}
                  <div className="shrink-0 w-16 text-[0.9375rem] font-semibold text-center mr-4 md:hidden" style={{ color: getScoreColor(business.score?.score) }}>
                    {business.score?.score ? (
                      <span>{business.score.score}</span>
                    ) : (
                      <span className="text-muted-foreground">
                        {business.yearFounded ? `${new Date().getFullYear() - business.yearFounded}y` : '—'}
                      </span>
                  )}
                </div>

                  {/* Mini Chart */}
                  <div className="shrink-0 w-24 h-9 mr-4 md:hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        width={300}
                        height={100}
                        data={chartData}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <Line
                          type="linear"
                          dataKey="price"
                          dot={false}
                          stroke={isPositive ? '#32AE60' : '#F04D1A'}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* View Button */}
                  <div className="shrink-0">
                    <button className="h-10 px-4 bg-muted text-foreground text-[0.875rem] font-semibold rounded-lg hover:bg-muted transition-colors">
                      View
                    </button>
              </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results count */}
        {!isLoading && businesses.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border text-[0.875rem] text-muted-foreground">
            Showing {businesses.length} users
          </div>
        )}
              </div>

      {/* RIGHT: Business Overview (like Available Balance) */}
      <div className="card-sidebar w-full mt-6 lg:mt-0 lg:w-[21.25rem] lg:shrink-0 bg-card rounded-2xl p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 text-[1.125rem] font-semibold text-foreground">
          Business Overview
        </div>

        {/* Total Businesses */}
        <div className="text-[2.5rem] font-semibold text-foreground">
          {animatedTotalBusinesses.toLocaleString()}
        </div>
        <div className="flex items-center gap-1 text-[#32AE60] text-[0.875rem] font-semibold mb-6">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z" />
          </svg>
          {animatedTotalApplications} total applications
            </div>

        {/* Pie Chart */}
        <div className="relative w-[15.75rem] h-[15.75rem] mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={290} height={290}>
              <Pie
                data={pieData}
                cx={122}
                cy={122}
                innerRadius={70}
                outerRadius={124}
                labelLine={false}
                dataKey="value"
                paddingAngle={2}
                stroke="transparent"
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {pieData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-[1.25rem] font-semibold text-foreground">
              {stats?.businessesWithApplications || 0}
            </div>
            <div className="text-[0.75rem] text-muted-foreground">Active</div>
                </div>
              </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center mt-6 gap-3">
          {pieData.map((item, index) => (
            <div
              className="flex items-center text-[0.75rem] font-medium text-muted-foreground"
              key={index}
            >
              <div
                className="shrink-0 w-3 h-3 mr-2 rounded"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[0.875rem] text-muted-foreground">With Applications</span>
            <span className="text-[0.9375rem] font-semibold text-foreground">
              {stats?.businessesWithApplications || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[0.875rem] text-muted-foreground">With Score</span>
            <span className="text-[0.9375rem] font-semibold text-foreground">
              {businesses.filter(b => b.score).length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[0.875rem] text-muted-foreground">With Recommendations</span>
            <span className="text-[0.9375rem] font-semibold text-foreground">
              {businesses.filter(b => b.recommendation).length}
            </span>
          </div>
        </div>

        {/* View All Button */}
        <button className="w-full h-12 mt-6 bg-muted text-foreground rounded-xl font-semibold text-[0.9375rem] hover:bg-muted transition-colors">
          View all users
        </button>
      </div>

      {/* User Detail Modal - z-[200] to cover header */}
      {selectedBusiness && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBusiness(null)} />
          <div className="relative bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            {/* Close Button */}
            <button
              onClick={() => setSelectedBusiness(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center">
                <span className="text-white font-bold text-xl">{getInitials(selectedBusiness.name)}</span>
              </div>
              <div>
                <h2 className="text-[1.5rem] font-semibold text-foreground">{selectedBusiness.name}</h2>
                <p className="text-muted-foreground">
                  {[selectedBusiness.city, selectedBusiness.state].filter(Boolean).join(', ') || selectedBusiness.legalStruct}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-muted rounded-xl">
                <div className="text-[0.8125rem] text-muted-foreground mb-1">Credit Score</div>
                <div className="text-[1.5rem] font-semibold" style={{ color: getScoreColor(selectedBusiness.score?.score) }}>
                  {selectedBusiness.score?.score || '—'}
                </div>
              </div>
              <div className="p-4 bg-[#DFF9E8] rounded-xl">
                <div className="text-[0.8125rem] text-[#32AE60] mb-1">Applications</div>
                <div className="text-[1.5rem] font-semibold text-[#32AE60]">
                  {selectedBusiness.applications?.length || 0}
                </div>
              </div>
              <div className="p-4 bg-muted rounded-xl">
                <div className="text-[0.8125rem] text-muted-foreground mb-1">Recommendations</div>
                <div className="text-[1.5rem] font-semibold text-foreground">
                  {selectedBusiness.recommendation?.recommendations?.length || 0}
                </div>
                            </div>
                      </div>

            {/* Business Info */}
            <div className="mb-6">
              <h3 className="text-[1rem] font-semibold text-foreground mb-3">Business Info</h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedBusiness.legalStruct && (
                  <div className="p-3 bg-muted rounded-xl">
                    <div className="text-[0.75rem] text-muted-foreground">Structure</div>
                    <div className="text-[0.9375rem] font-semibold text-foreground">{selectedBusiness.legalStruct}</div>
                  </div>
                )}
                {selectedBusiness.yearFounded && (
                  <div className="p-3 bg-muted rounded-xl">
                    <div className="text-[0.75rem] text-muted-foreground">Founded</div>
                    <div className="text-[0.9375rem] font-semibold text-foreground">{selectedBusiness.yearFounded}</div>
                        </div>
                )}
                {selectedBusiness.empCount && (
                  <div className="p-3 bg-muted rounded-xl">
                    <div className="text-[0.75rem] text-muted-foreground">Employees</div>
                    <div className="text-[0.9375rem] font-semibold text-foreground">{selectedBusiness.empCount}</div>
                        </div>
                      )}
                {selectedBusiness.score?.type && (
                  <div className="p-3 bg-muted rounded-xl">
                    <div className="text-[0.75rem] text-muted-foreground">Score Type</div>
                    <div className="text-[0.9375rem] font-semibold text-foreground">{selectedBusiness.score.type}</div>
                        </div>
                      )}
                    </div>
                  </div>

            {/* Applications */}
            {selectedBusiness.applications && selectedBusiness.applications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[1rem] font-semibold text-foreground mb-3">
                  Applications ({selectedBusiness.applications.length})
                </h3>
                <div className="space-y-2">
                  {selectedBusiness.applications.map((app, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                    <div>
                        <div className="text-[0.9375rem] font-semibold text-foreground">{app.cardName}</div>
                        <div className="text-[0.75rem] text-muted-foreground">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-[0.75rem] font-semibold ${
                        app.status === 'APPROVED' || app.status === 'approved' 
                          ? 'bg-[#DFF9E8] text-[#32AE60]'
                          : app.status === 'PENDING' || app.status === 'pending'
                          ? 'bg-[#FEE6C7] text-[#FBA94B]'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {app.status}
                      </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

            {/* Recommendations */}
            {selectedBusiness.recommendation && selectedBusiness.recommendation.recommendations.length > 0 && (
                  <div>
                <h3 className="text-[1rem] font-semibold text-foreground mb-3">Card Recommendations</h3>
                <div className="space-y-2">
                  {selectedBusiness.recommendation.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 bg-muted rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                        <div className="text-[0.9375rem] font-semibold text-foreground">{rec.cardName}</div>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[0.75rem] font-semibold">
                          {(rec.fitScore * 100).toFixed(0)}% fit
                        </span>
                                </div>
                      <p className="text-[0.8125rem] text-muted-foreground">{rec.reason}</p>
                              </div>
                            ))}
                </div>
              </div>
            )}
              </div>
            </div>
          )}
      </div>
  );
};

export default Users;

