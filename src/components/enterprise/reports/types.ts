// Enterprise Reports System Types - Bank-grade reporting infrastructure

export type ReportFormat = 'pdf' | 'csv' | 'xlsx';

export type ReportStatus = 'pending' | 'processing' | 'ready' | 'failed';

export type DeliveryOption = 'download' | 'email' | 'schedule';

export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly';

export type ReportCategory = 
  | 'portfolio'
  | 'underwriting'
  | 'customer'
  | 'compliance'
  | 'api';

export interface ReportTemplate {
  id: string;
  name: string;
  category: ReportCategory;
  description: string;
  supportedFormats: ReportFormat[];
  defaultFormat: ReportFormat;
  options: ReportOption[];
}

export interface ReportOption {
  id: string;
  label: string;
  type: 'checkbox' | 'select' | 'text';
  defaultValue: boolean | string;
  options?: string[]; // For select type
}

export interface ReportFilters {
  product: string;
  segment: string;
  geography: string;
  relationshipStage: string;
  timeWindow: string;
  environment: 'sandbox' | 'production';
}

export interface ReportConfig {
  templateId: string;
  name: string;
  format: ReportFormat;
  filters: ReportFilters;
  options: Record<string, boolean | string>;
  delivery: DeliveryOption;
  schedule?: {
    frequency: ScheduleFrequency;
    dayOfWeek?: string;
    time?: string;
    recipients?: string[];
  };
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  name: string;
  format: ReportFormat;
  scope: string;
  period: string;
  status: ReportStatus;
  generatedAt: string;
  generatedBy: string;
  fileSize?: string;
  downloadUrl?: string;
  metadata: ReportMetadata;
}

export interface ReportMetadata {
  dataSources: string[];
  lastDataRefresh: string;
  transformationSummary: string;
  tenantId: string;
  confidenceScore: number;
  recordCount: number;
}

export interface MetricNode {
  id: string;
  label: string;
  category: string;
  children?: MetricNode[];
  selected?: boolean;
}

export interface ReportBlock {
  id: string;
  metricId: string;
  label: string;
  visualization: 'table' | 'chart' | 'card' | 'heatmap';
  order: number;
}

export interface CustomReportTemplate {
  id: string;
  name: string;
  blocks: ReportBlock[];
  createdAt: string;
  createdBy: string;
}
