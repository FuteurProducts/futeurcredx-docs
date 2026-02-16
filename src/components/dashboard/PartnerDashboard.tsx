import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Activity,
  TrendingUp,
  ExternalLink,
  RefreshCw,
  BarChart3,
  Globe,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
// UserResource type from AuthContext
interface UserResource {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  imageUrl?: string;
}

interface BusinessUsage {
  id: string;
  name: string;
  domain: string;
  lastUsed: string;
  callsThisMonth: number;
  plan: string;
  status: 'active' | 'inactive' | 'trial';
  industry: string;
  location: string;
  apiKeys: number;
  growth: number;
}

interface PartnerStats {
  totalBusinesses: number;
  activeBusinesses: number;
  totalCallsThisMonth: number;
  growthRate: number;
  topBusinesses: BusinessUsage[];
  revenue: number;
  newBusinessesThisMonth: number;
  averageCallsPerBusiness: number;
}

interface PartnerDashboardProps {
  user: UserResource | null;
  formatDate: (date: string | Date) => string;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
  isDataFresh?: boolean;
  onRefresh?: () => void;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ 
  formatDate, 
  isRefreshing = false, 
  lastUpdated, 
  isDataFresh = true,
  onRefresh 
}) => {
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [businesses, setBusinesses] = useState<BusinessUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  // Generate realistic partner data
  const generatePartnerData = () => {
    const mockBusinesses: BusinessUsage[] = [
      {
        id: 'biz-1',
        name: 'TechCorp Solutions',
        domain: 'techcorp.com',
        lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        callsThisMonth: 15420,
        plan: 'Enterprise',
        status: 'active',
        industry: 'Technology',
        location: 'San Francisco, CA',
        apiKeys: 3,
        growth: 23.5
      },
      {
        id: 'biz-2',
        name: 'FinanceFlow Inc',
        domain: 'financeflow.io',
        lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        callsThisMonth: 8930,
        plan: 'Professional',
        status: 'active',
        industry: 'Fintech',
        location: 'New York, NY',
        apiKeys: 2,
        growth: 18.2
      },
      {
        id: 'biz-3',
        name: 'RetailMax',
        domain: 'retailmax.com',
        lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        callsThisMonth: 5670,
        plan: 'Professional',
        status: 'active',
        industry: 'Retail',
        location: 'Chicago, IL',
        apiKeys: 1,
        growth: 8.7
      },
      {
        id: 'biz-4',
        name: 'StartupXYZ',
        domain: 'startupxyz.co',
        lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        callsThisMonth: 2340,
        plan: 'Free',
        status: 'trial',
        industry: 'SaaS',
        location: 'Austin, TX',
        apiKeys: 1,
        growth: 45.2
      },
      {
        id: 'biz-5',
        name: 'EcommercePro',
        domain: 'ecommercepro.shop',
        lastUsed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        callsThisMonth: 890,
        plan: 'Free',
        status: 'inactive',
        industry: 'E-commerce',
        location: 'Miami, FL',
        apiKeys: 1,
        growth: -12.3
      },
      {
        id: 'biz-6',
        name: 'DataAnalytics Co',
        domain: 'dataanalytics.co',
        lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        callsThisMonth: 12340,
        plan: 'Enterprise',
        status: 'active',
        industry: 'Analytics',
        location: 'Seattle, WA',
        apiKeys: 4,
        growth: 31.8
      }
    ];

    const totalCallsThisMonth = mockBusinesses.reduce((sum, b) => sum + b.callsThisMonth, 0);
    const activeBusinesses = mockBusinesses.filter(b => b.status === 'active').length;
    const newBusinessesThisMonth = 2; // Simulated
    const averageCallsPerBusiness = Math.round(totalCallsThisMonth / mockBusinesses.length);

    return {
      totalBusinesses: mockBusinesses.length,
      activeBusinesses,
      totalCallsThisMonth,
      growthRate: 24.7, // Simulated
      topBusinesses: mockBusinesses.sort((a, b) => b.callsThisMonth - a.callsThisMonth),
      revenue: 45600, // Simulated monthly revenue
      newBusinessesThisMonth,
      averageCallsPerBusiness
    };
  };

  useEffect(() => {
    const simulateData = () => {
      const partnerData = generatePartnerData();
      setStats(partnerData);
      setBusinesses(partnerData.topBusinesses);
      setIsLoading(false);
    };

    simulateData();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const partnerData = generatePartnerData();
      setStats(partnerData);
      setBusinesses(partnerData.topBusinesses);
      setIsLoading(false);
      onRefresh?.();
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded mt-2" />
          </div>
          <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[140px] bg-muted/50 animate-pulse rounded-2xl" />
          ))}
        </div>

        {/* Timeframe selector skeleton */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>

        {/* Business table skeleton */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-headline text-foreground">Partner Dashboard</h2>
          <p className="text-muted-foreground mt-1">Monitor your businesses using the LumiqAI API</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              {isDataFresh && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                  ✓ Fresh
                </span>
              )}
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 bg-info text-white rounded-lg hover:bg-info/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Partner Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/80 backdrop-blur-sm border border-primary/20 rounded-2xl p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-info/10 rounded-xl">
              <Building2 className="w-8 h-8 text-info" />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-tight text-info">Total Businesses</h3>
              <p className="text-sm text-muted-foreground font-medium">All time</p>
            </div>
          </div>
          <div className="text-3xl font-black">{stats?.totalBusinesses}</div>
          <div className="text-sm text-success font-medium mt-1">
            +{stats?.newBusinessesThisMonth} this month
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/80 backdrop-blur-sm border border-success/20 rounded-2xl p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-success/10 rounded-xl">
              <Users className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-tight text-success">Active Businesses</h3>
              <p className="text-sm text-muted-foreground font-medium">Last 30 days</p>
            </div>
          </div>
          <div className="text-3xl font-black">{stats?.activeBusinesses}</div>
          <div className="text-sm text-success font-medium mt-1">
            {Math.round((stats?.activeBusinesses || 0) / (stats?.totalBusinesses || 1) * 100)}% of total
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-[var(--primary-04)]/10 rounded-xl">
              <Activity className="w-8 h-8 text-[var(--primary-04)]" />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-tight text-[var(--primary-04)]">API Calls</h3>
              <p className="text-sm text-muted-foreground font-medium">This month</p>
            </div>
          </div>
          <div className="text-3xl font-black">{stats?.totalCallsThisMonth.toLocaleString()}</div>
          <div className="text-sm text-[var(--primary-04)] font-medium mt-1">
            +{stats?.growthRate}% vs last month
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/80 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-warning/10 rounded-xl">
              <TrendingUp className="w-8 h-8 text-warning" />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-tight text-warning">Revenue</h3>
              <p className="text-sm text-muted-foreground font-medium">This month</p>
            </div>
          </div>
          <div className="text-3xl font-black">${stats?.revenue.toLocaleString()}</div>
          <div className="text-sm text-warning font-medium mt-1">
            ${stats?.averageCallsPerBusiness} avg per business
          </div>
        </motion.div>
      </div>

      {/* Businesses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card/80 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-sm"
      >
        <div className="px-6 py-4 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <h2 className="text-title text-foreground">Your Businesses</h2>
            <div className="flex items-center gap-2">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-1 text-sm border border-border rounded-lg focus-visible:ring-2 focus-visible:ring-info focus-visible:border-info"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Calls This Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Growth</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {businesses.map((business, index) => (
                <motion.tr
                  key={business.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="hover:bg-muted"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {business.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-foreground">{business.name}</div>
                        <div className="text-sm text-muted-foreground">{business.domain}</div>
                        <div className="text-xs text-muted-foreground">{business.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info">
                      {business.industry}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-foreground">
                    <div className="text-sm font-medium">{business.callsThisMonth.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{business.apiKeys} API key{business.apiKeys !== 1 ? 's' : ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm font-medium ${
                      business.growth >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      <TrendingUp className={`w-4 h-4 mr-1 ${business.growth < 0 ? 'rotate-180' : ''}`} />
                      {business.growth >= 0 ? '+' : ''}{business.growth}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    <div className="text-sm">{formatDate(business.lastUsed)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      business.status === 'active' 
                        ? 'bg-success/10 text-success'
                        : business.status === 'trial'
                        ? 'bg-card/20 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {business.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {business.status === 'trial' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {business.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-info hover:text-info/80 flex items-center gap-1"
                      onClick={() => toast.info(`Viewing details for ${business.name}`)}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* CRM Integration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-info/10 to-purple-500/10 rounded-2xl p-6 border border-primary/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-card rounded-xl shadow-sm">
              <BarChart3 className="w-8 h-8 text-info" />
            </div>
            <div>
              <h3 className="text-title text-foreground">Connect Your CRM</h3>
              <p className="text-muted-foreground mt-1">Sync business data with HubSpot, Salesforce, or your preferred CRM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 bg-card text-info rounded-lg hover:bg-info/10 transition-colors border border-primary/20"
              onClick={() => toast.info('Opening CRM integration documentation...')}
            >
              <ExternalLink className="w-4 h-4 mr-2 inline" />
              View Docs
            </button>
            <button
              className="px-4 py-2 bg-info text-white rounded-lg hover:bg-info/90 transition-colors flex items-center"
              onClick={() => toast.success('HubSpot connection initiated. Check your email for verification.')}
            >
              <Zap className="w-4 h-4 mr-2" />
              Connect HubSpot
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-card/80 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-info/10 rounded-lg">
              <Zap className="w-6 h-6 text-info" />
            </div>
            <h3 className="font-semibold text-foreground">API Usage Analytics</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Deep dive into API usage patterns and performance metrics</p>
          <button
            className="text-info hover:text-info/80 text-sm font-medium"
            onClick={() => toast.info('Opening API Usage Analytics dashboard...')}
          >
            View Analytics →
          </button>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-success/20 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Security Dashboard</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Monitor API security, rate limits, and access patterns</p>
          <button
            className="text-success hover:text-success/80 text-sm font-medium"
            onClick={() => toast.info('Opening Security Dashboard...')}
          >
            View Security →
          </button>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-[var(--primary-04)]/20 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[var(--primary-04)]/10 rounded-lg">
              <Globe className="w-6 h-6 text-[var(--primary-04)]" />
            </div>
            <h3 className="font-semibold text-foreground">Global Usage</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Track API usage across different regions and time zones</p>
          <button
            className="text-[var(--primary-04)] hover:text-[var(--primary-04)]/80 text-sm font-medium"
            onClick={() => toast.info('Opening Global Usage dashboard...')}
          >
            View Global →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PartnerDashboard;

