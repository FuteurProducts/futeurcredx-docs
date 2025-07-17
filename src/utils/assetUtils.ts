/**
 * Asset utility functions for handling asset URLs across different domains
 */

/**
 * Gets the correct asset URL regardless of which domain/subdomain the site is being accessed from
 * This ensures assets load properly across main domain and subdomains
 * 
 * @param path The relative path to the asset (e.g., '/logos/banks/chase.png')
 * @returns The correct URL to load the asset
 */
export function getAssetUrl(path: string): string {
  // If path is already absolute with http/https, return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Make sure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // For local development, use the path as is
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return normalizedPath;
  }
  
  // Get the main domain for production
  // This handles subdomains by referring to assets from the main domain
  const hostname = window.location.hostname;
  const isProdDomain = hostname.includes('credbyfuteur.com');
  
  if (isProdDomain) {
    // Handle subdomains by always loading assets from the main domain
    const protocol = window.location.protocol;
    return `${protocol}//credbyfuteur.com${normalizedPath}`;
  }
  
  // Default case: return the normalized path
  return normalizedPath;
}
