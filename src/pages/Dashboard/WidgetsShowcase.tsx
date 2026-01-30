import { DashboardLayout } from "@/components/dashboard/dashboard/DashboardLayout";
import {
  CreditScoreWidget,
  CreditJourneyWidget,
  ApprovalPathWidget,
  SignalBreakdownCard,
  BureauDataDisplay,
  WebhookConfigPanel,
  SDKDownloadSection,
  SandboxEnvironmentToggle,
} from "@/components/widgets";
import type { CreditScoreData } from "@/components/widgets/CreditScoreWidget";
import type { CreditJourneyData } from "@/components/widgets/CreditJourneyWidget";
import type { ApprovalPathData } from "@/components/widgets/ApprovalPathWidget";
import type { SignalBreakdownData } from "@/components/widgets/SignalBreakdownCard";
import type { BureauScore } from "@/components/widgets/BureauDataDisplay";
import type { WebhookEndpoint, WebhookEvent } from "@/components/widgets/WebhookConfigPanel";
import type { Environment, EnvironmentConfig } from "@/components/widgets/SandboxEnvironmentToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Mock data for CreditScoreWidget
const mockCreditScoreData: CreditScoreData = {
  score: 742,
  maxScore: 850,
  grade: "A",
  trend: "up",
  trendValue: 12,
  lastUpdated: "2026-01-19",
  eligibleProducts: 4,
  totalProducts: 5,
};

// Mock data for CreditJourneyWidget
const mockJourneyData: CreditJourneyData = {
  currentStage: 2,
  stages: [
    { id: "1", name: "Verify", description: "Identity verification", status: "completed", completedAt: "2026-01-10" },
    { id: "2", name: "Stabilize", description: "Banking analysis", status: "completed", completedAt: "2026-01-12" },
    { id: "3", name: "Build", description: "Credit building", status: "current", requirements: ["6+ months history", "Active tradelines"] },
    { id: "4", name: "Qualify", description: "Pre-qualification", status: "locked" },
    { id: "5", name: "Unlock", description: "Product access", status: "locked" },
  ],
  nextUnlock: "Qualify stage",
  estimatedReadiness: "2-3 weeks",
};

// Mock data for ApprovalPathWidget
const mockApprovalData: ApprovalPathData = {
  currentProduct: "Basic Line",
  targetProduct: "Growth Credit Line",
  approvalProbability: 78,
  estimatedUnlockDate: "Feb 15, 2026",
  actions: [
    { id: "1", title: "Verify business identity", description: "Complete KYB verification", status: "completed", impact: "high", category: "identity" },
    { id: "2", title: "Connect bank account", description: "Link primary business account", status: "completed", impact: "high", category: "banking" },
    { id: "3", title: "Build payment history", description: "3+ months of on-time payments", status: "in_progress", impact: "medium", estimatedDays: 45, category: "credit" },
    { id: "4", title: "Submit compliance docs", description: "Upload required documentation", status: "pending", impact: "low", estimatedDays: 7, category: "compliance" },
  ],
};

// Mock data for SignalBreakdownCard
const mockSignalData: SignalBreakdownData = {
  overallScore: 82,
  overallGrade: "B+",
  lastUpdated: "2026-01-19",
  factors: [
    { id: "1", name: "Payment History", score: 92, maxScore: 100, status: "strong", category: "payments", description: "No missed payments" },
    { id: "2", name: "Revenue Stability", score: 78, maxScore: 100, status: "good", category: "banking", description: "Consistent cash flow" },
    { id: "3", name: "Credit Utilization", score: 65, maxScore: 100, status: "fair", category: "tradelines", description: "Moderate utilization" },
    { id: "4", name: "Business Age", score: 88, maxScore: 100, status: "strong", category: "identity", description: "5+ years operating" },
    { id: "5", name: "Public Records", score: 45, maxScore: 100, status: "weak", category: "registry", description: "Recent filings detected", isSubstituted: true },
  ],
};

// Mock data for BureauDataDisplay
const mockBureauScores: BureauScore[] = [
  { bureau: "dnb", scoreName: "PAYDEX Score", score: 82, maxScore: 100, trend: "up", trendValue: 5, lastUpdated: "2026-01-15", status: "active", details: [{ label: "Payment Index", value: 82 }, { label: "Risk Level", value: "Low" }] },
  { bureau: "experian", scoreName: "Intelliscore Plus", score: 76, maxScore: 100, trend: "stable", trendValue: 0, lastUpdated: "2026-01-14", status: "active", details: [{ label: "Score Range", value: "Medium-High" }] },
  { bureau: "equifax", scoreName: "Business Credit Risk", score: 545, maxScore: 700, trend: "up", trendValue: 12, lastUpdated: "2026-01-13", status: "active", details: [{ label: "Risk Class", value: 2 }] },
];

// Mock data for WebhookConfigPanel
const mockWebhookEndpoints: WebhookEndpoint[] = [
  { id: "1", url: "https://api.example.com/webhooks/lumiq", events: ["score.updated", "application.approved"], secretKey: "whsec_abc123xyz", isActive: true, createdAt: "2026-01-10", lastTriggered: "2026-01-19", failureCount: 0 },
];

