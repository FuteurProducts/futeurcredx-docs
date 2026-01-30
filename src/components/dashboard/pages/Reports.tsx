// Enterprise Reports Page - Bank-grade reporting infrastructure
// Uses modular components from src/components/enterprise/reports/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    // Simulate report generation
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
        fileSize: '1.2 MB',
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
    }, 2000);
  };

  const handleViewReport = (report: GeneratedReport) => {
    setPreviewReport(report);
    setIsPreviewOpen(true);
  };

  const handleDownloadReport = (report: GeneratedReport) => {
    // In real implementation, trigger download
    console.log('Downloading report:', report.id);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewReport(null);
  };

  const handleRefreshHistory = () => {
    // In real implementation, refetch from server
    console.log('Refreshing report history');
  };

  const handleRunCustomReport = (blocks: ReportBlock[]) => {
    console.log('Running custom report with blocks:', blocks);
  };

  const handleSaveCustomReport = (name: string, blocks: ReportBlock[]) => {
    console.log('Saving custom report template:', name, blocks);
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
