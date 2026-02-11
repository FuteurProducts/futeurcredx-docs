// Campaigns & Conversion — Campaign funnel analytics, segment conversion, and campaign management
// Data-driven: all values from chaseDemoData.ts, all formatting from formatters.ts

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Copy,
  DollarSign,
  Download,
  Eye,
  FileCheck,
  Megaphone,
  Pause,
  Plus,
  Send,
  Target,
  Timer,
  Users,
} from 'lucide-react';

import { KPICard } from '@/components/enterprise/shared/KPICard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CAMPAIGNS,
  CAMPAIGN_SUMMARY,
  CONVERSION_BY_SEGMENT,
  SEGMENTS,
  type Campaign,
} from '@/data/chaseDemoData';
import { useToast } from '@/hooks/use-toast';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  getStatusBadgeClass,
  getThresholdColorClass,
  getThresholdStatus,
} from '@/lib/formatters';
import { cn } from '@/lib/utils';

// ---- Internal sub-components (kept in single file per spec) ----

interface FunnelStageProps {
  label: string;
  count: number;
  percent: number;
  isLast?: boolean;
  widthPercent: number;
}

const FunnelStage: React.FC<FunnelStageProps> = ({
  label,
  count,
  percent,
  isLast = false,
  widthPercent,
}) => (
  <div className="flex items-center gap-2 flex-1 min-w-0">
    <div className="flex-1 min-w-0">
      <div className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1">
        {label}
      </div>
      <div
        className="bg-primary/15 rounded-xl px-3 py-2 transition-all duration-200"
        style={{ width: `${Math.max(widthPercent, 30)}%` }}
      >
        <div className="text-base font-bold text-foreground tabular-nums">
          {formatNumber(count)}
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">
          {formatPercent(percent)}
        </div>
      </div>
    </div>
    {!isLast && (
      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
    )}
  </div>
);

