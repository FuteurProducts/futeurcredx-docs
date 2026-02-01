/**
 * Session-Aware Demo Data Store
 *
 * A singleton module (not a React context) that:
 * - Hydrates from ENRICHED_BUSINESSES on first load
 * - Supports mutations: approve, decline, score pull, add note
 * - Persists to localStorage key `lumiq_demo_session`
 * - Emits events so React components can re-render via useDemoStore hook
 */

import type {
  EnrichedBusiness,
  DemoApplication,
  DemoCreditScore,
} from '@/data/demoData';
import {
  getAllEnrichedBusinesses,
  getEnrichedBusiness,
  DEMO_BUSINESSES,
} from '@/data/demoData';

const STORAGE_KEY = 'lumiq_demo_session';

// ─── Session State Shape ────────────────────────────────────────────────────

interface SessionOverrides {
  /** Application status overrides keyed by app ID */
  applicationStatuses: Record<string, DemoApplication['status']>;
  /** Additional score pulls keyed by `${bizId}_${timestamp}` */
  additionalScorePulls: Record<string, DemoCreditScore>;
}

type Listener = () => void;

// ─── Singleton Store ────────────────────────────────────────────────────────

let overrides: SessionOverrides = { applicationStatuses: {}, additionalScorePulls: {} };
let listeners: Set<Listener> = new Set();

function loadFromStorage(): SessionOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        applicationStatuses: parsed.applicationStatuses ?? {},
        additionalScorePulls: parsed.additionalScorePulls ?? {},
      };
    }
  } catch {
    // Corrupted storage — ignore
  }
  return { applicationStatuses: {}, additionalScorePulls: {} };
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // Storage full or unavailable — silent fail
  }
}

function notify() {
  listeners.forEach(fn => fn());
}

// Hydrate on module load
overrides = loadFromStorage();

// ─── Public API ─────────────────────────────────────────────────────────────

function getBusinesses(): EnrichedBusiness[] {
  return getAllEnrichedBusinesses().map(biz => ({
    ...biz,
    applications: biz.applications.map(app => ({
      ...app,
      status: overrides.applicationStatuses[app.id] ?? app.status,
    })),
  }));
}

function getBusinessById(id: string): EnrichedBusiness | undefined {
  const biz = getEnrichedBusiness(id);
  if (!biz) return undefined;
  return {
    ...biz,
    applications: biz.applications.map(app => ({
      ...app,
      status: overrides.applicationStatuses[app.id] ?? app.status,
    })),
  };
}

function getApplications(): DemoApplication[] {
  return getAllEnrichedBusinesses()
    .flatMap(biz => biz.applications)
    .map(app => ({
      ...app,
      status: overrides.applicationStatuses[app.id] ?? app.status,
    }));
}

function updateApplicationStatus(appId: string, newStatus: DemoApplication['status']) {
  overrides.applicationStatuses[appId] = newStatus;
  saveToStorage();
  notify();
}

function simulateScorePull(bizId: string): DemoCreditScore {
  const biz = getEnrichedBusiness(bizId);
  const baseBiz = DEMO_BUSINESSES.find(b => b.id === bizId);

  if (biz && biz.creditScores.length > 0) {
    // Return the existing score with updated timestamp
    const existing = biz.creditScores[0];
    const pulled: DemoCreditScore = {
      ...existing,
      pulledAt: new Date().toISOString(),
    };

    const key = `${bizId}_${Date.now()}`;
    overrides.additionalScorePulls[key] = pulled;
    saveToStorage();
    notify();

    return pulled;
  }

  // Generate a deterministic score for unknown businesses
  const score = baseBiz ? baseBiz.lumiqScore * 10 : 700;
  const pulled: DemoCreditScore = {
    source: 'experian_biz',
    score: Math.min(score, 850),
    riskClass: score >= 750 ? 'low' : score >= 650 ? 'moderate' : 'high',
    factors: ['Score pulled via LUMIQ API', 'Data aggregated from bureau sources'],
    pulledAt: new Date().toISOString(),
  };

  const key = `${bizId}_${Date.now()}`;
  overrides.additionalScorePulls[key] = pulled;
  saveToStorage();
  notify();

  return pulled;
}

function reset() {
  overrides = { applicationStatuses: {}, additionalScorePulls: {} };
  localStorage.removeItem(STORAGE_KEY);
  notify();
}

function subscribe(callback: Listener): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// ─── Export Singleton ───────────────────────────────────────────────────────

export const demoDataStore = {
  getBusinesses,
  getBusinessById,
  getApplications,
  updateApplicationStatus,
  simulateScorePull,
  reset,
  subscribe,
};
