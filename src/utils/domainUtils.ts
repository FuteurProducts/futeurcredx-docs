/**
 * Utility functions for handling cross-domain navigation
 */

/**
 * Get the correct URL for navigation that works across subdomains
 * @param path - The relative path (e.g., "/business")
 * @param targetDomain - Optional specific domain to link to
 * @returns Full URL including domain
 */
export const getCrossDomainUrl = (path: string, targetDomain?: string): string => {
  // Default to current hostname
  const currentHostname = window.location.hostname;
  
  // Check if we're on one of our known domains
  const isInstitutionsDomain = currentHostname.includes('institutions.credbyfuteur.com');
  const isPlatformDomain = currentHostname.includes('platform.credbyfuteur.com');
  
  // If a specific target domain is provided, use it
  if (targetDomain) {
    return `https://${targetDomain}${path}`;
  }
  
  // Otherwise, preserve the current domain
  if (isInstitutionsDomain) {
    return `https://institutions.credbyfuteur.com${path}`;
  } else if (isPlatformDomain) {
    return `https://platform.credbyfuteur.com${path}`;
  }
  
  // Fallback to relative URL for local development
  return path;
};
