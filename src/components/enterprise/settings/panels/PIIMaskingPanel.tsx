/**
 * PII Masking Panel
 * Configure which fields are masked and when
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  EyeOff, Eye, Shield, Lock, AlertTriangle, 
  CheckCircle, User, CreditCard, Phone, Mail, Home
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface PIIField {
  id: string;
  name: string;
  example: string;
  maskedExample: string;
  icon: React.ElementType;
  sensitivity: 'high' | 'medium' | 'low';
  masked: boolean;
  requiresAudit: boolean;
}

const mockFields: PIIField[] = [
  { id: 'ssn', name: 'Social Security Number', example: '123-45-6789', maskedExample: '***-**-6789', icon: Shield, sensitivity: 'high', masked: true, requiresAudit: true },
  { id: 'ein', name: 'Employer Identification Number', example: '12-3456789', maskedExample: '**-****789', icon: Shield, sensitivity: 'high', masked: true, requiresAudit: true },
  { id: 'dob', name: 'Date of Birth', example: '1985-03-15', maskedExample: '****-**-**', icon: User, sensitivity: 'high', masked: true, requiresAudit: true },
  { id: 'account-number', name: 'Bank Account Number', example: '1234567890', maskedExample: '******7890', icon: CreditCard, sensitivity: 'high', masked: true, requiresAudit: true },
  { id: 'routing-number', name: 'Routing Number', example: '021000021', maskedExample: '*****0021', icon: CreditCard, sensitivity: 'high', masked: true, requiresAudit: true },
  { id: 'phone', name: 'Phone Number', example: '(555) 123-4567', maskedExample: '(***) ***-4567', icon: Phone, sensitivity: 'medium', masked: true, requiresAudit: false },
  { id: 'email', name: 'Email Address', example: 'john.doe@company.com', maskedExample: 'j***@c***.com', icon: Mail, sensitivity: 'medium', masked: false, requiresAudit: false },
  { id: 'address', name: 'Street Address', example: '123 Main Street', maskedExample: '*** Main Street', icon: Home, sensitivity: 'medium', masked: true, requiresAudit: false },
];

export const PIIMaskingPanel: React.FC = () => {
  const { toast } = useToast();
  const [fields, setFields] = useState(mockFields);
  const [globalMasking, setGlobalMasking] = useState(true);
  const [auditOnUnmask, setAuditOnUnmask] = useState(true);

  const handleToggleField = (fieldId: string, masked: boolean) => {
    setFields(fields.map(f => f.id === fieldId ? { ...f, masked } : f));
  };

  const handleSave = () => {
    toast({ title: 'PII Settings Saved', description: 'Masking rules have been updated' });
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">PII Masking</h2>
          <p className="text-sm text-muted-foreground">
            Configure how sensitive data is displayed throughout the platform
          </p>
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>

      {/* Global Settings */}
      <div className="grid grid-cols-2 gap-4">
        <Card className={globalMasking ? 'border-chart-2/30 bg-chart-2/5' : 'border-destructive/30 bg-destructive/5'}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {globalMasking ? (
                  <EyeOff className="h-6 w-6 text-chart-2" />
                ) : (
                  <Eye className="h-6 w-6 text-destructive" />
                )}
                <div>
                  <h3 className="font-medium">Global PII Masking</h3>
                  <p className="text-sm text-muted-foreground">
                    {globalMasking ? 'All PII is masked by default' : 'Warning: PII is visible'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={globalMasking}
                onCheckedChange={setGlobalMasking}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={auditOnUnmask ? 'border-primary/30 bg-primary/5' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">Audit on Unmask</h3>
                  <p className="text-sm text-muted-foreground">
                    Log when users reveal PII
                  </p>
                </div>
              </div>
              <Switch 
                checked={auditOnUnmask}
                onCheckedChange={setAuditOnUnmask}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PII Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Field-Level Masking Rules</CardTitle>
          <CardDescription>Configure masking for individual data fields</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{field.name}</span>
                        <Badge variant="outline" className={getSensitivityColor(field.sensitivity)}>
                          {field.sensitivity}
                        </Badge>
                        {field.requiresAudit && (
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Audited
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="text-muted-foreground">
                          Example: <code className="bg-background px-1 rounded-lg">{field.example}</code>
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className={field.masked ? 'text-chart-2' : 'text-destructive'}>
                          Shown as: <code className="bg-background px-1 rounded-lg">{field.masked ? field.maskedExample : field.example}</code>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {field.masked ? 'Masked' : 'Visible'}
                    </span>
                    <Switch 
                      checked={field.masked}
                      onCheckedChange={(checked) => handleToggleField(field.id, checked)}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Role-Based Access */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role-Based PII Access
          </CardTitle>
          <CardDescription>
            Configure which roles can unmask PII data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { role: 'Administrator', canUnmask: true, canExport: true },
              { role: 'Developer', canUnmask: false, canExport: false },
              { role: 'Risk Analyst', canUnmask: true, canExport: true },
              { role: 'Relationship Manager', canUnmask: true, canExport: false },
              { role: 'Read-only', canUnmask: false, canExport: false },
            ].map((roleConfig) => (
              <div key={roleConfig.role} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <span className="font-medium">{roleConfig.role}</span>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    {roleConfig.canUnmask ? (
                      <CheckCircle className="h-4 w-4 text-chart-2" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">Can Unmask</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {roleConfig.canExport ? (
                      <CheckCircle className="h-4 w-4 text-chart-2" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">Can Export PII</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PIIMaskingPanel;
