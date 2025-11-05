import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, FileText, BarChart2, Rocket, CheckCircle, ExternalLink, TrendingUp, Users as UsersIcon, AlertCircle, Clock, DollarSign, Shield, Target, Zap } from 'lucide-react';
import { ApiHealthMonitor } from '@/components/dashboard/dashboard/ApiHealthMonitor';
import { ConversionChart } from '@/components/dashboard/dashboard/ConversionChart';
import { Button } from '@/components/ui/button';
import { MetricSection, CompactMetricCard } from '@/components/dashboard/dashboard/MetricSection';
import { ROICalculator } from '@/components/dashboard/dashboard/ROICalculator';
import { WebhookEventStream } from '@/components/dashboard/dashboard/WebhookEventStream';
import { DeveloperHub } from '@/components/dashboard/dashboard/DeveloperHub';
import { SmartAlerts } from '@/components/dashboard/dashboard/SmartAlerts';
import { CompetitiveIntelligence } from '@/components/dashboard/dashboard/CompetitiveIntelligence';
import { ApiPlayground } from '@/components/dashboard/dashboard/ApiPlayground';
import { DataFlowVisualization } from '@/components/dashboard/dashboard/DataFlowVisualization';
import { WhiteLabelPreview } from '@/components/dashboard/dashboard/WhiteLabelPreview';
import { ExecutiveSummary } from '@/components/dashboard/dashboard/ExecutiveSummary';

