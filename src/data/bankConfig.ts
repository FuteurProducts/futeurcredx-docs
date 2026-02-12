/**
 * Bank Configuration — Runtime bank switching
 *
 * Priority order:
 *   1. Route path: /demo/:bankId (PRIMARY)
 *   2. URL param:  ?bank=wellsfargo (legacy fallback)
 *   3. Env var:    VITE_BANK_ID=wellsfargo npm run dev
 *   4. Default:    chase
 */

export type BankId = 'chase' | 'wellsfargo' | 'santander' | 'citi';

export const VALID_BANK_IDS: readonly BankId[] = ['chase', 'wellsfargo', 'santander', 'citi'];

function resolveBankId(): BankId {
  if (typeof window !== 'undefined') {
    // 1. Route-based: /demo/:bankId
    const pathParts = window.location.pathname.split('/');
    const demoIdx = pathParts.indexOf('demo');
    if (demoIdx !== -1 && pathParts[demoIdx + 1]) {
      const routeBank = pathParts[demoIdx + 1].toLowerCase();
      if (VALID_BANK_IDS.includes(routeBank as BankId)) {
        return routeBank as BankId;
      }
    }

    // 2. Query param: ?bank=xxx (legacy fallback)
    const urlBank = new URLSearchParams(window.location.search).get('bank');
    if (urlBank && VALID_BANK_IDS.includes(urlBank as BankId)) {
      return urlBank as BankId;
    }
  }

  // 3. Env var: VITE_BANK_ID
  const envBank = import.meta.env.VITE_BANK_ID;
  if (envBank && VALID_BANK_IDS.includes(envBank as BankId)) {
    return envBank as BankId;
  }

  // 4. Default: chase
  return 'chase';
}

export const ACTIVE_BANK_ID: BankId = resolveBankId();

export const BANK_DISPLAY_NAMES: Record<BankId, string> = {
  chase: 'Chase',
  wellsfargo: 'Wells Fargo',
  santander: 'Santander',
  citi: 'Citibank',
};

export const ACTIVE_BANK_NAME = BANK_DISPLAY_NAMES[ACTIVE_BANK_ID];
