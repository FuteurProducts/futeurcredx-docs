// Enterprise Reports Page - Bank-grade reporting infrastructure
// Uses modular components from src/components/enterprise/reports/
// Wired to BFF reportsService with graceful fallback to mock data

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { reportsService } from '@/services/bff';
import { withFallback } from '@/utils/withFallback';
import { useReportPolling } from '@/hooks/useReportPolling';
import { logger } from '@/utils/logger';
import { PILOT_CONFIG } from '@/data/demoData';
import type { ReportJob } from '@/services/bff/types';
import { DataLineageFooter } from '@/components/shared/DataLineageFooter';
import { BankDisclaimer } from '@/components/shared/BankDisclaimer';
import {
  ReportsGlobalControls,
  ReportLibraryPanel,
  ReportConfigPanel,
  ReportHistoryPanel,
  ReportPreviewDrawer,
  CustomReportBuilder,
  mockReportTemplates,
  mockGeneratedReports,
  mockMetricTree,
  type ReportFilters,
  type ReportTemplate,
  type GeneratedReport,
  type ReportConfig,
  type ReportBlock,
} from '@/components/enterprise/reports';

// ---------- Adapter: BFF ReportJob → UI GeneratedReport ----------
function adaptReportJobToGenerated(job: ReportJob): GeneratedReport {
  const statusMap: Record<string, GeneratedReport['status']> = {
    queued: 'pending',
    processing: 'processing',
    completed: 'ready',
    failed: 'failed',
  };

  const typeLabel = (job.reportType || 'custom')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const params = (job.parameters ?? {}) as Record<string, unknown>;

  return {
    id: job.id,
    templateId: job.reportType,
    name: (params.name as string) || typeLabel,
    format: (params.format as GeneratedReport['format']) || 'pdf',
    scope: params.product
      ? `${params.product} — ${params.segment ?? 'All'} — ${params.geography ?? 'National'}`
      : 'All — All — National',
    period: (params.timeWindow as string) || '30d',
    status: statusMap[job.status] ?? job.status as GeneratedReport['status'],
    generatedAt: job.completedAt || job.createdAt,
    generatedBy: 'system',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Temporary placeholder for missing fileSize
    fileSize: undefined as unknown as string,
    downloadUrl: job.artifactUrl || '#',
    metadata: {
      dataSources: ['LUMIQ AI Signal Engine', 'Bureau Data Feed'],
      lastDataRefresh: job.completedAt || job.createdAt,
      transformationSummary: 'Aggregated by segment',
      tenantId: PILOT_CONFIG.bankId,
      confidenceScore: 0.95,
      recordCount: 0,
    },
  };
}

