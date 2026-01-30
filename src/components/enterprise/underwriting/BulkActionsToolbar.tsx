import React from 'react';
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
  Zap
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
}) => {
  const hasSelection = selectedCount > 0;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Selection Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={allSelected ? onDeselectAll : onSelectAll}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">
              {hasSelection ? (
                <>
                  <span className="font-semibold text-slate-800">{selectedCount.toLocaleString()}</span> selected
                </>
              ) : (
                'Select all'
              )}
            </span>
          </div>
          
          {hasSelection && (
            <button
              onClick={onDeselectAll}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                  onClick={onBulkApprove}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>

                {/* Bulk Review */}
                <button
                  onClick={onBulkReview}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Flag Review
                </button>

                {/* Bulk Decline */}
                <button
                  onClick={onBulkDecline}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Decline
                </button>

                {/* Assign Reviewer */}
                <button
                  onClick={onAssignReviewer}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Users className="w-4 h-4" />
                  Assign
                </button>

                <div className="w-px h-6 bg-slate-200 mx-1" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Export */}
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
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
            className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-800">Processing bulk action...</p>
                <p className="text-xs text-blue-600">AI decisioning engine is evaluating {selectedCount} applications</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats Bar */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">AI Auto-Approved</p>
            <p className="text-sm font-semibold text-slate-800">847 today</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Pending Review</p>
            <p className="text-sm font-semibold text-slate-800">156 items</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Queue Depth</p>
            <p className="text-sm font-semibold text-slate-800">2.4K apps</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <Send className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg. Decision Time</p>
            <p className="text-sm font-semibold text-slate-800">4.2 min</p>
          </div>
        </div>
      </div>
    </div>
  );
};
