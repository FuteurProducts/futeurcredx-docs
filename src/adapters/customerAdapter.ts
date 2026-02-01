/**
 * Customer Adapter
 * Transforms BFF SmbEntity responses to CustomerEntity UI props
 */

import type { SmbEntity } from '@/services/bff/types';
import type { CustomerEntity } from '@/components/enterprise/customer';
import type { EnrichedBusiness } from '@/data/demoData';
import { getEnrichedBusiness } from '@/data/demoData';
import { deterministicValue } from '@/utils/deterministicHash';

// Industry mapping from NAICS codes
const NAICS_TO_INDUSTRY: Record<string, string> = {
  '236220': 'Construction',
  '484110': 'Transportation',
  '621111': 'Healthcare',
  '541511': 'Technology',
  '111000': 'Agriculture',
  '721110': 'Hospitality',
  '445110': 'Retail',
  '332710': 'Manufacturing',
};

// Segment calculation based on revenue
function getSegment(revenue?: number): 'micro' | 'small' | 'mid-market' {
  if (!revenue || revenue < 500000) return 'micro';
  if (revenue < 5000000) return 'small';
  return 'mid-market';
}

// Risk tier from risk class or score
function getRiskTier(riskClass?: string, score?: number): 'low' | 'medium' | 'high' {
  if (riskClass === 'low' || (score && score >= 720)) return 'low';
  if (riskClass === 'high' || (score && score < 650)) return 'high';
  return 'medium';
}

// Region from state
function getRegion(state?: string): string {
  const regions: Record<string, string> = {
    'NY': 'Northeast', 'MA': 'Northeast', 'CT': 'Northeast', 'NJ': 'Northeast',
    'IL': 'Midwest', 'IA': 'Midwest', 'WI': 'Midwest', 'MN': 'Midwest', 'OH': 'Midwest',
    'CA': 'West', 'WA': 'West', 'OR': 'West', 'NV': 'West', 'AZ': 'West',
    'FL': 'Southeast', 'GA': 'Southeast', 'NC': 'Southeast', 'SC': 'Southeast',
    'TX': 'Southwest', 'NM': 'Southwest', 'OK': 'Southwest',
  };
  return regions[state || ''] || 'Other';
}

// Map enriched relationship stage to CustomerEntity relationship stage
const STAGE_MAP: Record<EnrichedBusiness['relationshipStage'], CustomerEntity['relationshipStage']> = {
  'prospect': 'prospect',
  'onboarding': 'new',
  'active': 'growing',
  'expansion': 'mature',
};

function mapRelationshipStage(enrichedStage?: EnrichedBusiness['relationshipStage']): CustomerEntity['relationshipStage'] | undefined {
  return enrichedStage ? STAGE_MAP[enrichedStage] : undefined;
}

// Relationship stage placeholder (would come from additional data)
function getRelationshipStage(createdAt?: string): 'prospect' | 'new' | 'growing' | 'mature' | 'at-risk' {
  // For MVP: derive from entity age or metadata
  const created = createdAt ? new Date(createdAt) : new Date();
  const daysSinceCreation = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceCreation < 30) return 'new';
  if (daysSinceCreation < 180) return 'growing';
  return 'mature';
}

/**
 * Transform a single SmbEntity from BFF to CustomerEntity for UI
 */
export function adaptSmbEntityToCustomer(entity: SmbEntity): CustomerEntity {
  const industry = entity.naicsCode 
    ? (NAICS_TO_INDUSTRY[entity.naicsCode] || `NAICS ${entity.naicsCode}`)
    : entity.industry || 'Unknown';

  return {
    id: entity.id,
    businessName: entity.legalName,
    industry,
    naicsCode: entity.naicsCode || '',
    segment: getSegment(entity.annualRevenue),
    region: getRegion(entity.state),
    branch: entity.city ? `${entity.city} Branch` : 'Main Branch',
    rhs: getEnrichedBusiness(entity.id)?.rhs ?? deterministicValue(entity.id + '_rhs', 65, 94),
    rhsChange: getEnrichedBusiness(entity.id)?.rhsChange ?? deterministicValue(entity.id + '_rhsc', -3, 6),
    primaryProduct: getEnrichedBusiness(entity.id)?.products[0]?.name ?? 'Checking',
    riskTier: getRiskTier(entity.riskTier),
    relationshipStage: mapRelationshipStage(getEnrichedBusiness(entity.id)?.relationshipStage) ?? getRelationshipStage(entity.createdAt),
    lastActivity: entity.updatedAt || new Date().toISOString().split('T')[0],
    assignedRM: getEnrichedBusiness(entity.id)?.assignedRM,
    totalExposure: getEnrichedBusiness(entity.id)?.totalExposure ?? (entity.annualRevenue ? entity.annualRevenue * 0.15 : 0),
    depositBalance: getEnrichedBusiness(entity.id)?.depositBalance ?? (entity.annualRevenue ? entity.annualRevenue * 0.12 : 0),
    productCount: getEnrichedBusiness(entity.id)?.products.length ?? deterministicValue(entity.id + '_pc', 2, 5),
  };
}

/**
 * Transform array of SmbEntity to CustomerEntity[]
 */
export function adaptSmbEntitiesToCustomers(entities: SmbEntity[]): CustomerEntity[] {
  return entities.map(adaptSmbEntityToCustomer);
}

/**
 * BFF Customer list item type (from /customers endpoint)
 */
export interface BffCustomerListItem {
  id: string;
  businessName: string;
  dbaName?: string;
  ein?: string;
  naicsCode?: string;
  businessType?: string;
  addressCity?: string;
  addressState?: string;
  annualRevenue?: number;
  employeeCount?: number;
  latestScore?: number;
  riskClass?: string;
  lastScorePull?: string;
  createdAt?: string;
}

/**
 * Transform BFF customer list response to CustomerEntity[]
 */
export function adaptBffCustomerList(customers: BffCustomerListItem[]): CustomerEntity[] {
  return customers.map(c => {
    const industry = c.naicsCode 
      ? (NAICS_TO_INDUSTRY[c.naicsCode] || `NAICS ${c.naicsCode}`)
      : 'Unknown';

    return {
      id: c.id,
      businessName: c.businessName,
      industry,
      naicsCode: c.naicsCode || '',
      segment: getSegment(c.annualRevenue),
      region: getRegion(c.addressState),
      branch: c.addressCity ? `${c.addressCity} Branch` : 'Main Branch',
      rhs: getEnrichedBusiness(c.id)?.rhs ?? deterministicValue(c.id + '_rhs', 65, 94),
      rhsChange: getEnrichedBusiness(c.id)?.rhsChange ?? deterministicValue(c.id + '_rhsc', -3, 6),
      primaryProduct: getEnrichedBusiness(c.id)?.products[0]?.name ?? 'Checking',
      riskTier: getRiskTier(c.riskClass, c.latestScore),
      relationshipStage: mapRelationshipStage(getEnrichedBusiness(c.id)?.relationshipStage) ?? 'growing',
      lastActivity: c.lastScorePull || c.createdAt || new Date().toISOString().split('T')[0],
      assignedRM: getEnrichedBusiness(c.id)?.assignedRM,
      totalExposure: getEnrichedBusiness(c.id)?.totalExposure ?? (c.annualRevenue ? c.annualRevenue * 0.15 : 0),
      depositBalance: getEnrichedBusiness(c.id)?.depositBalance ?? (c.annualRevenue ? c.annualRevenue * 0.12 : 0),
      productCount: getEnrichedBusiness(c.id)?.products.length ?? deterministicValue(c.id + '_pc', 2, 5),
    };
  });
}
