import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Download,
  RefreshCw,
  Users,
  Layers,
  Zap,
  Check
} from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkApprove: () => void;
  onBulkDecline: () => void;
  onBulkReview: () => void;
  onExport: () => void;
  onRefresh: () => void;
  onAssignReviewer: () => void;
  isProcessing?: boolean;
  approvedCount?: number;
  declinedCount?: number;
  reviewCount?: number;
}

export const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkApprove,
  onBulkDecline,
  onBulkReview,
  onExport,
  onRefresh,
  onAssignReviewer,
  isProcessing = false,
  approvedCount = 0,
  declinedCount = 0,
  reviewCount = 0,
}) => {
  const hasSelection = selectedCount > 0;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  const [bulkFeedback, setBulkFeedback] = useState<'approved' | 'declined' | 'review' | null>(null);

  useEffect(() => {
    if (bulkFeedback) {
      const timer = setTimeout(() => setBulkFeedback(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [bulkFeedback]);

  const handleBulkApprove = () => {
    setBulkFeedback('approved');
    onBulkApprove();
  };

  const handleBulkDecline = () => {
    setBulkFeedback('declined');
    onBulkDecline();
  };

  const handleBulkReview = () => {
    setBulkFeedback('review');
    onBulkReview();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Selection Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={allSelected ? onDeselectAll : onSelectAll}
              className="w-4 h-4 rounded border-border text-info focus:ring-info"
            />
            <span className="text-sm text-muted-foreground">
              {hasSelection ? (
                <>
                  <span className="font-semibold text-foreground">{selectedCount.toLocaleString()}</span> selected
                </>
              ) : (
                'Select all'
              )}
            </span>
          </div>
          
          {hasSelection && (
            <button
              onClick={onDeselectAll}
              className="text-sm text-info hover:text-info/80 font-medium"
            >
              Clear selection
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {hasSelection && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2"
              >
                {/* Bulk Approve */}
                <button
                  onClick={handleBulkApprove}
                  disabled={isProcessing || bulkFeedback !== null}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                    bulkFeedback === 'approved'
                      ? 'bg-success/80 text-white scale-95'
                      : 'bg-success hover:bg-success/90 text-white'
                  }`}
                >
                  {bulkFeedback === 'approved' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Approved!
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </>
                  )}
                </button>

                {/* Bulk Review */}
                <button
                  onClick={handleBulkReview}
                  disabled={isProcessing || bulkFeedback !== null}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                    bulkFeedback === 'review'
                      ? 'bg-warning/80 text-white scale-95'
                      : 'bg-warning hover:bg-warning/90 text-white'
                  }`}
                >
                  {bulkFeedback === 'review' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Flagged!
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      Flag Review
                    </>
                  )}
                </button>

                {/* Bulk Decline */}
                <button
                  onClick={handleBulkDecline}
                  disabled={isProcessing || bulkFeedback !== null}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                    bulkFeedback === 'declined'
                      ? 'bg-destructive/80 text-white scale-95'
                      : 'bg-destructive hover:bg-destructive/90 text-white'
                  }`}
                >
                  {bulkFeedback === 'declined' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Declined!
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Decline
                    </>
                  )}
                </button>

                {/* Assign Reviewer */}
                <button
                  onClick={onAssignReviewer}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-2 border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Users className="w-4 h-4" />
                  Assign
                </button>

                <div className="w-px h-6 bg-border mx-1" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Export */}
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-2 border border-border hover:bg-muted text-foreground rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Processing Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 p-3 bg-info/10 border border-info/20 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-info border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="text-sm font-medium text-info">Processing bulk action...</p>
                <p className="text-xs text-info">AI decisioning engine is evaluating {selectedCount} applications</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats Bar */}
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Approved</p>
            <p className="text-sm font-semibold text-foreground">{847 + approvedCount} today</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-warning" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
            <p className="text-sm font-semibold text-foreground">{156 + reviewCount} items</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
            <XCircle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Declined</p>
            <p className="text-sm font-semibold text-foreground">{declinedCount} this session</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-info" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Queue Depth</p>
            <p className="text-sm font-semibold text-foreground">{totalCount} apps</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <Send className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg. Decision Time</p>
            <p className="text-sm font-semibold text-foreground">4.2 min</p>
          </div>
        </div>
      </div>
    </div>
  );
};
