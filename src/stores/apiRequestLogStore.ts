/**
 * API Request Log Store — Zustand store for tracking live API requests.
 *
 * Every BFF client request is logged here (non-demo mode only).
 * The API Console Activity Log tab reads from this store.
 */

import { create } from 'zustand';

const MAX_ENTRIES = 100;

export interface RequestLogEntry {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  requestBody?: string | null;
  responseBody: string;
  error?: string;
}

interface RequestLogState {
  requests: RequestLogEntry[];
  addRequest: (entry: Omit<RequestLogEntry, 'id' | 'timestamp'>) => void;
  clearRequests: () => void;
}

export const useRequestLogStore = create<RequestLogState>((set) => ({
  requests: [],

  addRequest: (entry) => {
    const newEntry: RequestLogEntry = {
      ...entry,
      id: `req_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      requests: [newEntry, ...state.requests].slice(0, MAX_ENTRIES),
    }));
  },

  clearRequests: () => set({ requests: [] }),
}));

/** Non-React getter for use in BFF client instrumentation. */
export function getRequestLogStore(): RequestLogState {
  return useRequestLogStore.getState();
}
