/**
 * Compliance & Audit Panel
 * SOC 2 status, audit logs, data classification, GDPR/CCPA controls
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, CheckCircle, Download,
  ExternalLink, Search, Database, Lock, Eye, Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  mockComplianceStatuses,
  mockAuditLogs,
  mockDataClassifications,
} from '../mockData';
import type { ComplianceFramework } from '../types';

const frameworkLabels: Record<ComplianceFramework, { name: string; description: string }> = {
  SOC2: { name: 'SOC 2 Type II', description: 'Service Organization Control' },
  GDPR: { name: 'GDPR', description: 'EU General Data Protection Regulation' },
  CCPA: { name: 'CCPA', description: 'California Consumer Privacy Act' },
  PCI_DSS: { name: 'PCI DSS', description: 'Payment Card Industry Data Security' },
  FFIEC: { name: 'FFIEC', description: 'Federal Financial Institutions Examination' },
  OCC: { name: 'OCC', description: 'Office of the Comptroller of the Currency' },
};

export const CompliancePanel: React.FC = () => {
  const [auditFilter, setAuditFilter] = useState('');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">Compliant</Badge>;
      case 'partially_compliant':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Partial</Badge>;
      case 'non_compliant':
        return <Badge variant="destructive">Non-Compliant</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = !auditFilter || 
      log.action.toLowerCase().includes(auditFilter.toLowerCase()) ||
      log.actor.toLowerCase().includes(auditFilter.toLowerCase()) ||
      log.resource.toLowerCase().includes(auditFilter.toLowerCase());
    const matchesRisk = !selectedRiskLevel || log.riskLevel === selectedRiskLevel;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Compliance & Audit</h2>
          <p className="text-sm text-muted-foreground">
            Security certifications, audit trails, and data governance
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            toast.success('Audit report export initiated', {
              description: 'Your compliance audit report will be ready for download shortly.'
            });
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Audit Report
        </Button>
      </div>

      <Tabs defaultValue="certifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="data">Data Classification</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
        </TabsList>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockComplianceStatuses.map((status) => {
              const framework = frameworkLabels[status.framework];
              return (
                <motion.div
                  key={status.framework}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className={status.status === 'compliant' ? 'border-chart-2/20' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className={`h-5 w-5 ${
                            status.status === 'compliant' ? 'text-chart-2' :
                            status.status === 'partially_compliant' ? 'text-warning' :
                            'text-destructive'
                          }`} />
                          <CardTitle className="text-base">{framework.name}</CardTitle>
                        </div>
                        {getStatusBadge(status.status)}
                      </div>
                      <CardDescription>{framework.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        {status.lastAuditDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Last Audit</span>
                            <span>{new Date(status.lastAuditDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {status.nextAuditDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Next Audit</span>
                            <span>{new Date(status.nextAuditDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        {status.findings.length > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Open Findings</span>
                            <Badge variant="destructive">{status.findings.length}</Badge>
                          </div>
                        )}
                        {status.certificateUrl && (
                          <Button variant="link" className="p-0 h-auto text-sm" asChild>
                            <a href={status.certificateUrl} target="_blank" rel="noopener noreferrer">
                              View Certificate <ExternalLink className="h-4 w-4 ml-1" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Open Findings */}
          {mockComplianceStatuses.some(s => s.findings.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Open Compliance Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockComplianceStatuses.flatMap(s => s.findings).map((finding) => (
                    <div key={finding.id} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{finding.title}</span>
                            <Badge variant={finding.severity === 'critical' || finding.severity === 'high' ? 'destructive' : 'secondary'}>
                              {finding.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{finding.description}</p>
                          <p className="text-sm mt-2">
                            <span className="font-medium">Remediation: </span>
                            {finding.remediation}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">Due</p>
                          <p className="font-medium">{finding.dueDate ? new Date(finding.dueDate).toLocaleDateString() : 'TBD'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Audit Trail</CardTitle>
                  <CardDescription>All API and data access events</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={auditFilter}
                      onChange={(e) => setAuditFilter(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <div className="flex gap-1 bg-muted rounded-lg p-1">
                    {['all', 'high', 'medium', 'low'].map((level) => (
                      <Button
                        key={level}
                        variant={(!selectedRiskLevel && level === 'all') || selectedRiskLevel === level ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedRiskLevel(level === 'all' ? null : level)}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        log.riskLevel === 'high' ? 'bg-destructive' :
                        log.riskLevel === 'medium' ? 'bg-warning' :
                        'bg-chart-2'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-background px-2 py-0.5 rounded">
                            {log.action}
                          </code>
                          <span className="text-sm text-muted-foreground">on</span>
                          <span className="text-sm">{log.resource}</span>
                          {log.resourceId && (
                            <code className="text-xs text-muted-foreground">{log.resourceId}</code>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Badge variant="outline" className="text-xs">
                              {log.actorType}
                            </Badge>
                            {log.actor}
                          </span>
                          <span>IP: {log.ipAddress}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getRiskBadge(log.riskLevel)}
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Classification Tab */}
        <TabsContent value="data" className="space-y-4">
          {mockDataClassifications.map((classification) => (
            <Card key={classification.category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {classification.category}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      PII Level: {classification.piiLevel.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      Retention: {Math.round(classification.retentionDays / 365)} years
                    </Badge>
                    {classification.encryptionRequired && (
                      <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                        <Lock className="h-4 w-4 mr-1" />
                        Encrypted
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Field</th>
                        <th className="text-left py-2 px-3 font-medium">Type</th>
                        <th className="text-center py-2 px-3 font-medium">PII</th>
                        <th className="text-center py-2 px-3 font-medium">Encrypted</th>
                        <th className="text-left py-2 px-3 font-medium">Masking Rule</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classification.fields.map((field) => (
                        <tr key={field.name} className="border-b last:border-0">
                          <td className="py-2 px-3 font-mono">{field.name}</td>
                          <td className="py-2 px-3 text-muted-foreground">{field.type}</td>
                          <td className="py-2 px-3 text-center">
                            {field.pii ? (
                              <AlertTriangle className="h-4 w-4 text-warning mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {field.encrypted ? (
                              <Lock className="h-4 w-4 text-chart-2 mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            {field.maskingRule ? (
                              <code className="text-xs bg-muted px-2 py-0.5 rounded">{field.maskingRule}</code>
                            ) : (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Privacy Controls Tab */}
        <TabsContent value="privacy">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  GDPR Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Right to Access', description: 'Export all personal data on request', supported: true },
                  { name: 'Right to Rectification', description: 'Update inaccurate personal data', supported: true },
                  { name: 'Right to Erasure', description: 'Delete personal data ("right to be forgotten")', supported: true },
                  { name: 'Right to Portability', description: 'Export data in machine-readable format', supported: true },
                  { name: 'Right to Object', description: 'Opt-out of processing for specific purposes', supported: true },
                ].map((right) => (
                  <div key={right.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle className="h-5 w-5 text-chart-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{right.name}</p>
                      <p className="text-xs text-muted-foreground">{right.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Data Retention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { category: 'Business Entity Data', retention: '7 years', reason: 'Regulatory requirement' },
                  { category: 'Credit Score Data', retention: '7 years', reason: 'Underwriting documentation' },
                  { category: 'Audit Logs', retention: '7 years', reason: 'Compliance audit trail' },
                  { category: 'API Request Logs', retention: '90 days', reason: 'Operational monitoring' },
                  { category: 'Session Data', retention: '30 days', reason: 'Security analysis' },
                ].map((policy) => (
                  <div key={policy.category} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{policy.category}</span>
                      <Badge variant="outline">{policy.retention}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{policy.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompliancePanel;
