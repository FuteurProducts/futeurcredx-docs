/**
 * Consent Defaults Panel
 * Configure default consent settings for data collection
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, FileText, Shield, Users, Clock, 
  Info, ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
  required: boolean;
  expirationDays: number;
}

const mockCategories: ConsentCategory[] = [
  { id: 'credit-pull', name: 'Credit Bureau Pulls', description: 'Authorization to access credit reports from bureaus', defaultEnabled: false, required: true, expirationDays: 30 },
  { id: 'bank-connect', name: 'Bank Account Access', description: 'Permission to connect and read bank account data', defaultEnabled: false, required: true, expirationDays: 90 },
  { id: 'data-sharing', name: 'Partner Data Sharing', description: 'Share anonymized data with lending partners', defaultEnabled: false, required: false, expirationDays: 365 },
  { id: 'marketing', name: 'Marketing Communications', description: 'Receive promotional offers and updates', defaultEnabled: false, required: false, expirationDays: 365 },
  { id: 'analytics', name: 'Analytics & Improvements', description: 'Use data to improve our services', defaultEnabled: true, required: false, expirationDays: 365 },
];

export const ConsentPanel: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState(mockCategories);
  const [consentVersion, setConsentVersion] = useState('2.1.0');
  const [requireReConsent, setRequireReConsent] = useState(true);

  const handleUpdateCategory = (categoryId: string, updates: Partial<ConsentCategory>) => {
    setCategories(categories.map(c => c.id === categoryId ? { ...c, ...updates } : c));
  };

  const handleSave = () => {
    toast({ title: 'Consent Settings Saved', description: 'Changes will apply to new consent requests' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Consent Defaults</h2>
          <p className="text-sm text-muted-foreground">
            Configure default consent settings for data collection and sharing
          </p>
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>

      {/* Consent Version */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Consent Document Version
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label>Current Version</Label>
              <Input 
                value={consentVersion}
                onChange={(e) => setConsentVersion(e.target.value)}
                placeholder="e.g., 2.1.0"
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch 
                checked={requireReConsent}
                onCheckedChange={setRequireReConsent}
              />
              <div>
                <Label className="text-sm">Require Re-consent on Update</Label>
                <p className="text-xs text-muted-foreground">Users must re-accept when version changes</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Semantic Versioning</p>
              <p>Major version changes (2.x → 3.x) always require re-consent. Minor changes are configurable above.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Consent Categories</h3>
        
        {categories.map((category) => (
          <motion.div key={category.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      category.required ? 'bg-warning/10' : 'bg-primary/10'
                    }`}>
                      {category.required ? (
                        <Shield className="h-5 w-5 text-warning" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{category.name}</h4>
                        {category.required && (
                          <Badge variant="outline" className="text-warning border-warning/30">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={category.defaultEnabled}
                            onCheckedChange={(checked) => handleUpdateCategory(category.id, { defaultEnabled: checked })}
                            disabled={category.required}
                          />
                          <span className="text-sm text-muted-foreground">Default: {category.defaultEnabled ? 'Enabled' : 'Disabled'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Expires in {category.expirationDays} days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Expiration (days)</Label>
                    <Input 
                      type="number"
                      value={category.expirationDays}
                      onChange={(e) => handleUpdateCategory(category.id, { expirationDays: parseInt(e.target.value) })}
                      className="w-24"
                      min={7}
                      max={730}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Consent Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5" />
            Consent Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">98.2%</div>
              <div className="text-xs text-muted-foreground">Credit Pull Consent Rate</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">94.7%</div>
              <div className="text-xs text-muted-foreground">Bank Connect Rate</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">67.3%</div>
              <div className="text-xs text-muted-foreground">Data Sharing Opt-in</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">45.1%</div>
              <div className="text-xs text-muted-foreground">Marketing Opt-in</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Templates */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">Consent Form Templates</h4>
                <p className="text-sm text-muted-foreground">Customize legal language for consent forms</p>
              </div>
            </div>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Edit Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentPanel;