const mockWebhookEvents: WebhookEvent[] = [
  { id: "score.updated", name: "Score Updated", description: "When a credit score changes", category: "score" },
  { id: "score.threshold", name: "Score Threshold", description: "When score crosses a threshold", category: "score" },
  { id: "application.submitted", name: "Application Submitted", description: "New application received", category: "application" },
  { id: "application.approved", name: "Application Approved", description: "Application approved", category: "application" },
];

// Mock environment configs
const mockSandboxConfig: EnvironmentConfig = {
  apiUrl: "https://sandbox.lumiqai.com/v1",
  keysAvailable: 3,
  lastSync: "2026-01-19",
  status: "active",
};

const mockProductionConfig: EnvironmentConfig = {
  apiUrl: "https://api.lumiqai.com/v1",
  keysAvailable: 2,
  lastSync: "2026-01-18",
  status: "active",
};

const WidgetsShowcase = () => {
  const [environment, setEnvironment] = useState<Environment>("sandbox");
  const [webhookEndpoints, setWebhookEndpoints] = useState<WebhookEndpoint[]>(mockWebhookEndpoints);

  const handleAddWebhook = (data: { url: string; events: string[] }) => {
    const newEndpoint: WebhookEndpoint = {
      id: Date.now().toString(),
      url: data.url,
      events: data.events,
      secretKey: `whsec_${Math.random().toString(36).substring(7)}`,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      failureCount: 0,
    };
    setWebhookEndpoints([...webhookEndpoints, newEndpoint]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Widget Components Showcase
            </h1>
            <p className="text-muted-foreground mt-1">
              Enterprise-grade embeddable components for partner integration
            </p>
          </div>
          <SandboxEnvironmentToggle 
            currentEnvironment={environment}
            sandboxConfig={mockSandboxConfig}
            productionConfig={mockProductionConfig}
            onSwitch={setEnvironment}
            variant="minimal"
          />
        </div>

        <Tabs defaultValue="credit" className="space-y-6">
          <TabsList className="bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-sm">
            <TabsTrigger value="credit">Credit Widgets</TabsTrigger>
            <TabsTrigger value="journey">Journey & Approval</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="developer">Developer Tools</TabsTrigger>
          </TabsList>

          {/* Credit Widgets Tab */}
          <TabsContent value="credit" className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Credit Score Widget - Full</h3>
                <p className="text-sm text-muted-foreground">
                  Embeddable credit score display with gauge visualization
                </p>
                <CreditScoreWidget data={mockCreditScoreData} variant="full" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Compact Variant</h3>
                <p className="text-sm text-muted-foreground">
                  Minimal footprint for inline displays
                </p>
                <CreditScoreWidget data={mockCreditScoreData} variant="compact" />
                
                <h3 className="text-lg font-semibold mt-6">Mini Variant</h3>
                <CreditScoreWidget data={mockCreditScoreData} variant="mini" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Multi-Bureau Data Display</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive view of credit data from multiple bureaus
              </p>
              <BureauDataDisplay scores={mockBureauScores} variant="grid" />
            </div>
          </TabsContent>

          {/* Journey & Approval Tab */}
          <TabsContent value="journey" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Credit Journey Widget - Vertical</h3>
                <p className="text-sm text-muted-foreground">
                  Visual progress tracker for credit applications
                </p>
                <CreditJourneyWidget data={mockJourneyData} variant="vertical" />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Horizontal Variant</h3>
                <p className="text-sm text-muted-foreground">
                  Compact horizontal layout for dashboards
                </p>
                <CreditJourneyWidget data={mockJourneyData} variant="horizontal" />
                
                <h3 className="text-lg font-semibold mt-6">Compact Variant</h3>
                <CreditJourneyWidget data={mockJourneyData} variant="compact" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Approval Path Widget</h3>
              <p className="text-sm text-muted-foreground">
                Gamified unlock path with action tracking
              </p>
              <ApprovalPathWidget data={mockApprovalData} variant="full" />
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Signal Breakdown Card - Full</h3>
              <p className="text-sm text-muted-foreground">
                Detailed factor analysis with weights and trends
              </p>
              <SignalBreakdownCard data={mockSignalData} variant="full" expandable />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Compact Signal View</h3>
                <SignalBreakdownCard data={mockSignalData} variant="compact" />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Minimal Signal View</h3>
                <SignalBreakdownCard data={mockSignalData} variant="minimal" />
              </div>
            </div>
          </TabsContent>

          {/* Developer Tools Tab */}
          <TabsContent value="developer" className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Environment Toggle - Full</h3>
              <p className="text-sm text-muted-foreground">
                Switch between sandbox and production environments
              </p>
              <SandboxEnvironmentToggle
                currentEnvironment={environment}
                sandboxConfig={mockSandboxConfig}
                productionConfig={mockProductionConfig}
                onSwitch={setEnvironment}
                variant="full"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">SDK Download Section</h3>
              <p className="text-sm text-muted-foreground">
                Official SDK packages for various platforms
              </p>
              <SDKDownloadSection />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Webhook Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Configure webhook endpoints for real-time events
              </p>
              <WebhookConfigPanel
                endpoints={webhookEndpoints}
                availableEvents={mockWebhookEvents}
                onAdd={handleAddWebhook}
                onDelete={(id) => setWebhookEndpoints(webhookEndpoints.filter(e => e.id !== id))}
                onToggle={(id, active) => setWebhookEndpoints(webhookEndpoints.map(e => e.id === id ? { ...e, isActive: active } : e))}
                onTest={(id) => console.log('Testing webhook:', id)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WidgetsShowcase;
