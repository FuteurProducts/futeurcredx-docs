import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Global cache to store rendered components
const routeCache = new Map<string, React.ReactNode>();

export const useRouteCache = (children: React.ReactNode) => {
  const location = useLocation();
  const [cachedChildren, setCachedChildren] = useState<React.ReactNode>(children);

  useEffect(() => {
    const pathname = location.pathname;
    
    // If we have cached content for this route, use it immediately
    if (routeCache.has(pathname)) {
      setCachedChildren(routeCache.get(pathname));
    } else {
      // Cache the current children for future visits
      routeCache.set(pathname, children);
      setCachedChildren(children);
    }
  }, [location.pathname, children]);

  return cachedChildren;
};

// Export the cache for external access
export { routeCache };

