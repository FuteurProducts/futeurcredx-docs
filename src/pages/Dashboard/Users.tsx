import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import dashboardService from '@/services/dashboardService';
import { logger } from '@/utils/logger';
import { cn } from '@/lib/utils';

// shadcn components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SandboxEmptyState } from '@/components/shared/SandboxEmptyState';

// Lucide icons
import {
  Search,
  X,
  FileText,
  TrendingUp,
  Building2,
  Calendar,
  Users as UsersIcon,
  CreditCard,
} from 'lucide-react';

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
// CHART COLORS - Using CSS variable-compatible colors
// ============================================

// These colors are designed to work in both light and dark mode
const CHART_COLORS = {
  withApps: 'hsl(var(--chart-1))',
  withScore: 'hsl(var(--chart-4))',
  withRecs: 'hsl(280 65% 75%)',
  active: 'hsl(340 75% 85%)',
  other: 'hsl(var(--chart-3))',
};

const CHART_COLORS_ARRAY = [
  CHART_COLORS.withApps,
  CHART_COLORS.withScore,
  CHART_COLORS.withRecs,
  CHART_COLORS.active,
  CHART_COLORS.other,
];

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

  // Environment check - must be after all hooks
  const { isDemoMode } = useEnvironment();

  // Early return for sandbox/production mode
  if (!isDemoMode) {
    return (
      <div className="p-4 lg:p-6">
        <SandboxEmptyState
          title="No Business Data"
          description="Connect to a live API to view business portfolio data. Business details and scoring will appear here once your API integration is configured."
        />
      </div>
    );
  }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        if (!token) return;

        // Build filters
        const filters: Record<string, unknown> = { limit: 100, page: 1 };
        if (search.trim()) filters.search = search.trim();
        if (hasScoreFilter === 'yes') filters.hasScore = true;
        if (hasScoreFilter === 'no') filters.hasScore = false;
        if (hasAppsFilter === 'yes') filters.hasApplications = true;
        if (hasAppsFilter === 'no') filters.hasApplications = false;
        if (hasRecsFilter === 'yes') filters.hasRecommendation = true;
        if (hasRecsFilter === 'no') filters.hasRecommendation = false;

        // Fetch businesses
        const response = await dashboardService.getBusinessInsights(filters);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response converted to component type
        setBusinesses((response.data || []) as unknown as BusinessInsight[]);

        // Fetch stats
        try {
          const statsResponse = await dashboardService.getApplicationStats();
          setStats(statsResponse);
        } catch {
          // Fallback stats
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API response converted to component type
          const allBiz = (response.data || []) as unknown as BusinessInsight[];
          let totalApps = 0;
          allBiz.forEach((b) => {
            totalApps += (b.applications?.length || 0);
          });
          setStats({
            totalBusinesses: allBiz.length,
            totalApplications: totalApps,
            businessesWithApplications: allBiz.filter((b) => (b.applications?.length || 0) > 0).length,
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
  }, [search, hasScoreFilter, hasAppsFilter, hasRecsFilter, getToken]);

  // Pie chart data for business breakdown
  const pieData = [
    { name: 'With Apps', value: stats?.businessesWithApplications || 0 },
    { name: 'With Score', value: businesses.filter(b => b.score).length },
    { name: 'With Recs', value: businesses.filter(b => b.recommendation).length },
    { name: 'Active', value: Math.max(0, (stats?.businessesWithApplications || 0)) },
    { name: 'Other', value: Math.max(0, (stats?.totalBusinesses || 0) - (businesses.filter(b => b.score || b.recommendation || (b.applications?.length || 0) > 0).length)) },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Get score variant for badge
  const getScoreVariant = (score?: number): 'success' | 'info' | 'destructive' | 'secondary' => {
    if (!score) return 'secondary';
    if (score >= 750 || (score <= 10 && score >= 8)) return 'success';
    if (score >= 650 || (score <= 10 && score >= 5)) return 'info';
    return 'destructive';
  };

  // Get status variant for application badges
  const getStatusVariant = (status: string): 'success' | 'warning' | 'secondary' => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'approved') return 'success';
    if (normalizedStatus === 'pending') return 'warning';
    return 'secondary';
  };

  const clearFilters = () => {
    setSearch('');
    setHasScoreFilter('all');
    setHasAppsFilter('all');
    setHasRecsFilter('all');
  };

  const hasActiveFilters = search || hasScoreFilter !== 'all' || hasAppsFilter !== 'all' || hasRecsFilter !== 'all';

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
      {/* LEFT: Users List */}
      <Card className="flex-1 min-w-0 rounded-2xl">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, city, or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12"
              aria-label="Search businesses by name, city, or state"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={hasScoreFilter} onValueChange={setHasScoreFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Scores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="yes">With Score</SelectItem>
                <SelectItem value="no">Without Score</SelectItem>
              </SelectContent>
            </Select>

            <Select value={hasAppsFilter} onValueChange={setHasAppsFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Applications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="yes">With Applications</SelectItem>
                <SelectItem value="no">Without Applications</SelectItem>
              </SelectContent>
            </Select>

            <Select value={hasRecsFilter} onValueChange={setHasRecsFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Recommendations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recommendations</SelectItem>
                <SelectItem value="yes">With Recommendations</SelectItem>
                <SelectItem value="no">Without Recommendations</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="secondary" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Users List */}
          {isLoading ? (
            <div className="space-y-2">
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
              <p className="text-base">No users found matching your criteria</p>
              <Button variant="default" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
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
                    className={cn(
                      "flex justify-between items-center h-20 px-3 rounded-xl",
                      "border border-transparent transition-all cursor-pointer",
                      "hover:border-border hover:bg-muted/50"
                    )}
                  >
                    {/* Avatar & Name */}
                    <div className="flex items-center flex-1 min-w-0 mr-4">
                      <Avatar className="mr-4 shrink-0 bg-primary">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                          {getInitials(business.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">
                          {business.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {business.legalStruct || business.city || 'Business'}
                        </div>
                      </div>
                    </div>

                    {/* Applications Count Badge */}
                    <div className="shrink-0 mr-4 hidden sm:block">
                      <Badge
                        variant={appCount > 0 ? 'success' : 'secondary'}
                        className="gap-1.5"
                      >
                        <FileText className="h-4 w-4" />
                        {appCount} {appCount === 1 ? 'app' : 'apps'}
                      </Badge>
                    </div>

                    {/* Credit Score Badge */}
                    <div className="shrink-0 w-16 text-center mr-4 hidden sm:block">
                      {business.score?.score ? (
                        <Badge variant={getScoreVariant(business.score.score)}>
                          {business.score.score}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {business.yearFounded ? `${new Date().getFullYear() - business.yearFounded}y` : '-'}
                        </span>
                      )}
                    </div>

                    {/* Mini Chart */}
                    <div className="shrink-0 w-24 h-9 mr-4 hidden md:block">
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
                            stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* View Button */}
                    <div className="shrink-0">
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Results count */}
          {!isLoading && businesses.length > 0 && (
            <div className="pt-4 border-t border-border text-sm text-muted-foreground">
              Showing {businesses.length} users
            </div>
          )}
        </CardContent>
      </Card>

      {/* RIGHT: Business Overview */}
      <Card className="w-full mt-6 lg:mt-0 lg:w-[21.25rem] lg:shrink-0 rounded-2xl">
        <CardHeader>
          <CardTitle>Business Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Businesses */}
          <div>
            <div className="text-4xl font-semibold text-foreground">
              {animatedTotalBusinesses.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-success text-sm font-semibold">
              <TrendingUp className="h-4 w-4" />
              {animatedTotalApplications} total applications
            </div>
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
                      fill={CHART_COLORS_ARRAY[index % CHART_COLORS_ARRAY.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-xl font-semibold text-foreground">
                {stats?.businessesWithApplications || 0}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3">
            {pieData.map((item, index) => (
              <div
                className="flex items-center text-xs font-medium text-muted-foreground"
                key={index}
              >
                <div
                  className="shrink-0 w-3 h-3 mr-2 rounded"
                  style={{ backgroundColor: CHART_COLORS_ARRAY[index % CHART_COLORS_ARRAY.length] }}
                />
                {item.name}
              </div>
            ))}
          </div>

          {/* Stats Summary */}
          <div className="pt-6 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">With Applications</span>
              <span className="text-sm font-semibold text-foreground">
                {stats?.businessesWithApplications || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">With Score</span>
              <span className="text-sm font-semibold text-foreground">
                {businesses.filter(b => b.score).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">With Recommendations</span>
              <span className="text-sm font-semibold text-foreground">
                {businesses.filter(b => b.recommendation).length}
              </span>
            </div>
          </div>

          {/* View All Button */}
          <Button variant="secondary" className="w-full">
            View all users
          </Button>
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedBusiness} onOpenChange={(open) => !open && setSelectedBusiness(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBusiness && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 bg-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xl">
                      {getInitials(selectedBusiness.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">{selectedBusiness.name}</DialogTitle>
                    <p className="text-muted-foreground">
                      {[selectedBusiness.city, selectedBusiness.state].filter(Boolean).join(', ') || selectedBusiness.legalStruct}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-muted rounded-2xl">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    Credit Score
                  </div>
                  <div className="text-2xl font-semibold">
                    {selectedBusiness.score?.score ? (
                      <Badge variant={getScoreVariant(selectedBusiness.score.score)} className="text-lg px-3 py-1">
                        {selectedBusiness.score.score}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
                <div className="p-4 bg-success/10 rounded-2xl">
                  <div className="text-xs text-success mb-1 flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Applications
                  </div>
                  <div className="text-2xl font-semibold text-success">
                    {selectedBusiness.applications?.length || 0}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-2xl">
                  <div className="text-xs text-muted-foreground mb-1">Recommendations</div>
                  <div className="text-2xl font-semibold text-foreground">
                    {selectedBusiness.recommendation?.recommendations?.length || 0}
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="mt-6">
                <h3 className="text-base font-semibold text-foreground mb-3">Business Info</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedBusiness.legalStruct && (
                    <div className="p-3 bg-muted rounded-2xl">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        Structure
                      </div>
                      <div className="text-sm font-semibold text-foreground">{selectedBusiness.legalStruct}</div>
                    </div>
                  )}
                  {selectedBusiness.yearFounded && (
                    <div className="p-3 bg-muted rounded-2xl">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Founded
                      </div>
                      <div className="text-sm font-semibold text-foreground">{selectedBusiness.yearFounded}</div>
                    </div>
                  )}
                  {selectedBusiness.empCount && (
                    <div className="p-3 bg-muted rounded-2xl">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <UsersIcon className="h-4 w-4" />
                        Employees
                      </div>
                      <div className="text-sm font-semibold text-foreground">{selectedBusiness.empCount}</div>
                    </div>
                  )}
                  {selectedBusiness.score?.type && (
                    <div className="p-3 bg-muted rounded-2xl">
                      <div className="text-xs text-muted-foreground">Score Type</div>
                      <div className="text-sm font-semibold text-foreground">{selectedBusiness.score.type}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Applications */}
              {selectedBusiness.applications && selectedBusiness.applications.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-base font-semibold text-foreground mb-3">
                    Applications ({selectedBusiness.applications.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedBusiness.applications.map((app, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-2xl">
                        <div>
                          <div className="text-sm font-semibold text-foreground">{app.cardName}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedBusiness.recommendation && selectedBusiness.recommendation.recommendations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-base font-semibold text-foreground mb-3">Card Recommendations</h3>
                  <div className="space-y-2">
                    {selectedBusiness.recommendation.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-4 bg-muted rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-foreground">{rec.cardName}</div>
                          <Badge variant="default">
                            {(rec.fitScore * 100).toFixed(0)}% fit
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
