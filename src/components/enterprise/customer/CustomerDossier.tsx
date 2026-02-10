import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail,
  Globe,
  User,
  TrendingUp,
  TrendingDown,
  Heart,
  CreditCard,
  DollarSign,
  Activity,
  FileText,
  Clock,
  
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Bookmark
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { toast } from 'sonner';

interface CustomerDossierProps {
  customer: {
    id: string;
    businessName: string;
    legalName: string;
    dba?: string;
    industry: string;
    naicsCode: string;
    segment: 'micro' | 'small' | 'mid-market';
    region: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    yearsInBusiness: number;
    employeeCount: number;
    annualRevenue: number;
    assignedRM: {
      name: string;
      email: string;
      phone: string;
    };
    rhs: number;
    rhsStatus: 'growing' | 'stable' | 'declining';
    rhsTrendData: Array<{ month: string; value: number }>;
    riskTier: 'low' | 'medium' | 'high';
    creditScore: number;
    relationshipStage: 'prospect' | 'new' | 'growing' | 'mature' | 'at-risk';
    totalExposure: number;
    totalDeposits: number;
    products: Array<{
      name: string;
      status: 'active' | 'approved' | 'not-held';
      balance?: number;
      utilization?: number;
    }>;
    recentNotes: Array<{
      id: string;
      author: string;
      content: string;
      timestamp: string;
    }>;
    auditLog: Array<{
      id: string;
      action: string;
      user: string;
      timestamp: string;
    }>;
  };
  onClose: () => void;
  onAddNote: (note: string) => void;
}

const SEGMENT_CONFIG = {
  'micro': { label: 'Micro Business', color: 'hsl(var(--chart-1))' },
  'small': { label: 'Small Business', color: 'hsl(var(--chart-2))' },
  'mid-market': { label: 'Mid-Market', color: 'hsl(var(--chart-3))' },
};

const RISK_CONFIG = {
  'low': { label: 'Low Risk', color: 'hsl(var(--chart-2))', icon: CheckCircle },
  'medium': { label: 'Medium Risk', color: 'hsl(var(--chart-4))', icon: AlertTriangle },
  'high': { label: 'High Risk', color: 'hsl(var(--destructive))', icon: AlertTriangle },
};

const STAGE_CONFIG = {
  'prospect': { label: 'Prospect', color: 'hsl(var(--muted-foreground))' },
  'new': { label: 'New Customer', color: 'hsl(var(--chart-1))' },
  'growing': { label: 'Growing', color: 'hsl(var(--chart-2))' },
  'mature': { label: 'Mature', color: 'hsl(var(--chart-3))' },
  'at-risk': { label: 'At Risk', color: 'hsl(var(--destructive))' },
};

export const CustomerDossier: React.FC<CustomerDossierProps> = ({
  customer,
  onClose,
  onAddNote,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'notes' | 'audit'>('overview');
  const [newNote, setNewNote] = useState('');

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const segmentConfig = SEGMENT_CONFIG[customer.segment];
  const riskConfig = RISK_CONFIG[customer.riskTier];
  const stageConfig = STAGE_CONFIG[customer.relationshipStage];
  const RiskIcon = riskConfig.icon;

  const getRHSColor = (rhs: number) => {
    if (rhs >= 80) return 'hsl(var(--chart-2))';
    if (rhs >= 60) return 'hsl(var(--primary))';
    if (rhs >= 40) return 'hsl(var(--chart-4))';
    return 'hsl(var(--destructive))';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-2xl h-full bg-background overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border z-10">
          <div className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{customer.businessName}</h2>
                  <p className="text-sm text-muted-foreground">{customer.legalName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success('Customer bookmarked')}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Bookmark className="h-5 w-5 text-muted-foreground" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-1 text-xs font-medium rounded-full"
                style={{ backgroundColor: `${segmentConfig.color}15`, color: segmentConfig.color }}
              >
                {segmentConfig.label}
              </span>
              <span
                className="px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1"
                style={{ backgroundColor: `${riskConfig.color}15`, color: riskConfig.color }}
              >
                <RiskIcon className="h-4 w-4" />
                {riskConfig.label}
              </span>
              <span
                className="px-2.5 py-1 text-xs font-medium rounded-full"
                style={{ backgroundColor: `${stageConfig.color}15`, color: stageConfig.color }}
              >
                {stageConfig.label}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                {customer.naicsCode}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pb-0">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'products', label: 'Products' },
              { id: 'notes', label: 'Notes' },
              { id: 'audit', label: 'Audit Log' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* RHS Card */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Relationship Health</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {customer.rhsStatus === 'growing' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : customer.rhsStatus === 'declining' ? (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    ) : (
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium capitalize">{customer.rhsStatus}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span 
                    className="text-4xl font-bold"
                    style={{ color: getRHSColor(customer.rhs) }}
                  >
                    {customer.rhs}
                  </span>
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>

                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={customer.rhsTrendData}>
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={getRHSColor(customer.rhs)}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Total Exposure</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(customer.totalExposure)}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Total Deposits</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(customer.totalDeposits)}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Credit Score</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{customer.creditScore}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Years in Business</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">{customer.yearsInBusiness}</p>
                </div>
              </div>

              {/* Business Info */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Business Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{customer.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{customer.email}</span>
                  </div>
                  {customer.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={customer.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {customer.website}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned RM */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Relationship Manager</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{customer.assignedRM.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.assignedRM.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-3">
              {customer.products.map((product) => (
                <div
                  key={product.name}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{product.name}</p>
                        <span className={`text-xs font-medium ${
                          product.status === 'active' ? 'text-success' :
                          product.status === 'approved' ? 'text-warning' : 'text-muted-foreground'
                        }`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {product.balance !== undefined && (
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(product.balance)}</p>
                        {product.utilization !== undefined && (
                          <p className="text-xs text-muted-foreground">{product.utilization}% utilized</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Add Note */}
              <div className="bg-card border border-border rounded-xl p-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="w-full p-3 bg-muted border-none rounded-lg text-sm resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      if (newNote.trim()) {
                        onAddNote(newNote);
                        setNewNote('');
                      }
                    }}
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Notes List */}
              {customer.recentNotes.map((note) => (
                <div key={note.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{note.author}</span>
                    <span className="text-xs text-muted-foreground">{note.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{note.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-2">
              {customer.auditLog.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{log.action}</p>
                    <p className="text-xs text-muted-foreground">by {log.user}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {log.timestamp}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
