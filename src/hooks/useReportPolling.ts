/**
 * useReportPolling Hook
 * Polls for async report job completion
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { reportsService } from '@/services/bff';
import type { ReportJob, ReportStatus } from '@/services/bff/types';
import { usePortfolio } from '@/contexts/PortfolioContext';

interface UseReportPollingOptions {
  pollInterval?: number; // ms between polls (default 3000)
  maxAttempts?: number;  // max polls before giving up (default 60)
  onComplete?: (report: ReportJob) => void;
  onError?: (error: string) => void;
}

interface UseReportPollingResult {
  report: ReportJob | null;
  status: ReportStatus | null;
  isPolling: boolean;
  error: string | null;
  progress: number; // 0-100
  startPolling: (reportId: string) => void;
  stopPolling: () => void;
}

export function useReportPolling(
  options: UseReportPollingOptions = {}
): UseReportPollingResult {
  const {
    pollInterval = 3000,
    maxAttempts = 60,
    onComplete,
    onError,
  } = options;

  const { portfolioId } = usePortfolio();
  const [report, setReport] = useState<ReportJob | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reportIdRef = useRef<string | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const pollOnce = useCallback(async () => {
    if (!reportIdRef.current || !portfolioId) return;

    try {
      const response = await reportsService.getById(portfolioId, reportIdRef.current);
      const job = response.data;
      if (!job) return;
      
      setReport(job);

      if (job.status === 'completed') {
        stopPolling();
        onComplete?.(job);
      } else if (job.status === 'failed') {
        stopPolling();
        setError(job.errorMessage || 'Report generation failed');
        onError?.(job.errorMessage || 'Report generation failed');
      } else {
        // Still processing - increment attempts
        setAttempts(prev => {
          const next = prev + 1;
          if (next >= maxAttempts) {
            stopPolling();
            setError('Report generation timed out');
            onError?.('Report generation timed out');
          }
          return next;
        });
      }
    } catch (err) {
      console.error('Report poll error:', err);
      setAttempts(prev => prev + 1);
    }
  }, [portfolioId, maxAttempts, onComplete, onError, stopPolling]);

  const startPolling = useCallback((reportId: string) => {
    // Clean up any existing polling
    stopPolling();
    
    // Reset state
    setError(null);
    setAttempts(0);
    setReport(null);
    reportIdRef.current = reportId;
    setIsPolling(true);

    // Initial poll
    pollOnce();

    // Start interval
    intervalRef.current = setInterval(pollOnce, pollInterval);
  }, [pollInterval, pollOnce, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Calculate progress (estimate based on attempts)
  const progress = report?.status === 'completed' 
    ? 100 
    : report?.status === 'failed'
    ? 0
    : Math.min(90, (attempts / maxAttempts) * 100);

  return {
    report,
    status: report?.status || null,
    isPolling,
    error,
    progress,
    startPolling,
    stopPolling,
  };
}
