/**
 * SSO & Authentication Panel
 * SAML/OIDC configuration, MFA enforcement, session policies
 */

import React, { useState } from 'react';
import { 
  Key, Shield, Clock, Users, CheckCircle,
  Copy, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface SSOConfig {
  provider: 'okta' | 'azure-ad' | 'onelogin' | 'custom' | null;
  enabled: boolean;
  entityId: string;
  ssoUrl: string;
  certificate: string;
  enforceSSO: boolean;
  allowBypass: boolean;
}

interface MFAPolicy {
  required: boolean;
  methods: ('totp' | 'sms' | 'email' | 'hardware')[];
  gracePeriodinDays: number;
  rememberDeviceDays: number;
}

interface SessionPolicy {
  maxSessionMinutes: number;
  idleTimeoutMinutes: number;
  concurrentSessions: number;
  requireReauthForSensitive: boolean;
}

const mockSSOConfig: SSOConfig = {
  provider: 'okta',
  enabled: true,
  entityId: 'https://acmebank.okta.com/app/exk1234567890',
  ssoUrl: 'https://acmebank.okta.com/app/lumiqai/sso/saml',
  certificate: '-----BEGIN CERTIFICATE-----\nMIIDpDCCAoygAwIBAgIGAX...\n-----END CERTIFICATE-----',
  enforceSSO: true,
  allowBypass: false,
};

const mockMFAPolicy: MFAPolicy = {
  required: true,
  methods: ['totp', 'hardware'],
  gracePeriodinDays: 7,
  rememberDeviceDays: 30,
};

const mockSessionPolicy: SessionPolicy = {
  maxSessionMinutes: 480,
  idleTimeoutMinutes: 30,
  concurrentSessions: 3,
  requireReauthForSensitive: true,
};

export const SSOPanel: React.FC = () => {
  const { toast } = useToast();
  const [ssoConfig, setSsoConfig] = useState(mockSSOConfig);
  const [mfaPolicy, setMfaPolicy] = useState(mockMFAPolicy);
  const [sessionPolicy, setSessionPolicy] = useState(mockSessionPolicy);

  const handleSaveSSO = () => {
    toast({ title: 'SSO Configuration Saved', description: 'Changes will take effect immediately' });
  };

  const handleSaveMFA = () => {
    toast({ title: 'MFA Policy Updated', description: 'All users will be required to comply' });
  };

  const handleSaveSession = () => {
    toast({ title: 'Session Policy Updated', description: 'Active sessions will be affected at next refresh' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">SSO & Authentication</h2>
          <p className="text-sm text-muted-foreground">
            Configure enterprise single sign-on and security policies
          </p>
        </div>
        <Badge className={ssoConfig.enabled ? 'bg-chart-2/10 text-chart-2' : 'bg-muted text-muted-foreground'}>
          {ssoConfig.enabled ? 'SSO Active' : 'SSO Disabled'}
        </Badge>
      </div>

      <Tabs defaultValue="sso" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="sso">Single Sign-On</TabsTrigger>
          <TabsTrigger value="mfa">MFA Policy</TabsTrigger>
          <TabsTrigger value="sessions">Session Policy</TabsTrigger>
        </TabsList>

        {/* SSO Configuration */}
        <TabsContent value="sso">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-5 w-5" />
                SAML 2.0 Configuration
              </CardTitle>
              <CardDescription>
                Connect your identity provider for seamless authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Provider Selection */}
              <div className="grid grid-cols-4 gap-3">
                {(['okta', 'azure-ad', 'onelogin', 'custom'] as const).map((provider) => (
                  <button
                    key={provider}
                    onClick={() => setSsoConfig({ ...ssoConfig, provider })}
                    className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                      ssoConfig.provider === provider
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 transition-colors duration-200'
                    }`}
                  >
                    <span className="text-sm font-medium capitalize">
                      {provider === 'azure-ad' ? 'Azure AD' : provider}
                    </span>
                  </button>
                ))}
              </div>

              {/* Configuration Fields */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Entity ID / Issuer</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={ssoConfig.entityId} 
                      onChange={(e) => setSsoConfig({ ...ssoConfig, entityId: e.target.value })}
                    />
                    <Button variant="outline" size="icon" onClick={() => {
                      navigator.clipboard.writeText(ssoConfig.entityId);
                      toast({ title: 'Copied!' });
                    }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>SSO URL (Login URL)</Label>
                  <Input 
                    value={ssoConfig.ssoUrl} 
                    onChange={(e) => setSsoConfig({ ...ssoConfig, ssoUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>X.509 Certificate</Label>
                  <textarea
                    className="w-full h-24 p-3 text-xs font-mono bg-muted/50 rounded-xl border border-border/50 transition-all duration-200"
                    value={ssoConfig.certificate}
                    onChange={(e) => setSsoConfig({ ...ssoConfig, certificate: e.target.value })}
                  />
                </div>
              </div>

              {/* SSO Options */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable SSO</Label>
                    <p className="text-xs text-muted-foreground">Allow users to sign in via SSO</p>
                  </div>
                  <Switch 
                    checked={ssoConfig.enabled} 
                    onCheckedChange={(checked) => setSsoConfig({ ...ssoConfig, enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enforce SSO Only</Label>
                    <p className="text-xs text-muted-foreground">Disable password login for all users</p>
                  </div>
                  <Switch 
                    checked={ssoConfig.enforceSSO} 
                    onCheckedChange={(checked) => setSsoConfig({ ...ssoConfig, enforceSSO: checked })}
                  />
                </div>

                {ssoConfig.enforceSSO && (
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <div>
                        <Label>Allow Admin Bypass</Label>
                        <p className="text-xs text-muted-foreground">Super admins can still use password</p>
                      </div>
                    </div>
                    <Switch 
                      checked={ssoConfig.allowBypass} 
                      onCheckedChange={(checked) => setSsoConfig({ ...ssoConfig, allowBypass: checked })}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => {
                  toast({ title: 'Testing SSO connection...' });
                  setTimeout(() => toast({ title: 'SSO connection successful' }), 1500);
                }}>Test Connection</Button>
                <Button onClick={handleSaveSSO}>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MFA Policy */}
        <TabsContent value="mfa">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Multi-Factor Authentication Policy
              </CardTitle>
              <CardDescription>
                Enforce additional verification for all platform users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-base">Require MFA for All Users</Label>
                  <p className="text-sm text-muted-foreground">Users must set up MFA to access the platform</p>
                </div>
                <Switch 
                  checked={mfaPolicy.required} 
                  onCheckedChange={(checked) => setMfaPolicy({ ...mfaPolicy, required: checked })}
                />
              </div>

              {/* Allowed Methods */}
              <div className="space-y-3">
                <Label>Allowed MFA Methods</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'totp', label: 'Authenticator App (TOTP)', icon: Key },
                    { id: 'sms', label: 'SMS Code', icon: Users },
                    { id: 'email', label: 'Email Code', icon: Users },
                    { id: 'hardware', label: 'Hardware Key (FIDO2)', icon: Shield },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isEnabled = mfaPolicy.methods.includes(method.id as typeof mfaPolicy.methods[number]);
                    return (
                      <button
                        key={method.id}
                        onClick={() => {
                          const methods = isEnabled
                            ? mfaPolicy.methods.filter(m => m !== method.id)
                            : [...mfaPolicy.methods, method.id as typeof mfaPolicy.methods[number]];
                          setMfaPolicy({ ...mfaPolicy, methods });
                        }}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                          isEnabled ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm">{method.label}</span>
                        {isEnabled && <CheckCircle className="h-4 w-4 text-primary ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grace Period */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Grace Period (Days)</Label>
                  <Input 
                    type="number" 
                    value={mfaPolicy.gracePeriodinDays}
                    onChange={(e) => setMfaPolicy({ ...mfaPolicy, gracePeriodinDays: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Days before MFA is enforced for new users</p>
                </div>
                <div className="space-y-2">
                  <Label>Remember Device (Days)</Label>
                  <Input 
                    type="number" 
                    value={mfaPolicy.rememberDeviceDays}
                    onChange={(e) => setMfaPolicy({ ...mfaPolicy, rememberDeviceDays: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Days to trust a device after MFA</p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveMFA}>Save MFA Policy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Policy */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Session Management
              </CardTitle>
              <CardDescription>
                Control session duration and concurrent access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Maximum Session Duration</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={sessionPolicy.maxSessionMinutes}
                      onChange={(e) => setSessionPolicy({ ...sessionPolicy, maxSessionMinutes: parseInt(e.target.value) })}
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Users will be logged out after this duration
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Idle Timeout</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={sessionPolicy.idleTimeoutMinutes}
                      onChange={(e) => setSessionPolicy({ ...sessionPolicy, idleTimeoutMinutes: parseInt(e.target.value) })}
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Inactive sessions will expire
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Concurrent Sessions</Label>
                  <Input 
                    type="number" 
                    value={sessionPolicy.concurrentSessions}
                    onChange={(e) => setSessionPolicy({ ...sessionPolicy, concurrentSessions: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum simultaneous logins per user
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                  <div>
                    <Label>Re-auth for Sensitive Actions</Label>
                    <p className="text-xs text-muted-foreground">Require password for PII access</p>
                  </div>
                  <Switch
                    checked={sessionPolicy.requireReauthForSensitive}
                    onCheckedChange={(checked) => setSessionPolicy({ ...sessionPolicy, requireReauthForSensitive: checked })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSession}>Save Session Policy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SSOPanel;
