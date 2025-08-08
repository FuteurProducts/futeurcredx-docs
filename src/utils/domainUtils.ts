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
  
  // Get URL parameters for local development testing
  const urlParams = new URLSearchParams(window.location.search);
  const testMode = urlParams.get('mode');
  
  // Check if we're on one of our known domains (including local testing)
  const isInstitutionsDomain = currentHostname.includes('institutions.futeurcredx.com') || 
                              currentHostname.includes('institutions.credbyfuteur.local') ||
                              (isLocalhost && testMode === 'institutions');
  const isPlatformDomain = currentHostname.includes('platform.futeurcredx.com') || 
                          currentHostname.includes('platform.credbyfuteur.local') ||
                          (isLocalhost && testMode === 'platform');
  const isDocsDomain = currentHostname.includes('docs.futeurcredx.com') || 
                      currentHostname.includes('docs.credbyfuteur.local') ||
                      (isLocalhost && testMode === 'docs');
  
  // If a specific target domain is provided, use it
  if (targetDomain) {
    if (isLocalhost) {
      // For localhost, use relative URLs with appropriate mode parameter
      const targetMode = targetDomain.includes('institutions') ? 'institutions' :
                        targetDomain.includes('platform') ? 'platform' :
                        targetDomain.includes('docs') ? 'docs' : null;
      return targetMode ? `${path}?mode=${targetMode}` : path;
    }
    return `https://${targetDomain}${path}`;
  }
  
  // For main navigation paths, always go back to the main domain
  const mainDomainPaths = ['/', '/business', '/enterprise', '/lumiq-build', '/credit-journey', '/faq', '/docs'];
  if (mainDomainPaths.includes(path) && (isInstitutionsDomain || isPlatformDomain || isDocsDomain)) {
    if (isLocalhost) {
      // For localhost, remove mode parameter for main domain paths
      return path;
    }
    return `https://futeurcredx.com${path}`;
  }
  
  // Otherwise, preserve the current domain for subdomain-specific paths
  if (isInstitutionsDomain) {
    if (isLocalhost) {
      return `${path}?mode=institutions`;
    }
    return `https://institutions.futeurcredx.com${path}`;
  } else if (isPlatformDomain) {
    if (isLocalhost) {
      return `${path}?mode=platform`;
    }
    return `https://platform.futeurcredx.com${path}`;
  } else if (isDocsDomain) {
    if (isLocalhost) {
      return `${path}?mode=docs`;
    }
    return `https://docs.futeurcredx.com${path}`;
  }
  
  // Fallback to relative URL for local development
  return path;
};
