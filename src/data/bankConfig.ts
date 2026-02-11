/**
 * Bank Configuration — Runtime bank switching
 *
 * Priority order:
 *   1. URL param: ?bank=wellsfargo
 *   2. Env var:   VITE_BANK_ID=wellsfargo npm run dev
 *   3. Default:   chase
 */

export type BankId = 'chase' | 'wellsfargo' | 'santander' | 'citi';

const VALID_BANK_IDS: readonly BankId[] = ['chase', 'wellsfargo', 'santander', 'citi'];

function resolveBankId(): BankId {
  if (typeof window !== 'undefined') {
    const urlBank = new URLSearchParams(window.location.search).get('bank');
    if (urlBank && VALID_BANK_IDS.includes(urlBank as BankId)) {
      return urlBank as BankId;
    }
  }
  const envBank = import.meta.env.VITE_BANK_ID;
  if (envBank && VALID_BANK_IDS.includes(envBank as BankId)) {
    return envBank as BankId;
  }
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
