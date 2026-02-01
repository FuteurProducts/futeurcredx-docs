/**
 * React hook wrapping demoDataStore with useSyncExternalStore.
 * Re-renders on any demoDataStore mutation.
 */

import { useSyncExternalStore, useCallback } from 'react';
import { demoDataStore } from '@/data/demoDataStore';

let version = 0;

function subscribeToStore(callback: () => void) {
  return demoDataStore.subscribe(() => {
    version++;
    callback();
  });
}

function getSnapshot() {
  return version;
}

export function useDemoStore() {
  useSyncExternalStore(subscribeToStore, getSnapshot);

  const businesses = demoDataStore.getBusinesses();
  const applications = demoDataStore.getApplications();

  const updateStatus = useCallback(
    (appId: string, status: Parameters<typeof demoDataStore.updateApplicationStatus>[1]) => {
      demoDataStore.updateApplicationStatus(appId, status);
    },
    []
  );

  const pullScore = useCallback(
    (bizId: string) => {
      return demoDataStore.simulateScorePull(bizId);
    },
    []
  );

  const reset = useCallback(() => {
    demoDataStore.reset();
  }, []);

  return { businesses, applications, updateStatus, pullScore, reset };
}
