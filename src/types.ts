export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  apiKey?: string;
  token?: string;
  value?: string;
  keyPrefix?: string | null;
  fullKeyOnCreation?: string | null;
  createdAt: string;
  lastUsed: string | null;
  callsUsed: number;
  isActive: boolean;
  environment: string;
  scopes: string[];
  expiresInDays: number;
  ipWhitelist: string[];
  geoRestrictions: string[];
  message?: string | null;
}

export interface ApiStats {
  totalCalls: number;
  monthlyLimit: number;
  plan: string;
  thisMonth: number;
  lastMonth: number;
  growth: number;
}
