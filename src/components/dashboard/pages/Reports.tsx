// Enterprise Reports Page - Bank-grade reporting infrastructure
// Uses modular components from src/components/enterprise/reports/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
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

const Reports: React.FC = () => {
  const { toast } = useToast();

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

  // Reports history
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(mockGeneratedReports);

  // Preview drawer state
  const [previewReport, setPreviewReport] = useState<GeneratedReport | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Generating state
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
  };

  const handleGenerateReport = (config: ReportConfig) => {
    setIsGenerating(true);
    toast({ title: "Generating report", description: `${config.name} is being compiled...` });
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
        generatedBy: 'current.user@bank.com',
        fileSize: config.format === 'csv' ? '456 KB' : config.format === 'xlsx' ? '1.1 MB' : '2.4 MB',
        downloadUrl: '#',
        metadata: {
          dataSources: ['LumiqAI Score Engine', 'Bureau Data Feed'],
          lastDataRefresh: new Date().toISOString(),
          transformationSummary: 'Aggregated by segment',
          tenantId: 'BANK-001',
          confidenceScore: 0.95,
          recordCount: 12345,
        },
      };
      setGeneratedReports((prev) => [newReport, ...prev]);
      setIsGenerating(false);
      setPreviewReport(newReport);
      setIsPreviewOpen(true);
      toast({ title: "Report ready", description: `${config.name} has been generated and is ready for download.` });
    }, 2000);
  };

  const handleViewReport = (report: GeneratedReport) => {
    setPreviewReport(report);
    setIsPreviewOpen(true);
  };

  const handleDownloadReport = (report: GeneratedReport) => {
    // Generate a real downloadable file with sample data
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
    toast({ title: "Download started", description: `${report.name} is downloading.` });
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewReport(null);
  };

  const handleRefreshHistory = () => {
    toast({ title: "History refreshed", description: "Report history is up to date." });
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
