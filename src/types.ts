export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  apiKey?: string;
  token?: string;
  value?: string;
  keyPrefix?: string;
  fullKeyOnCreation?: string;
  createdAt: string;
  lastUsed?: string | null;
  lastUsedAt?: string | null;
  callsUsed?: number;
  usageCount?: number;
  isActive: boolean;
  environment: string;
  scopes: string[];
  expiresInDays?: number;
  expiresAt?: string;
  ipWhitelist?: string[];
  geoRestrictions?: string[];
  message?: string | null;
}

export interface ApiKeyStats {
  keyId: string;
  keyName: string;
  callsUsed: number;
  lastUsed: string | null;
  isActive: boolean;
  environment?: string;
}

export interface ApiStats {
  totalCalls: number;
  monthlyLimit: number;
  plan: string;
  thisMonth: number;
  lastMonth: number;
  growth: number;
  keyStats: ApiKeyStats[];
  totalCallsThisMonth: number;
  totalCallsLastMonth: number;
  developmentUsage?: number;
  productionUsage?: number;
  totalKeys?: number;
}
