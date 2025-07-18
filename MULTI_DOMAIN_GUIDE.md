# Multi-Domain Management Guide for Vercel

This guide shows how to manage multiple domains (like `credbyfuteur.com`, `institutions.credbyfuteur.com`, `platform.credbyfuteur.com`) with different content/routing using Vercel.

## 1. Vercel Configuration

### Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 2. Domain-Specific Routing in React

### Update your `App.tsx` or main router:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Import your components
import Index from './pages/Index';
import Business from './pages/Business';
import Enterprise from './pages/Enterprise';
import InstitutionsDashboard from './pages/InstitutionsDashboard';
import PlatformDashboard from './pages/PlatformDashboard';
import NotFound from './pages/NotFound';

const AppRouter = () => {
  const [currentDomain, setCurrentDomain] = useState('');

  useEffect(() => {
    setCurrentDomain(window.location.hostname);
  }, []);

  // Domain-specific routing logic
  const getDomainRoutes = () => {
    const hostname = window.location.hostname;
    
    // Institutions subdomain
    if (hostname.includes('institutions.')) {
      return (
        <Routes>
          <Route path="/" element={<InstitutionsDashboard />} />
          <Route path="/dashboard" element={<InstitutionsDashboard />} />
          <Route path="/analytics" element={<InstitutionsAnalytics />} />
          <Route path="/settings" element={<InstitutionsSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }
    
    // Platform subdomain
    if (hostname.includes('platform.')) {
      return (
        <Routes>
          <Route path="/" element={<PlatformDashboard />} />
          <Route path="/dashboard" element={<PlatformDashboard />} />
          <Route path="/reports" element={<PlatformReports />} />
          <Route path="/profile" element={<PlatformProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }
    
    // Main domain (credbyfuteur.com)
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/business" element={<Business />} />
        <Route path="/enterprise" element={<Enterprise />} />
        <Route path="/fintech" element={<Fintech />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/lumiq-build" element={<LumiqBuild />} />
        <Route path="/credit-journey" element={<CreditJourney />} />
        <Route path="/app" element={<App />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {getDomainRoutes()}
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
```

## 3. Domain Utility Functions

### Create `src/utils/domainUtils.ts`:

```typescript
/**
 * Utility functions for handling cross-domain navigation
 */

export const getDomainType = (): 'main' | 'institutions' | 'platform' | 'unknown' => {
  const hostname = window.location.hostname;
  
  if (hostname.includes('institutions.')) return 'institutions';
  if (hostname.includes('platform.')) return 'platform';
  if (hostname.includes('credbyfuteur.com') || hostname.includes('localhost')) return 'main';
  
  return 'unknown';
};

export const getMainDomain = (): string => {
  const hostname = window.location.hostname;
  
  if (hostname.includes('localhost')) return 'http://localhost:5173';
  
  return 'https://credbyfuteur.com';
};

export const getInstitutionsDomain = (): string => {
  const hostname = window.location.hostname;
  
  if (hostname.includes('localhost')) return 'http://institutions.localhost:5173';
  
  return 'https://institutions.credbyfuteur.com';
};

export const getPlatformDomain = (): string => {
  const hostname = window.location.hostname;
  
  if (hostname.includes('localhost')) return 'http://platform.localhost:5173';
  
  return 'https://platform.credbyfuteur.com';
};

/**
 * Get the correct URL for navigation that works across subdomains
 */
export const getCrossDomainUrl = (path: string, targetDomain?: 'main' | 'institutions' | 'platform'): string => {
  const currentDomain = getDomainType();
  
  // If no target domain specified, use current domain logic
  if (!targetDomain) {
    const mainDomainPaths = ['/', '/business', '/enterprise', '/lumiq-build', '/credit-journey'];
    
    // If on subdomain and accessing main paths, go to main domain
    if (mainDomainPaths.includes(path) && (currentDomain === 'institutions' || currentDomain === 'platform')) {
      return `${getMainDomain()}${path}`;
    }
    
    // Otherwise stay on current domain
    return path;
  }
  
  // Navigate to specific domain
  switch (targetDomain) {
    case 'main':
      return `${getMainDomain()}${path}`;
    case 'institutions':
      return `${getInstitutionsDomain()}${path}`;
    case 'platform':
      return `${getPlatformDomain()}${path}`;
    default:
      return path;
  }
};
```

## 4. Domain-Specific Components

### Create domain-specific headers/navigation:

```tsx
// src/components/DomainHeader.tsx
import { getDomainType, getCrossDomainUrl } from '../utils/domainUtils';

const DomainHeader = () => {
  const domainType = getDomainType();
  
  if (domainType === 'institutions') {
    return (
      <header className="bg-blue-900 text-white p-4">
        <nav className="flex justify-between items-center">
          <h1>Institutions Portal</h1>
          <div className="space-x-4">
            <a href="/dashboard">Dashboard</a>
            <a href="/analytics">Analytics</a>
            <a href={getCrossDomainUrl('/', 'main')}>Main Site</a>
          </div>
        </nav>
      </header>
    );
  }
  
  if (domainType === 'platform') {
    return (
      <header className="bg-green-900 text-white p-4">
        <nav className="flex justify-between items-center">
          <h1>Platform Portal</h1>
          <div className="space-x-4">
            <a href="/dashboard">Dashboard</a>
            <a href="/reports">Reports</a>
            <a href={getCrossDomainUrl('/', 'main')}>Main Site</a>
          </div>
        </nav>
      </header>
    );
  }
  
  // Main domain header
  return (
    <header className="bg-black text-white p-4">
      <nav className="flex justify-between items-center">
        <h1>FuteurCred</h1>
        <div className="space-x-4">
          <a href="/">Home</a>
          <a href="/business">Business</a>
          <a href="/enterprise">Enterprise</a>
          <a href={getCrossDomainUrl('/', 'institutions')}>Institutions</a>
          <a href={getCrossDomainUrl('/', 'platform')}>Platform</a>
        </div>
      </nav>
    </header>
  );
};

export default DomainHeader;
```

## 5. Vercel Deployment Setup

### Step 1: Add Domains in Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Domains"
3. Add your domains:
   - `credbyfuteur.com`
   - `institutions.credbyfuteur.com`
   - `platform.credbyfuteur.com`

### Step 2: DNS Configuration
Add these DNS records to your domain provider:

```
# Main domain
A     credbyfuteur.com          76.76.19.61
AAAA  credbyfuteur.com          2606:4700:10::6814:55ad

# Subdomains
CNAME institutions.credbyfuteur.com  cname.vercel-dns.com
CNAME platform.credbyfuteur.com      cname.vercel-dns.com
```

### Step 3: Environment Variables
Set up environment variables in Vercel:

```bash
# In Vercel dashboard → Settings → Environment Variables
VITE_MAIN_DOMAIN=https://credbyfuteur.com
VITE_INSTITUTIONS_DOMAIN=https://institutions.credbyfuteur.com
VITE_PLATFORM_DOMAIN=https://platform.credbyfuteur.com
```

## 6. Local Development Setup

### For local development with subdomains:

1. **Update your `/etc/hosts` file** (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 localhost
127.0.0.1 institutions.localhost
127.0.0.1 platform.localhost
```

2. **Update your dev server config** in `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  }
})
```

3. **Access your local sites**:
   - Main: `http://localhost:5173`
   - Institutions: `http://institutions.localhost:5173`
   - Platform: `http://platform.localhost:5173`

## 7. SEO and Meta Tags per Domain

### Create domain-specific meta tags:

```tsx
// src/components/DomainMeta.tsx
import { Helmet } from 'react-helmet-async';
import { getDomainType } from '../utils/domainUtils';

const DomainMeta = () => {
  const domainType = getDomainType();
  
  const getMetaData = () => {
    switch (domainType) {
      case 'institutions':
        return {
          title: 'Institutions Portal - FuteurCred',
          description: 'Banking and financial institutions portal for FuteurCred',
          ogImage: '/images/institutions-og.png'
        };
      case 'platform':
        return {
          title: 'Platform Dashboard - FuteurCred',
          description: 'Business platform dashboard for FuteurCred',
          ogImage: '/images/platform-og.png'
        };
      default:
        return {
          title: 'FuteurCred - Your Business Credit Operating System',
          description: 'Complete business credit operating system with AI-powered insights',
          ogImage: '/images/main-og.png'
        };
    }
  };
  
  const meta = getMetaData();
  
  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.ogImage} />
    </Helmet>
  );
};

export default DomainMeta;
```

## 8. Quick Copy-Paste Checklist

For implementing this on other websites:

- [ ] Create `vercel.json` with routing config
- [ ] Update main router with domain detection
- [ ] Create `domainUtils.ts` with helper functions
- [ ] Add domain-specific components
- [ ] Configure DNS records
- [ ] Add domains in Vercel dashboard
- [ ] Set up environment variables
- [ ] Update local development setup
- [ ] Add domain-specific meta tags
- [ ] Test cross-domain navigation

## 9. Common Issues & Solutions

### Issue: Subdomain not working locally
**Solution**: Make sure `/etc/hosts` is updated and dev server allows host access

### Issue: Cross-domain navigation not working
**Solution**: Check `getCrossDomainUrl` function and ensure proper domain detection

### Issue: SEO issues on subdomains
**Solution**: Implement domain-specific meta tags and sitemaps

### Issue: SSL certificate problems
**Solution**: Vercel automatically handles SSL for all added domains

This guide provides a complete setup for managing multiple domains with different content on Vercel. Copy and adapt the code snippets for your specific use case!