const OverviewTab: React.FC = () => {
  const gettingStartedSteps = [
    { text: 'Account Created', subtext: 'Welcome to FuteurCredX!', completed: true },
    { text: 'API Key Generated', subtext: 'Ready to make API calls', completed: true },
    { text: 'Make Your First API Call', subtext: 'Test the API with your key', completed: false },
  ];

  // Mock data (same as Index page)
  const mockCounts = {
    totalBusinesses: 25000,
    businessesWithCredit: 18500,
    applicationsStarted: 3200,
    approved: 2400,
    ineligible: 6500,
  };

  const mockFunnelMetrics = {
    applicationConversionRate: (mockCounts.applicationsStarted / mockCounts.businessesWithCredit) * 100,
    approvalRate: (mockCounts.approved / mockCounts.applicationsStarted) * 100,
    ineligibleRatio: (mockCounts.ineligible / mockCounts.totalBusinesses) * 100,
    creditActivationRate: (mockCounts.businessesWithCredit / mockCounts.totalBusinesses) * 100,
  };

  const mockProductMetrics = {
    avgTimeToApproval: 2.3,
    avgCreditLimit: 125000,
    applicationDropoffRate: 8.5,
    reApplicationRate: 12.3,
  };

  const mockRiskMetrics = {
    delinquencyRate: 1.8,
    defaultRate: 0.4,
    portfolioUtilizationRate: 62.5,
  };

  const mockRevenueMetrics = {
    arpb: 4250,
    revenuePerApprovedAccount: 8900,
    momGrowthRate: 12.5,
    qoqGrowthRate: 38.2,
  };

  const mockPredictiveMetrics = {
    projectedApprovalVolume6m: 15800,
    projectedConversionLift: 8.5,
    marketingQualifiedOpportunities: 4200,
  };

  const mockTrendData = [
    { month: 'Jan', applications: 450, approved: 340, conversionRate: 16.2, approvalRate: 75.6 },
    { month: 'Feb', applications: 520, approved: 385, conversionRate: 17.1, approvalRate: 74.0 },
    { month: 'Mar', applications: 580, approved: 445, conversionRate: 17.8, approvalRate: 76.7 },
    { month: 'Apr', applications: 615, approved: 468, conversionRate: 18.2, approvalRate: 76.1 },
    { month: 'May', applications: 670, approved: 512, conversionRate: 18.9, approvalRate: 76.4 },
    { month: 'Jun', applications: 725, approved: 558, conversionRate: 19.5, approvalRate: 77.0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-8"
    >
      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-black uppercase tracking-wider text-blue-900 flex items-center gap-2 mb-4">
          <Code className="w-5 h-5" />
          Quick Actions
        </h3>
        <div className="space-y-4">
          <div className="block p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800">API Testing</p>
                <p className="text-sm text-slate-500">Test APIs with your generated tokens</p>
              </div>
            </div>
          </div>
          <Link to="/docs" className="block p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">API Documentation</p>
                        <p className="text-sm text-slate-500">View examples and guides</p>
                    </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <BarChart2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">Usage Analytics</p>
                        <p className="text-sm text-slate-500">Detailed usage insights</p>
                    </div>
                </div>
                <span className="text-xs font-bold uppercase text-slate-400 bg-slate-200 px-2 py-1 rounded-full">Coming Soon</span>
            </div>
          </div>
        </div>
        </div>
      {/* Getting Started */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-black uppercase tracking-wider text-blue-900 flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5" />
          Getting Started
        </h3>
        <div className="space-y-3">
          {gettingStartedSteps.map((step, index) => (
            <div key={index} className={`p-4 rounded-xl flex items-center gap-4 ${step.completed ? 'bg-green-50' : 'bg-slate-50'}`}>
              {step.completed ? (
                <div className="w-9 h-9 flex items-center justify-center bg-green-500 text-white rounded-full flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 flex items-center justify-center bg-slate-200 text-slate-500 font-bold rounded-full flex-shrink-0">
                  {index + 1}
                </div>
              )}
              <div>
                <p className={`font-bold ${step.completed ? 'text-green-800' : 'text-slate-800'}`}>{step.text}</p>
                <p className="text-sm text-slate-500">{step.subtext}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Live API Health with Support Actions */}
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black uppercase tracking-wider text-blue-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5" />
            API Health
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700 h-8 py-0" onClick={() => window.open('/docs#support', '_self')}>Chat</Button>
            <Button variant="outline" className="h-8 py-0" onClick={() => window.open('/docs#troubleshooting', '_self')}>Troubleshoot</Button>
            <Button className="bg-red-600 hover:bg-red-700 h-8 py-0" onClick={() => window.open('/contact-us', '_self')}>SOS</Button>
          </div>
        </div>
        <ApiHealthMonitor />
      </div>

      {/* Performance */}
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-black uppercase tracking-wider text-blue-900 flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5" />
          Performance Overview
        </h3>
        <ConversionChart data={mockTrendData} />
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <CompactMetricCard
          label="Total Businesses"
          value={mockCounts.totalBusinesses.toLocaleString()}
          icon={UsersIcon}
          colorScheme="blue"
          trend={{ value: 5.2, isPositive: true }}
        />
        <CompactMetricCard
          label="Businesses with Credit"
          value={mockCounts.businessesWithCredit.toLocaleString()}
          icon={CheckCircle}
          colorScheme="green"
          trend={{ value: 7.8, isPositive: true }}
        />
        <CompactMetricCard
          label="Applications Started"
          value={mockCounts.applicationsStarted.toLocaleString()}
          icon={TrendingUp}
          colorScheme="purple"
          trend={{ value: 12.3, isPositive: true }}
        />
        <CompactMetricCard
          label="Approved"
          value={mockCounts.approved.toLocaleString()}
          icon={CheckCircle}
          colorScheme="green"
          trend={{ value: 15.4, isPositive: true }}
        />
        <CompactMetricCard
          label="Ineligible"
          value={mockCounts.ineligible.toLocaleString()}
          icon={AlertCircle}
          colorScheme="orange"
          trend={{ value: 2.1, isPositive: false }}
        />
      </div>

      {/* Funnel Effectiveness & Conversion */}
      <MetricSection 
        title="Funnel Effectiveness & Conversion" 
        description="Measures how effectively credit data drives product interest"
        icon={TrendingUp}
        delay={0.1}
      >
        <CompactMetricCard
          label="Application Conversion Rate"
          value={`${mockFunnelMetrics.applicationConversionRate.toFixed(1)}%`}
          colorScheme="blue"
          trend={{ value: 3.2, isPositive: true }}
        />
        <CompactMetricCard
          label="Approval Rate"
          value={`${mockFunnelMetrics.approvalRate.toFixed(1)}%`}
          colorScheme="green"
          trend={{ value: 1.8, isPositive: true }}
        />
        <CompactMetricCard
          label="Ineligible Ratio"
          value={`${mockFunnelMetrics.ineligibleRatio.toFixed(1)}%`}
          colorScheme="orange"
          trend={{ value: 0.5, isPositive: false }}
        />
        <CompactMetricCard
          label="Credit Activation Rate"
          value={`${mockFunnelMetrics.creditActivationRate.toFixed(1)}%`}
          colorScheme="purple"
          trend={{ value: 4.2, isPositive: true }}
        />
      </MetricSection>

      {/* Product Performance & Engagement */}
      <MetricSection 
        title="Product Performance & Engagement" 
        description="Operational efficiency and application funnel metrics"
        icon={Clock}
        delay={0.2}
      >
        <CompactMetricCard
          label="Avg Time to Approval"
          value={`${mockProductMetrics.avgTimeToApproval} days`}
          colorScheme="blue"
          trend={{ value: 15.2, isPositive: true }}
        />
        <CompactMetricCard
          label="Avg Credit Limit"
          value={`$${(mockProductMetrics.avgCreditLimit / 1000).toFixed(0)}K`}
          colorScheme="green"
          trend={{ value: 8.5, isPositive: true }}
        />
        <CompactMetricCard
          label="Application Drop-off"
          value={`${mockProductMetrics.applicationDropoffRate}%`}
          colorScheme="orange"
          trend={{ value: 2.3, isPositive: false }}
        />
        <CompactMetricCard
          label="Re-application Rate"
          value={`${mockProductMetrics.reApplicationRate}%`}
          colorScheme="purple"
          trend={{ value: 5.1, isPositive: true }}
        />
      </MetricSection>

      {/* Portfolio Quality & Risk */}
      <MetricSection 
        title="Portfolio Quality & Risk" 
        description="Credit quality and risk assessment metrics"
        icon={Shield}
        delay={0.3}
      >
        <CompactMetricCard
          label="Delinquency Rate"
          value={`${mockRiskMetrics.delinquencyRate}%`}
          colorScheme="red"
          trend={{ value: 0.3, isPositive: false }}
        />
        <CompactMetricCard
          label="Default Rate"
          value={`${mockRiskMetrics.defaultRate}%`}
          colorScheme="red"
          trend={{ value: 0.1, isPositive: false }}
        />
        <CompactMetricCard
          label="Portfolio Utilization"
          value={`${mockRiskMetrics.portfolioUtilizationRate}%`}
          colorScheme="blue"
          trend={{ value: 4.2, isPositive: true }}
        />
        <CompactMetricCard
          label="Risk Score"
          value="Low"
          colorScheme="green"
        />
      </MetricSection>

      {/* Revenue & Growth */}
      <MetricSection 
        title="Revenue & Growth Metrics" 
        description="Financial performance and growth trajectory"
        icon={DollarSign}
        delay={0.4}
      >
        <CompactMetricCard
          label="Avg Revenue per Business"
          value={`$${mockRevenueMetrics.arpb.toLocaleString()}`}
          colorScheme="green"
          trend={{ value: 12.5, isPositive: true }}
        />
        <CompactMetricCard
          label="Revenue per Approved Account"
          value={`$${mockRevenueMetrics.revenuePerApprovedAccount.toLocaleString()}`}
          colorScheme="green"
          trend={{ value: 18.3, isPositive: true }}
        />
        <CompactMetricCard
          label="MoM Growth Rate"
          value={`${mockRevenueMetrics.momGrowthRate}%`}
          colorScheme="purple"
          trend={{ value: 2.1, isPositive: true }}
        />
        <CompactMetricCard
          label="QoQ Growth Rate"
          value={`${mockRevenueMetrics.qoqGrowthRate}%`}
          colorScheme="purple"
          trend={{ value: 5.4, isPositive: true }}
        />
      </MetricSection>

      {/* Predictive & Future-Focused */}
      <MetricSection 
        title="Predictive & Future-Focused Metrics" 
        description="Forecasting and strategic targeting insights"
        icon={Target}
        delay={0.5}
      >
        <CompactMetricCard
          label="Projected Approvals (6M)"
          value={mockPredictiveMetrics.projectedApprovalVolume6m.toLocaleString()}
          colorScheme="blue"
          icon={Zap}
        />
        <CompactMetricCard
          label="Projected Conversion Lift"
          value={`+${mockPredictiveMetrics.projectedConversionLift}%`}
          colorScheme="green"
          icon={TrendingUp}
        />
        <CompactMetricCard
          label="Marketing Qualified Opportunities"
          value={mockPredictiveMetrics.marketingQualifiedOpportunities.toLocaleString()}
          colorScheme="purple"
          icon={Target}
        />
        <CompactMetricCard
          label="Growth Confidence"
          value="High"
          colorScheme="green"
          icon={CheckCircle}
        />
      </MetricSection>

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Intelligence / Developer / Activity sections, moved into Overview */}
      <CompetitiveIntelligence />
      <ApiPlayground />
      <DataFlowVisualization />
      <DeveloperHub />
      <WebhookEventStream />
      <WhiteLabelPreview />
      <ExecutiveSummary />
      <SmartAlerts />
    </motion.div>
  );
};

export default OverviewTab;
