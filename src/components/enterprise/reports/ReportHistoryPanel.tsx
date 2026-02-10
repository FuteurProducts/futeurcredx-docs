// Enterprise Report History Panel - Generated reports with status and actions

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Eye, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  FileText,
  FileSpreadsheet,
  Table,
  RefreshCw
} from 'lucide-react';
import type { GeneratedReport } from './types';
import { exportToCSV } from '@/lib/export';
import toast from 'react-hot-toast';

interface ReportHistoryPanelProps {
  reports: GeneratedReport[];
  onView: (report: GeneratedReport) => void;
  onDownload: (report: GeneratedReport) => void;
  onRefresh: () => void;
}

const FormatIcon: React.FC<{ format: string }> = ({ format }) => {
  switch (format) {
    case 'pdf':
      return <FileText className="h-4 w-4 text-destructive" />;
    case 'xlsx':
      return <FileSpreadsheet className="h-4 w-4 text-success" />;
    case 'csv':
      return <Table className="h-4 w-4 text-info" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
};

const StatusBadge: React.FC<{ status: GeneratedReport['status'] }> = ({ status }) => {
  const config = {
    pending: { icon: Clock, bg: 'bg-warning/10', text: 'text-warning', label: 'Pending' },
    processing: { icon: Loader2, bg: 'bg-info/10', text: 'text-info', label: 'Processing' },
    ready: { icon: CheckCircle2, bg: 'bg-success/10', text: 'text-success', label: 'Ready' },
    failed: { icon: XCircle, bg: 'bg-destructive/10', text: 'text-destructive', label: 'Failed' },
  };

  const { icon: Icon, bg, text, label } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon className={`h-3 w-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {label}
    </span>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const ReportHistoryPanel: React.FC<ReportHistoryPanelProps> = ({
  reports,
  onView,
  onDownload,
  onRefresh,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl border border-border shadow-sm h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Reports</h2>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-muted rounded-md transition-colors"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Reports Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Report
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Scope
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Generated
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.map((report, index) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FormatIcon format={report.format} />
                    <div>
                      <p className="text-sm font-medium text-foreground truncate max-w-[180px]">
                        {report.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{report.period}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-muted-foreground truncate max-w-[140px]">
                    {report.scope}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(report.generatedAt)}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {report.status === 'ready' && (
                      <>
                        <button
                          onClick={() => onView(report)}
                          className="p-1.5 hover:bg-muted rounded transition-colors"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => onDownload(report)}
                          className="p-1.5 hover:bg-muted rounded transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => {
                            exportToCSV([{
                              Name: report.name,
                              Format: report.format,
                              Scope: report.scope,
                              Period: report.period,
                              Status: report.status,
                              'Generated At': report.generatedAt,
                              'Generated By': report.generatedBy,
                              'File Size': report.fileSize ?? '',
                              'Record Count': report.metadata.recordCount,
                              'Confidence Score': report.metadata.confidenceScore,
                              'Data Sources': report.metadata.dataSources.join('; '),
                            }], `report-${report.id}`);
                            toast.success('Report CSV exported successfully');
                          }}
                          className="p-1.5 hover:bg-muted rounded transition-colors"
                          title="Export as CSV"
                        >
                          <Table className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </>
                    )}
                    {report.status === 'failed' && (
                      <button
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Retry"
                      >
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No reports generated yet
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReportHistoryPanel;