const Reports: React.FC = () => {
  const { toast } = useToast();
  const { portfolioId } = usePortfolio();

  // View state: library or custom builder
  const [activeView, setActiveView] = useState<'library' | 'custom'>('library');

  // Filters state
  const [filters, setFilters] = useState<ReportFilters>({
    product: 'All',
    segment: 'All',
    geography: 'National',
    relationshipStage: 'All',
    timeWindow: '30d',
    environment: 'sandbox',
  });

  // Selected template for configuration
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  // Reports history — initialised empty; populated from BFF or fallback
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);

  // Preview drawer state
  const [previewReport, setPreviewReport] = useState<GeneratedReport | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Generating state
  const [isGenerating, setIsGenerating] = useState(false);

  // ---------- Fetch report history from BFF (with fallback) ----------
  const fetchReportHistory = useCallback(async () => {
    if (!portfolioId) return;
    const result = await withFallback(
      () =>
        reportsService
          .list(portfolioId)
          .then((r) => (r.data || []).map(adaptReportJobToGenerated)),
      mockGeneratedReports,
      'Report History',
    );
    setGeneratedReports(result.data);
  }, [portfolioId]);

  // Re-fetch whenever the active portfolio changes
  useEffect(() => {
    fetchReportHistory();
  }, [fetchReportHistory]);

  // ---------- Polling hook for async report generation ----------
  const { startPolling } = useReportPolling({
    onComplete: (completedJob) => {
      const adapted = adaptReportJobToGenerated(completedJob);
      setGeneratedReports((prev) => {
        // Replace the in-progress placeholder, or prepend
        const idx = prev.findIndex((r) => r.id === adapted.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = adapted;
          return updated;
        }
        return [adapted, ...prev];
      });
      setIsGenerating(false);
      setPreviewReport(adapted);
      setIsPreviewOpen(true);
      toast({
        title: 'Report ready',
        description: `${adapted.name} has been generated and is ready for download.`,
      });
    },
    onError: (errorMsg) => {
      setIsGenerating(false);
      toast({
        title: 'Report failed',
        description: errorMsg,
        variant: 'destructive',
      });
    },
  });

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
  };

  const handleGenerateReport = async (config: ReportConfig) => {
    setIsGenerating(true);
    toast({ title: 'Generating report', description: `${config.name} is being compiled...` });

    // Attempt BFF-based async generation
    if (portfolioId) {
      try {
        const response = await reportsService.create(portfolioId, {
          reportType: config.templateId as ReportJob['reportType'],
          parameters: {
            name: config.name,
            format: config.format,
            product: config.filters.product,
            segment: config.filters.segment,
            geography: config.filters.geography,
            timeWindow: config.filters.timeWindow,
          },
        });

        const job = response.data;
        if (job?.id) {
          // Add an in-progress placeholder to the history immediately
          const placeholder = adaptReportJobToGenerated(job);
          setGeneratedReports((prev) => [placeholder, ...prev]);

          // Begin polling — onComplete / onError callbacks handle the rest
          startPolling(job.id);
          return;
        }
      } catch (err) {
        logger.warn('[Reports] BFF create failed, falling back to mock generation', err);
      }
    }

    // ---------- Fallback: mock local generation ----------
    setTimeout(() => {
      const newReport: GeneratedReport = {
        id: `rpt-${Date.now()}`,
        templateId: config.templateId,
        name: config.name,
        format: config.format,
        scope: `${config.filters.product} — ${config.filters.segment} — ${config.filters.geography}`,
        period: config.filters.timeWindow,
        status: 'ready',
        generatedAt: new Date().toISOString(),
        generatedBy: 'analyst@partnerbank.com',
        fileSize: config.format === 'csv' ? '456 KB' : config.format === 'xlsx' ? '1.1 MB' : '2.4 MB',
        downloadUrl: '#',
        metadata: {
          dataSources: ['LUMIQ AI Signal Engine', 'Bureau Data Feed'],
          lastDataRefresh: new Date().toISOString(),
          transformationSummary: 'Aggregated by segment',
          tenantId: PILOT_CONFIG.bankId,
          confidenceScore: 0.95,
          recordCount: 12345,
        },
      };
      setGeneratedReports((prev) => [newReport, ...prev]);
      setIsGenerating(false);
      setPreviewReport(newReport);
      setIsPreviewOpen(true);
      toast({ title: 'Report ready', description: `${config.name} has been generated and is ready for download.` });
    }, 2000);
  };

  const handleViewReport = (report: GeneratedReport) => {
    setPreviewReport(report);
    setIsPreviewOpen(true);
  };

  const handleDownloadReport = async (report: GeneratedReport) => {
    // Attempt BFF signed-URL download first
    if (portfolioId && report.downloadUrl && report.downloadUrl !== '#') {
      try {
        const res = await reportsService.download(portfolioId, report.id);
        if (res.data?.url) {
          window.open(res.data.url, '_blank');
          toast({ title: 'Download started', description: `${report.name} is downloading.` });
          return;
        }
      } catch (err) {
        logger.warn('[Reports] BFF download failed, using local fallback', err);
      }
    }

    // ---------- Fallback: generate a local sample file ----------
    const sampleData = `Report: ${report.name}\nGenerated: ${report.generatedAt}\nScope: ${report.scope}\nPeriod: ${report.period}\n\nBusiness ID,Business Name,LumiqAI Score,Risk Tier,Pre-Qualified,Product\nBIZ-001,Stellar Dynamics LLC,78,Low,Yes,Business Line of Credit\nBIZ-002,Metro Logistics Corp,71,Medium,Yes,Working Capital\nBIZ-003,Apex Construction Group,82,Low,Yes,Equipment Financing\nBIZ-004,Sunrise Healthcare Partners,85,Low,No,-\nBIZ-005,GreenLeaf Organics,65,Medium,Yes,Term Loan\nBIZ-006,Coastal Hospitality Group,58,High,No,-\nBIZ-007,Precision Manufacturing Co,76,Low,No,-\nBIZ-008,TechVenture Solutions,88,Low,Yes,Business Credit Card\nBIZ-009,Urban Retail Partners,62,Medium,No,-\nBIZ-010,Pacific Marine Services,73,Medium,No,-\n`;
    const mimeType = report.format === 'csv' ? 'text/csv' : 'text/plain';
    const ext = report.format === 'csv' ? 'csv' : report.format === 'xlsx' ? 'csv' : 'txt';
    const blob = new Blob([sampleData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '-').toLowerCase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Download started', description: `${report.name} is downloading.` });
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewReport(null);
  };

  const handleRefreshHistory = async () => {
    await fetchReportHistory();
    toast({ title: 'History refreshed', description: 'Report history is up to date.' });
  };

  const handleRunCustomReport = (blocks: ReportBlock[]) => {
    toast({ title: "Custom report running", description: `Report with ${blocks.length} metrics is being compiled.` });
  };

  const handleSaveCustomReport = (name: string, blocks: ReportBlock[]) => {
    localStorage.setItem(`lumiq_custom_report_${name}`, JSON.stringify(blocks));
    toast({ title: "Template saved", description: `"${name}" saved with ${blocks.length} metric blocks.` });
  };

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Sticky Global Controls */}
      <ReportsGlobalControls
        filters={filters}
        onFiltersChange={setFilters}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <div className="px-4 lg:px-6 pt-2"><BankDisclaimer compact /></div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {activeView === 'library' ? (
            <>
              {/* Report Library + Configuration Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Report Library - 2 columns */}
                <div className="lg:col-span-2">
                  <ReportLibraryPanel
                    templates={mockReportTemplates}
                    selectedTemplateId={selectedTemplate?.id || null}
                    onSelectTemplate={handleTemplateSelect}
                  />
                </div>

                {/* Configuration Panel - 1 column */}
                <div className="lg:col-span-1">
                  <ReportConfigPanel
                    template={selectedTemplate}
                    filters={filters}
                    onGenerate={handleGenerateReport}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>

              {/* Report History */}
              <div className="text-xs text-muted-foreground mb-2">Showing 1–10 of 156 reports</div>
              <ReportHistoryPanel
                reports={generatedReports}
                onView={handleViewReport}
                onDownload={handleDownloadReport}
                onRefresh={handleRefreshHistory}
              />
            </>
          ) : (
            /* Custom Report Builder */
            <CustomReportBuilder
              metricTree={mockMetricTree}
              onRun={handleRunCustomReport}
              onSave={handleSaveCustomReport}
            />
          )}
        </motion.div>
      </div>

      {/* Data Source Footer */}
      <div className="px-4 lg:px-6 pb-4">
        <DataLineageFooter
          meta={{
            lastUpdated: new Date().toISOString(),
            dataSources: ['LUMIQ AI Signal Engine', 'Bureau Data Feed'],
          }}
          onRefresh={handleRefreshHistory}
        />
      </div>

      {/* Preview Drawer */}
      <ReportPreviewDrawer
        report={previewReport}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onDownload={handleDownloadReport}
      />
    </div>
  );
};

export default Reports;
