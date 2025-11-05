import { DashboardLayout } from "@/components/dashboard/dashboard/DashboardLayout";
import { MetricSection, CompactMetricCard } from "@/components/dashboard/dashboard/MetricSection";
import { ConversionChart } from "@/components/dashboard/dashboard/ConversionChart";
import { ApiHealthMonitor } from "@/components/dashboard/dashboard/ApiHealthMonitor";
import { ROICalculator } from "@/components/dashboard/dashboard/ROICalculator";
import { WebhookEventStream } from "@/components/dashboard/dashboard/WebhookEventStream";
import { DeveloperHub } from "@/components/dashboard/dashboard/DeveloperHub";
import { SmartAlerts } from "@/components/dashboard/dashboard/SmartAlerts";
import { CompetitiveIntelligence } from "@/components/dashboard/dashboard/CompetitiveIntelligence";
import { ApiPlayground } from "@/components/dashboard/dashboard/ApiPlayground";
import { DataFlowVisualization } from "@/components/dashboard/dashboard/DataFlowVisualization";
import { WhiteLabelPreview } from "@/components/dashboard/dashboard/WhiteLabelPreview";
import { ExecutiveSummary } from "@/components/dashboard/dashboard/ExecutiveSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Clock,
  DollarSign,
  Shield,
  Target,
  Zap
} from "lucide-react";
import { FunnelMetrics, ProductMetrics, RiskMetrics, RevenueMetrics, PredictiveMetrics, DashboardCounts, TrendData } from "@/types/dashboard";

// Mock data - In production, this would come from your API
const mockCounts: DashboardCounts = {
  totalBusinesses: 25000,
  businessesWithCredit: 18500,
  applicationsStarted: 3200,
  approved: 2400,
  ineligible: 6500,
};

const mockFunnelMetrics: FunnelMetrics = {
  applicationConversionRate: (mockCounts.applicationsStarted / mockCounts.businessesWithCredit) * 100,
  approvalRate: (mockCounts.approved / mockCounts.applicationsStarted) * 100,
  ineligibleRatio: (mockCounts.ineligible / mockCounts.totalBusinesses) * 100,
  creditActivationRate: (mockCounts.businessesWithCredit / mockCounts.totalBusinesses) * 100,
};

const mockProductMetrics: ProductMetrics = {
  avgTimeToApproval: 2.3,
  avgCreditLimit: 125000,
  applicationDropoffRate: 8.5,
  reApplicationRate: 12.3,
};

const mockRiskMetrics: RiskMetrics = {
  delinquencyRate: 1.8,
  defaultRate: 0.4,
  portfolioUtilizationRate: 62.5,
};

const mockRevenueMetrics: RevenueMetrics = {
  arpb: 4250,
  revenuePerApprovedAccount: 8900,
  momGrowthRate: 12.5,
  qoqGrowthRate: 38.2,
};

const mockPredictiveMetrics: PredictiveMetrics = {
  projectedApprovalVolume6m: 15800,
  projectedConversionLift: 8.5,
  marketingQualifiedOpportunities: 4200,
};

const mockTrendData: TrendData[] = [
  { month: 'Jan', applications: 450, approved: 340, conversionRate: 16.2, approvalRate: 75.6 },
  { month: 'Feb', applications: 520, approved: 385, conversionRate: 17.1, approvalRate: 74.0 },
  { month: 'Mar', applications: 580, approved: 445, conversionRate: 17.8, approvalRate: 76.7 },
  { month: 'Apr', applications: 615, approved: 468, conversionRate: 18.2, approvalRate: 76.1 },
  { month: 'May', applications: 670, approved: 512, conversionRate: 18.9, approvalRate: 76.4 },
  { month: 'Jun', applications: 725, approved: 558, conversionRate: 19.5, approvalRate: 77.0 },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              FuteurCredX Partner Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Enterprise API Platform • Real-time Business Credit Intelligence
            </p>
          </div>
          <div className="px-4 py-2 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-lg shadow-sm">
            <p className="text-xs text-muted-foreground">API Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-success rounded-full pulse-glow" />
              <span className="text-sm font-semibold">All Systems Operational</span>
            </div>
          </div>
        </div>

        {/* Live API Health Monitor */}
        <ApiHealthMonitor />

        {/* Tabs for organized content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
            <TabsTrigger value="developer">Developer</TabsTrigger>
            <TabsTrigger value="activity">Live Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">{/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Performance Overview</h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive business credit performance and forecasting metrics
          </p>
        </div>

        {/* Top KPIs - Funnel Counts */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <CompactMetricCard
            label="Total Businesses"
            value={mockCounts.totalBusinesses.toLocaleString()}
            icon={Users}
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

        {/* Funnel Effectiveness & Conversion Metrics */}
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

        {/* Performance Chart */}
        <ConversionChart data={mockTrendData} />

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

        {/* Smart Alerts */}
        <SmartAlerts />
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-8">
            <CompetitiveIntelligence />
          </TabsContent>

          <TabsContent value="developer" className="space-y-8">
            <ApiPlayground />
            <DataFlowVisualization />
            <DeveloperHub />
          </TabsContent>

          <TabsContent value="activity" className="space-y-8">
            <WebhookEventStream />
            <WhiteLabelPreview />
            <ExecutiveSummary />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Index;
