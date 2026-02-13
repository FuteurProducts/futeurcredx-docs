/**
 * API Key Store — Zustand store for the active sandbox/production API key.
 *
 * The key is persisted to localStorage so it survives page reloads.
 * Non-React code (e.g. BFF client) can use getApiKeyState() directly.
 */

import { create } from 'zustand';

const STORAGE_KEY = 'lumiq-sandbox-api-key';

interface ApiKeyState {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  clearApiKey: () => void;
}

function loadPersistedKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function persistKey(key: string | null): void {
  try {
    if (key) {
      localStorage.setItem(STORAGE_KEY, key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage restricted
  }
}

export const useApiKeyStore = create<ApiKeyState>((set) => ({
  apiKey: loadPersistedKey(),

  setApiKey: (key: string | null) => {
    persistKey(key);
    set({ apiKey: key });
  },

  clearApiKey: () => {
    persistKey(null);
    set({ apiKey: null });
  },
}));

/** Non-React getter for use in BFF client and other plain modules. */
export function getApiKeyState(): ApiKeyState {
  return useApiKeyStore.getState();
}
