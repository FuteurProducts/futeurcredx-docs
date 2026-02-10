// Enterprise Custom Report Builder - Metric picker and drag-drop canvas

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronRight, 
  GripVertical, 
  Trash2, 
  Play, 
  Save,
  BarChart3,
  Table,
  LayoutGrid,
  PieChart,
  Info
} from 'lucide-react';
import type { MetricNode, ReportBlock } from './types';

interface CustomReportBuilderProps {
  metricTree: MetricNode[];
  onRun: (blocks: ReportBlock[]) => void;
  onSave: (name: string, blocks: ReportBlock[]) => void;
}

const visualizationOptions = [
  { id: 'table', label: 'Table', icon: Table },
  { id: 'chart', label: 'Chart', icon: BarChart3 },
  { id: 'card', label: 'Card', icon: LayoutGrid },
  { id: 'heatmap', label: 'Heatmap', icon: PieChart },
] as const;

export const CustomReportBuilder: React.FC<CustomReportBuilderProps> = ({
  metricTree,
  onRun,
  onSave,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['portfolio', 'underwriting']));
  const [selectedBlocks, setSelectedBlocks] = useState<ReportBlock[]>([]);
  const [templateName, setTemplateName] = useState('Custom Report');

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const addMetric = (metric: MetricNode) => {
    if (selectedBlocks.some((b) => b.metricId === metric.id)) return;
    
    const newBlock: ReportBlock = {
      id: `block-${Date.now()}`,
      metricId: metric.id,
      label: metric.label,
      visualization: 'table',
      order: selectedBlocks.length,
    };
    setSelectedBlocks((prev) => [...prev, newBlock]);
  };

  const removeBlock = (blockId: string) => {
    setSelectedBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  const updateBlockVisualization = (blockId: string, viz: ReportBlock['visualization']) => {
    setSelectedBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, visualization: viz } : b))
    );
  };

  const renderMetricNode = (node: MetricNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedBlocks.some((b) => b.metricId === node.id);

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
            isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            } else {
              addMetric(node);
            }
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="w-4" />
          )}
          <span className={`text-sm ${hasChildren ? 'font-medium' : ''}`}>{node.label}</span>
          {isSelected && !hasChildren && (
            <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
              Added
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderMetricNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 gap-4 h-full"
    >
      {/* Left - Metric Tree */}
      <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Available Metrics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Click metrics to add to your report
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {metricTree.map((node) => renderMetricNode(node))}
        </div>
      </div>

      {/* Right - Builder Canvas */}
      <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="flex-1 h-12 px-3 text-lg font-semibold bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedBlocks.length} metrics selected
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedBlocks.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Info className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Select metrics from the left panel</p>
                <p className="text-sm">to build your custom report</p>
              </div>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={selectedBlocks}
              onReorder={setSelectedBlocks}
              className="space-y-3"
            >
              <AnimatePresence>
                {selectedBlocks.map((block) => (
                  <Reorder.Item
                    key={block.id}
                    value={block}
                    className="bg-muted/50 rounded-xl border border-border p-3 cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{block.label}</p>
                      </div>
                      
                      {/* Visualization Selector */}
                      <div className="flex items-center gap-1 bg-background rounded-md p-1">
                        {visualizationOptions.map((viz) => (
                          <button
                            key={viz.id}
                            onClick={() => updateBlockVisualization(block.id, viz.id as ReportBlock['visualization'])}
                            className={`p-1.5 rounded transition-colors ${
                              block.visualization === viz.id
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted'
                            }`}
                            title={viz.label}
                          >
                            <viz.icon className="h-4 w-4" />
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => removeBlock(block.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border flex gap-2">
          <button
            onClick={() => onSave(templateName, selectedBlocks)}
            disabled={selectedBlocks.length === 0}
            className="flex-1 flex items-center justify-center gap-2 h-10 border border-border rounded-xl font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save Template
          </button>
          <button
            onClick={() => onRun(selectedBlocks)}
            disabled={selectedBlocks.length === 0}
            className="flex-1 flex items-center justify-center gap-2 h-10 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            Run Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomReportBuilder;
