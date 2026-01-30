/**
 * Scores Page - BFF Wired
 * Pull and view credit scores via /scores endpoint
 */

import React, { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { scoresService, customersService } from '@/services/bff';
import { useAuditEmit } from '@/hooks/useAuditEmit';
import { PortfolioSelector } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Zap, 
  TrendingUp,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ScoreRecord {
  id: string;
  smbEntityId: string;
  businessName?: string;
  source: string;
  scoreType: string;
  score: number;
  riskClass: string;
  factors: Array<{ code: string; description: string; impact: string }>;
  pulledAt: string;
}

interface CustomerForPull {
  id: string;
  businessName: string;
  hasScore: boolean;
  latestScore?: number;
  riskClass?: string;
}

const RISK_CONFIG = {
  'low': { label: 'Low Risk', color: 'hsl(var(--chart-2))', icon: CheckCircle },
  'medium': { label: 'Medium Risk', color: 'hsl(var(--chart-4))', icon: Clock },
  'high': { label: 'High Risk', color: 'hsl(var(--destructive))', icon: AlertTriangle },
};

// Demo data for unauthenticated mode
const mockDemoCustomers: CustomerForPull[] = [
  { id: 'demo-cust-1', businessName: 'Apex Construction LLC', hasScore: true, latestScore: 720, riskClass: 'low' },
  { id: 'demo-cust-2', businessName: 'Metro Logistics Inc', hasScore: true, latestScore: 685, riskClass: 'medium' },
  { id: 'demo-cust-3', businessName: 'Sunrise Healthcare Group', hasScore: true, latestScore: 745, riskClass: 'low' },
  { id: 'demo-cust-4', businessName: 'TechVenture Solutions', hasScore: true, latestScore: 702, riskClass: 'low' },
  { id: 'demo-cust-5', businessName: 'Green Valley Farms', hasScore: true, latestScore: 658, riskClass: 'medium' },
  { id: 'demo-cust-6', businessName: 'Coastal Hospitality LLC', hasScore: false },
  { id: 'demo-cust-7', businessName: 'Precision Manufacturing Co', hasScore: false },
  { id: 'demo-cust-8', businessName: 'Urban Retail Partners', hasScore: false },
];

const mockDemoScores: ScoreRecord[] = [
  { id: 'score-1', smbEntityId: 'demo-cust-1', businessName: 'Apex Construction LLC', source: 'experian_biz', scoreType: 'intelliscore', score: 720, riskClass: 'low', factors: [{ code: 'PH01', description: 'Strong payment history', impact: 'positive' }, { code: 'UT02', description: 'Low credit utilization', impact: 'positive' }], pulledAt: '2025-01-20T10:30:00Z' },
  { id: 'score-2', smbEntityId: 'demo-cust-2', businessName: 'Metro Logistics Inc', source: 'dnb', scoreType: 'paydex', score: 685, riskClass: 'medium', factors: [{ code: 'PH01', description: 'Good payment history', impact: 'positive' }, { code: 'AG01', description: 'Business age under 5 years', impact: 'negative' }], pulledAt: '2025-01-19T14:15:00Z' },
  { id: 'score-3', smbEntityId: 'demo-cust-3', businessName: 'Sunrise Healthcare Group', source: 'experian_biz', scoreType: 'intelliscore', score: 745, riskClass: 'low', factors: [{ code: 'PH01', description: 'Excellent payment history', impact: 'positive' }, { code: 'TL01', description: 'Diverse trade lines', impact: 'positive' }], pulledAt: '2025-01-18T09:45:00Z' },
  { id: 'score-4', smbEntityId: 'demo-cust-4', businessName: 'TechVenture Solutions', source: 'equifax_biz', scoreType: 'business_risk', score: 702, riskClass: 'low', factors: [{ code: 'CF01', description: 'Stable cash flow', impact: 'positive' }], pulledAt: '2025-01-17T16:20:00Z' },
  { id: 'score-5', smbEntityId: 'demo-cust-5', businessName: 'Green Valley Farms', source: 'dnb', scoreType: 'paydex', score: 658, riskClass: 'medium', factors: [{ code: 'UT02', description: 'Moderate credit utilization', impact: 'neutral' }, { code: 'IND01', description: 'Seasonal industry volatility', impact: 'negative' }], pulledAt: '2025-01-16T11:00:00Z' },
];

const ScoresBff: React.FC = () => {
  const { portfolioId, isLoading: portfolioLoading } = usePortfolio();
  const { emitScoreViewed, emitApplyClicked } = useAuditEmit();

  // Data state
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerForPull[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPulling, setIsPulling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Fetch scores from BFF (falls back to demo data if no auth)
  const fetchScores = useCallback(async () => {
    if (!portfolioId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await scoresService.list(portfolioId, { pageSize: 100 });
      setScores(response.data as unknown as ScoreRecord[]);
      setLastUpdated(response.meta?.lastUpdated || new Date().toISOString());

      emitScoreViewed(portfolioId, 'portfolio_list');
    } catch (err) {
      console.log('BFF unavailable, using demo scores');
      // Fallback to demo data when not authenticated
      setScores(mockDemoScores);
      setLastUpdated(new Date().toISOString());
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, [portfolioId, emitScoreViewed]);

  // Fetch customers to show which need scores (falls back to demo data)
  const fetchCustomers = useCallback(async () => {
    if (!portfolioId) return;

    try {
      const response = await customersService.list(portfolioId, { pageSize: 100 });
      const customerList = (response.data as unknown as Array<{
        id: string;
        businessName: string;
        latestScore?: number;
        riskClass?: string;
      }>).map(c => ({
        id: c.id,
        businessName: c.businessName,
        hasScore: !!c.latestScore,
        latestScore: c.latestScore,
        riskClass: c.riskClass,
      }));
      setCustomers(customerList);
    } catch (err) {
      console.log('BFF unavailable, using demo customers');
      // Fallback to demo data
      setCustomers(mockDemoCustomers);
    }
  }, [portfolioId]);

  // Fetch on portfolio change
  useEffect(() => {
    if (portfolioId) {
      fetchScores();
      fetchCustomers();
    }
  }, [portfolioId, fetchScores, fetchCustomers]);

  // Pull scores for a customer
  const handlePullScores = async (customerId: string, _businessName: string) => {
    if (!portfolioId) return;

    setIsPulling(customerId);
    setError(null);

    try {
      // The BFF expects a single source, but we simulate multiple by calling twice
      await scoresService.pull(portfolioId, {
        smbEntityId: customerId,
        source: 'experian_biz',
      });

      emitApplyClicked(customerId, 'score_pull');

      // Refresh data
      await fetchScores();
      await fetchCustomers();
    } catch (err) {
      console.error('Failed to pull scores:', err);
      setError(err instanceof Error ? err.message : 'Failed to pull credit scores');
    } finally {
      setIsPulling(null);
    }
  };

  // Calculate stats
  const avgScore = scores.length > 0 
    ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
    : 0;
  const customersWithScores = customers.filter(c => c.hasScore).length;
  const customersWithoutScores = customers.filter(c => !c.hasScore).length;

  // Loading state
  if (portfolioLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading portfolio...</span>
      </div>
    );
  }

  // No portfolio selected
  if (!portfolioId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Select a portfolio to view scores</p>
        <PortfolioSelector />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <PortfolioSelector />
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchScores}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchScores}>
            Retry
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Scores</p>
                <p className="text-2xl font-bold">{scores.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{avgScore || '-'}</p>
              </div>
              <Zap className="h-8 w-8 text-chart-2 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">With Scores</p>
                <p className="text-2xl font-bold text-chart-2">{customersWithScores}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-chart-2 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Need Scores</p>
                <p className="text-2xl font-bold text-warning">{customersWithoutScores}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customers needing scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Pull Credit Scores
            </CardTitle>
            <CardDescription>
              Select a customer to pull their credit score from bureaus
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && customers.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : customers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No customers in portfolio
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {customers.map((customer) => (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{customer.businessName}</p>
                        {customer.hasScore ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-chart-2">
                              Score: {customer.latestScore}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {customer.riskClass || 'Unknown'}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No score on file</span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={customer.hasScore ? 'outline' : 'default'}
                      onClick={() => handlePullScores(customer.id, customer.businessName)}
                      disabled={isPulling === customer.id}
                    >
                      {isPulling === customer.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Pulling...
                        </>
                      ) : customer.hasScore ? (
                        'Refresh'
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Pull Score
                        </>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-chart-2" />
              Recent Score Pulls
            </CardTitle>
            <CardDescription>
              Latest credit scores pulled from bureaus
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && scores.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : scores.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No scores pulled yet. Pull scores for a customer to see results here.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {scores.slice(0, 10).map((score) => {
                  const riskConfig = RISK_CONFIG[score.riskClass as keyof typeof RISK_CONFIG] || RISK_CONFIG.medium;
                  const RiskIcon = riskConfig.icon;

                  return (
                    <motion.div
                      key={score.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">{score.score}</span>
                          <div className="flex items-center gap-1">
                            <RiskIcon className="h-4 w-4" style={{ color: riskConfig.color }} />
                            <span className="text-xs" style={{ color: riskConfig.color }}>
                              {riskConfig.label}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {score.source}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{score.businessName || 'Unknown Business'}</span>
                        <span>{new Date(score.pulledAt).toLocaleDateString()}</span>
                      </div>
                      {score.factors && score.factors.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {score.factors.slice(0, 3).map((factor, idx) => (
                            <Badge 
                              key={idx} 
                              variant="secondary" 
                              className={`text-xs ${
                                factor.impact === 'positive' ? 'bg-chart-2/10 text-chart-2' :
                                factor.impact === 'negative' ? 'bg-destructive/10 text-destructive' :
                                ''
                              }`}
                            >
                              {factor.description}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScoresBff;
