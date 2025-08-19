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
  const isLocalhost = currentHostname === 'localhost' || currentHostname === '127.0.0.1';
  
  // Check if we're on one of our known domains
  const isInstitutionsDomain = currentHostname.includes('institutions.futeurcredx.com');
  const isPlatformDomain = currentHostname.includes('platform.futeurcredx.com');
  const isDocsDomain = currentHostname.includes('docs.futeurcredx.com');
  
  // For local development
  if (isLocalhost) {
    // If running locally, just use relative paths
    return path;
  }
  
  // If a specific target domain is provided, use it
  if (targetDomain) {
    return `https://${targetDomain}${path}`;
  }
  
  // For main navigation paths, always go back to the main domain
  const mainDomainPaths = ['/', '/business', '/enterprise', '/lumiq-build', '/credit-journey', '/faq', '/docs', '/login', '/register', '/dashboard'];
  if (mainDomainPaths.includes(path) && (isInstitutionsDomain || isPlatformDomain || isDocsDomain)) {
    return `https://futeurcredx.com${path}`;
  }
  
  // Otherwise, preserve the current domain for subdomain-specific paths
  if (isInstitutionsDomain) {
    return `https://institutions.futeurcredx.com${path}`;
  } else if (isPlatformDomain) {
    return `https://platform.futeurcredx.com${path}`;
  } else if (isDocsDomain) {
    return `https://docs.futeurcredx.com${path}`;
  }
  
  // Fallback to main domain
  return `https://futeurcredx.com${path}`;
};