interface CampaignCardProps {
  campaign: Campaign;
  onAction: (action: string, campaignName: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onAction }) => {
  const healthLabel = campaign.health === 'on_track' ? 'ON TRACK' : 'BELOW TARGET';

  const funnelStages: FunnelStageProps[] = [
    {
      label: 'Pushed',
      count: campaign.funnel.pushed,
      percent: 1,
      widthPercent: 100,
    },
    {
      label: 'Viewed',
      count: campaign.funnel.viewed,
      percent: campaign.viewRate,
      widthPercent: campaign.viewRate * 100,
    },
    {
      label: 'Applied',
      count: campaign.funnel.applied,
      percent: campaign.applyRate,
      widthPercent: campaign.applyRate * 100 * 3,
    },
    {
      label: 'Approved',
      count: campaign.funnel.approved,
      percent: campaign.approvalRate,
      widthPercent: campaign.approvalRate * 100,
      isLast: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 space-y-4 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-foreground truncate">
                {campaign.name}
              </h3>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider',
                  getStatusBadgeClass(campaign.health),
                )}
              >
                {healthLabel}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {campaign.targetCriteria}
              </span>
              <span className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                {campaign.startDate} - {campaign.endDate}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {campaign.owner}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Funnel */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-start gap-1">
          {funnelStages.map((stage) => (
            <FunnelStage key={stage.label} {...stage} />
          ))}
        </div>
        {/* Overall conversion bar */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">
              End-to-End Conversion
            </span>
            <span className="text-xs font-semibold text-foreground tabular-nums">
              {formatPercent(
                campaign.funnel.approved / campaign.funnel.pushed,
              )}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-200"
              style={{
                width: `${(campaign.funnel.approved / campaign.funnel.pushed) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Approved volume */}
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-emerald-500" />
        <span className="text-lg font-bold text-emerald-600">
          {formatCurrency(campaign.approvedVolume)} approved volume
        </span>
      </div>

      {/* Warning callout */}
      {campaign.warning && (
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800 p-4">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-amber-700 dark:text-amber-400">
            {campaign.warning}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction('view', campaign.name)}
          className="transition-all duration-200 hover:scale-[1.02]"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('pause', campaign.name)}
          className="transition-all duration-200"
        >
          <Pause className="h-4 w-4" />
          Pause
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('extend', campaign.name)}
          className="transition-all duration-200"
        >
          <ArrowRight className="h-4 w-4" />
          Extend
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('clone', campaign.name)}
          className="transition-all duration-200"
        >
          <Copy className="h-4 w-4" />
          Clone
        </Button>
      </div>
    </motion.div>
  );
};

// ---- Conversion table row mini progress bar ----

interface MiniBarProps {
  value: number;
  status?: 'ok' | 'warning' | 'at_risk';
}

const MiniBar: React.FC<MiniBarProps> = ({ value, status = 'ok' }) => {
  const barColor =
    status === 'at_risk'
      ? 'bg-rose-500'
      : status === 'warning'
        ? 'bg-amber-500'
        : 'bg-emerald-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-200', barColor)}
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <span className="text-sm tabular-nums font-medium w-12 text-right">
        {formatPercent(value)}
      </span>
    </div>
  );
};

// ---- Main page component ----

const Campaigns: React.FC = () => {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    product: '',
    segment: '',
    startDate: '',
    endDate: '',
  });

  // Sort conversion data by end-to-end (highest first)
  const sortedConversion = useMemo(
    () => [...CONVERSION_BY_SEGMENT].sort((a, b) => b.endToEnd - a.endToEnd),
    [],
  );

  const handleCampaignAction = (action: string, campaignName: string) => {
    switch (action) {
      case 'view':
        toast({ title: 'Campaign detail view -- coming soon' });
        break;
      case 'pause':
        toast({ title: `Campaign paused`, description: campaignName });
        break;
      case 'extend':
        toast({
          title: 'Campaign extended by 30 days',
          description: campaignName,
        });
        break;
      case 'clone':
        toast({
          title: 'Campaign cloned -- edit and activate',
          description: campaignName,
        });
        break;
    }
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.product || !newCampaign.segment) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    toast({ title: 'Campaign created successfully', description: newCampaign.name });
    setNewCampaign({ name: '', product: '', segment: '', startDate: '', endDate: '' });
    setModalOpen(false);
  };

  const handleExport = () => {
    toast({ title: 'Conversion data exported', description: 'CSV file downloaded' });
  };

  const handleSegmentRowClick = (segment: string) => {
    toast({
      title: `Segment: ${segment}`,
      description: 'Drill-down analytics coming soon',
    });
  };

  // KPI threshold calculations
  const viewRateStatus = getThresholdStatus(
    CAMPAIGN_SUMMARY.avgViewRate,
    0.25,
    0.35,
    false,
  );
  const applyRateStatus = getThresholdStatus(
    CAMPAIGN_SUMMARY.avgApplyRate,
    0.05,
    0.10,
    false,
  );
  const approvalRateStatus = getThresholdStatus(
    CAMPAIGN_SUMMARY.avgApprovalRate,
    0.60,
    0.75,
    false,
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Campaigns & Conversion
            </h1>
            <p className="text-base text-muted-foreground mt-2">
              Campaign performance funnels, conversion analytics, and segment
              comparison
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="flex-shrink-0">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </motion.div>

        {/* KPI Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          <KPICard
            label="Active Campaigns"
            value={CAMPAIGN_SUMMARY.activeCampaigns}
            formatValue={(v) => String(v)}
            icon={<Megaphone className="h-4 w-4" />}
            tooltip="Number of currently running campaigns"
          />
          <KPICard
            label="Offers Pushed (90d)"
            value={CAMPAIGN_SUMMARY.offersPushed}
            formatValue={(v) => formatNumber(v)}
            icon={<Send className="h-4 w-4" />}
            tooltip="Total offers pushed across all active campaigns"
          />
          <KPICard
            label="View Rate"
            value={Math.round(CAMPAIGN_SUMMARY.avgViewRate * 100)}
            formatValue={(v) => `${v}%`}
            status={viewRateStatus === 'ok' ? 'ok' : viewRateStatus === 'warning' ? 'warning' : 'danger'}
            icon={<Eye className="h-4 w-4" />}
            tooltip="Average view rate across campaigns. OK >35%, Warning 25-35%, Danger <25%"
          />
          <KPICard
            label="Application Rate"
            value={Math.round(CAMPAIGN_SUMMARY.avgApplyRate * 100)}
            formatValue={(v) => `${v}%`}
            status={applyRateStatus === 'ok' ? 'ok' : applyRateStatus === 'warning' ? 'warning' : 'danger'}
            icon={<FileCheck className="h-4 w-4" />}
            tooltip="Average application rate. OK >10%, Warning 5-10%, Danger <5%"
          />
          <KPICard
            label="Approval Rate"
            value={Math.round(CAMPAIGN_SUMMARY.avgApprovalRate * 100)}
            formatValue={(v) => `${v}%`}
            status={approvalRateStatus === 'ok' ? 'ok' : approvalRateStatus === 'warning' ? 'warning' : 'danger'}
            icon={<Target className="h-4 w-4" />}
            tooltip="Average approval rate. OK >75%, Warning 60-75%, Danger <60%"
          />
          <KPICard
            label="Revenue Booked"
            value={CAMPAIGN_SUMMARY.revenueBooked}
            formatValue={(v) => formatCurrency(v)}
            status="ok"
            icon={<DollarSign className="h-4 w-4" />}
            tooltip="Total revenue booked from campaign-driven approvals"
          />
        </motion.div>

        {/* Campaign Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Active Campaigns
          </h2>
          {CAMPAIGNS.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onAction={handleCampaignAction}
            />
          ))}
        </motion.div>

        {/* Segment Conversion Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="rounded-2xl border border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-lg font-semibold text-foreground">
              Segment Conversion Comparison
            </h2>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Segment
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">
                    View Rate
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">
                    Apply Rate
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">
                    Approval Rate
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider w-36">
                    End-to-End
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedConversion.map((row) => {
                  const endToEndThreshold = getThresholdStatus(
                    row.endToEnd,
                    0.05,
                    0.07,
                    false,
                  );

                  return (
                    <tr
                      key={row.segment}
                      onClick={() => handleSegmentRowClick(row.segment)}
                      className="border-b border-border/50 last:border-0 cursor-pointer hover:bg-muted/50 transition-colors duration-150"
                    >
                      <td className="py-3 px-3 font-medium text-foreground">
                        {row.segment}
                      </td>
                      <td className="py-3 px-3">
                        <MiniBar value={row.viewRate} />
                      </td>
                      <td className="py-3 px-3">
                        <MiniBar value={row.applyRate} />
                      </td>
                      <td className="py-3 px-3">
                        <MiniBar value={row.approvalRate} />
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            'text-sm font-bold tabular-nums',
                            getThresholdColorClass(endToEndThreshold),
                          )}
                        >
                          {formatPercent(row.endToEnd)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Insight callout */}
          <div className="mx-6 mb-6 flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800 p-4">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-amber-700 dark:text-amber-400">
              Construction and Food Service underperforming -- consider A/B test
              on offer messaging and channel mix.
            </span>
          </div>
        </motion.div>
      </div>

      {/* New Campaign Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Configure a new targeted campaign for your portfolio segments.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                placeholder="e.g., Q2 LOC Push -- Retail"
                value={newCampaign.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewCampaign((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Product</Label>
              <Select
                value={newCampaign.product}
                onValueChange={(v: string) =>
                  setNewCampaign((prev) => ({ ...prev, product: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOC">Line of Credit (LOC)</SelectItem>
                  <SelectItem value="TERM">Term Loan</SelectItem>
                  <SelectItem value="SBA">SBA 7(a)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Segment</Label>
              <Select
                value={newCampaign.segment}
                onValueChange={(v: string) =>
                  setNewCampaign((prev) => ({ ...prev, segment: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  {SEGMENTS.map((seg) => (
                    <SelectItem key={seg.id} value={seg.id}>
                      {seg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewCampaign((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewCampaign((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campaigns;
