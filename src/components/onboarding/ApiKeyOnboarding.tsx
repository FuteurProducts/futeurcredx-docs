/**
 * API Key Onboarding — First-time setup screen for new bank evaluators.
 *
 * Shown when:
 *  - User is signed in (Clerk session active)
 *  - No API key in apiKeyStore (localStorage empty)
 *  - Not in demo mode
 *
 * Flow:
 *  1. User pastes their bank's API key (sk_test_... or sk_live_...)
 *  2. Component validates key by calling GET /portfolios
 *  3. On success → saves key to store, PortfolioContext auto-fetches → redirects to dashboard
 *  4. On failure → shows clear error, lets user retry
 */

import { useState, useCallback } from 'react';
import { KeyRound, CheckCircle, AlertCircle, Loader2, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApiKeyStore } from '@/stores/apiKeyStore';
import { cn } from '@/lib/utils';

type ValidationState = 'idle' | 'validating' | 'success' | 'error';

interface ValidationResult {
  valid: boolean;
  bankName: string | null;
  portfolioId: string | null;
  error: string | null;
}

async function validateApiKey(key: string): Promise<ValidationResult> {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    return { valid: false, bankName: null, portfolioId: null, error: 'API URL not configured. Contact your LumiqAI representative.' };
  }

  try {
    const response = await fetch(`${apiUrl}/dashboard/portfolios`, {
      headers: { 'X-API-Key': key },
    });

    if (response.ok) {
      const body = await response.json();
      const portfolios = body.data;
      if (Array.isArray(portfolios) && portfolios.length > 0) {
        return {
          valid: true,
          bankName: portfolios[0].name || 'Your Portfolio',
          portfolioId: portfolios[0].id || null,
          error: null,
        };
      }
      return { valid: false, bankName: null, portfolioId: null, error: 'No portfolios found for this key. Contact your LumiqAI representative.' };
    }

    if (response.status === 401 || response.status === 403) {
      return { valid: false, bankName: null, portfolioId: null, error: 'Invalid or expired API key. Please check and try again.' };
    }

    return { valid: false, bankName: null, portfolioId: null, error: `Connection failed (${response.status}). Please try again.` };
  } catch {
    return { valid: false, bankName: null, portfolioId: null, error: 'Cannot reach the API. Please check your connection and try again.' };
  }
}

function isKeyFormatValid(key: string): boolean {
  return key.startsWith('sk_test_') || key.startsWith('sk_live_');
}

export function ApiKeyOnboarding() {
  const [keyInput, setKeyInput] = useState('');
  const [state, setState] = useState<ValidationState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bankName, setBankName] = useState<string | null>(null);
  const { setApiKey } = useApiKeyStore();

  const trimmedKey = keyInput.trim();
  const formatValid = isKeyFormatValid(trimmedKey);

  const handleConnect = useCallback(async () => {
    if (!formatValid) return;

    setState('validating');
    setErrorMsg(null);

    const result = await validateApiKey(trimmedKey);

    if (result.valid) {
      setBankName(result.bankName);
      setState('success');
      // Brief pause to show success animation, then activate key
      setTimeout(() => {
        setApiKey(trimmedKey);
      }, 1200);
    } else {
      setErrorMsg(result.error);
      setState('error');
    }
  }, [trimmedKey, formatValid, setApiKey]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formatValid && state === 'idle') {
      handleConnect();
    }
  }, [formatValid, state, handleConnect]);

  const handleRetry = useCallback(() => {
    setState('idle');
    setErrorMsg(null);
    setKeyInput('');
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/lumiq-logo.svg" alt="LumiqAI" className="h-10 opacity-90" />
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          {/* Success State */}
          {state === 'success' && bankName ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Connected</h2>
              <p className="text-muted-foreground">
                Loading <span className="text-foreground font-medium">{bankName}</span> portfolio data...
              </p>
              <div className="mt-4">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-1">Connect Your Sandbox</h2>
                <p className="text-sm text-muted-foreground">
                  Enter the API key provided by your LumiqAI representative to access your portfolio data.
                </p>
              </div>

              {/* Input */}
              <div className="space-y-3">
                <Input
                  type="password"
                  placeholder="sk_test_..."
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    if (state === 'error') {
                      setState('idle');
                      setErrorMsg(null);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    'h-12 font-mono text-sm',
                    state === 'error' && 'border-destructive focus-visible:ring-destructive/20'
                  )}
                  disabled={state === 'validating'}
                  autoFocus
                />

                {/* Error message */}
                {state === 'error' && errorMsg && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/5 border border-destructive/20 rounded-xl text-sm">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-destructive">{errorMsg}</p>
                      <button
                        onClick={handleRetry}
                        className="text-xs text-muted-foreground hover:text-foreground underline mt-1 transition-colors"
                      >
                        Clear and try again
                      </button>
                    </div>
                  </div>
                )}

                {/* Connect button */}
                <Button
                  onClick={handleConnect}
                  disabled={!formatValid || state === 'validating'}
                  className="w-full h-11"
                >
                  {state === 'validating' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      Connect
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Help text */}
              <p className="text-xs text-muted-foreground text-center mt-4">
                Need a key? Contact your LumiqAI representative or check your onboarding email.
              </p>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5" />
                <span>Your key is stored locally and never sent to third parties</span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          &copy; 2026 LUMIQ AI. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default ApiKeyOnboarding;
