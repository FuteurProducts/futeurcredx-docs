/**
 * BankContext — React context for bank identity + switching
 *
 * Reads the resolved bank from bankConfig.ts (URL param > env var > chase).
 * Switching banks navigates to ?bank=xxx which triggers a full page reload
 * since all data modules resolve ACTIVE_BANK_ID at import time.
 */

import { createContext, useContext, useCallback } from 'react';
import { ACTIVE_BANK_ID, ACTIVE_BANK_NAME, BANK_DISPLAY_NAMES } from '@/data/bankConfig';
import type { BankId } from '@/data/bankConfig';

interface BankContextType {
  bankId: BankId;
  bankName: string;
  allBanks: { id: BankId; name: string }[];
  switchBank: (id: BankId) => void;
}

const ALL_BANKS: { id: BankId; name: string }[] = (
  Object.entries(BANK_DISPLAY_NAMES) as [BankId, string][]
).map(([id, name]) => ({ id, name }));

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children }: { children: React.ReactNode }) {
  const switchBank = useCallback((id: BankId) => {
    const url = new URL(window.location.href);
    url.searchParams.set('bank', id);
    window.location.href = url.toString();
  }, []);

  return (
    <BankContext.Provider
      value={{
        bankId: ACTIVE_BANK_ID,
        bankName: ACTIVE_BANK_NAME,
        allBanks: ALL_BANKS,
        switchBank,
      }}
    >
      {children}
    </BankContext.Provider>
  );
}

export function useBankContext(): BankContextType {
  const ctx = useContext(BankContext);
  if (!ctx) {
    throw new Error('useBankContext must be used within BankProvider');
  }
  return ctx;
}
