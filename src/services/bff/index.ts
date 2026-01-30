/**
 * BFF Services Index
 * Centralized export for all BFF API services
 */

export { default as bffClient, type BffResponse, type BffListResponse, type BffError, type BffRequestOptions } from './client';

export { default as customersService } from './customers';
export { default as scoresService } from './scores';
export { default as offersService } from './offers';
export { default as applicationsService } from './applications';
export { default as reportsService } from './reports';
export { default as riskService } from './risk';
export { default as auditService, type ClientAuditEventType } from './audit';
export { default as apiKeysService } from './apiKeys';

// Re-export all types
export * from './types';
