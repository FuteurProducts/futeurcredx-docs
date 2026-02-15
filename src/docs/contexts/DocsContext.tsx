import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface DocsContextValue {
  selectedBank: string;
  setSelectedBank: (bank: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const DocsContext = createContext<DocsContextValue | null>(null);

const STORAGE_KEYS = {
  bank: 'docs-selected-bank',
  language: 'docs-selected-language',
} as const;

function getStoredValue(key: string, fallback: string): string {
  try {
    const stored = localStorage.getItem(key);
    return stored ?? fallback;
  } catch {
    return fallback;
  }
}

interface DocsProviderProps {
  children: ReactNode;
}

export function DocsProvider({ children }: DocsProviderProps) {
  const [selectedBank, setSelectedBankState] = useState<string>(() =>
    getStoredValue(STORAGE_KEYS.bank, 'chase'),
  );
  const [selectedLanguage, setSelectedLanguageState] = useState<string>(() =>
    getStoredValue(STORAGE_KEYS.language, 'curl'),
  );
  const [searchOpen, setSearchOpen] = useState(false);

  const setSelectedBank = useCallback((bank: string) => {
    setSelectedBankState(bank);
    try {
      localStorage.setItem(STORAGE_KEYS.bank, bank);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const setSelectedLanguage = useCallback((lang: string) => {
    setSelectedLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.language, lang);
    } catch {
      // localStorage unavailable
    }
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DocsContext.Provider
      value={{
        selectedBank,
        setSelectedBank,
        selectedLanguage,
        setSelectedLanguage,
        searchOpen,
        setSearchOpen,
      }}
    >
      {children}
    </DocsContext.Provider>
  );
}

export function useDocsContext(): DocsContextValue {
  const context = useContext(DocsContext);
  if (!context) {
    throw new Error('useDocsContext must be used within a DocsProvider');
  }
  return context;
}
