# Local Development Testing Guide

This guide explains how to test the multi-domain setup locally without needing actual subdomains.

## Quick Testing URLs

Use these URLs to test different domain configurations locally:

### Main Domain (credbyfuteur.com)
```
http://localhost:5173/
http://localhost:5173/business
http://localhost:5173/enterprise
http://localhost:5173/lumiq-build
http://localhost:5173/credit-journey
http://localhost:5173/faq
http://localhost:5173/docs
http://localhost:5173/futeurcred-plus
```

### Physical Local Routes (No URL Parameters Needed)

#### Institutions Domain Testing
```
http://localhost:5173/institutions
http://localhost:5173/institutions/any-path
http://localhost:5173/institutions/test-route
```

#### Platform Domain Testing
```
http://localhost:5173/platform
http://localhost:5173/platform/any-path
http://localhost:5173/platform/api-test
```

#### Docs Domain Testing
```
http://localhost:5173/docs-test
http://localhost:5173/docs-test/getting-started
http://localhost:5173/docs-test/api-reference
```

### Alternative: URL Parameter Method

#### Institutions Domain (institutions.credbyfuteur.com)
```
http://localhost:5173/?mode=institutions
http://localhost:5173/faq?mode=institutions
http://localhost:5173/any-path?mode=institutions
```

#### Platform Domain (platform.credbyfuteur.com)
```
http://localhost:5173/?mode=platform
http://localhost:5173/faq?mode=platform
http://localhost:5173/any-path?mode=platform
```

#### Docs Domain (docs.credbyfuteur.com)
```
http://localhost:5173/?mode=docs
http://localhost:5173/any-path?mode=docs
```

## How It Works

The app detects the `mode` parameter in the URL and simulates the subdomain behavior:

- **No mode parameter**: Shows main domain content (Index, Business, etc.)
- **`?mode=institutions`**: Shows Enterprise page for all routes (except /faq)
- **`?mode=platform`**: Shows Fintech page for all routes (except /faq)
- **`?mode=docs`**: Shows Docs page for all routes

## Testing Cross-Domain Navigation

1. Start on main domain: `http://localhost:5173/`
2. Navigate to institutions mode: `http://localhost:5173/?mode=institutions`
3. Click footer links - they should redirect back to main domain
4. Test FAQ links from subdomains: `http://localhost:5173/faq?mode=institutions`

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing Checklist

- [ ] Main domain routes work correctly
- [ ] Institutions mode shows Enterprise page
- [ ] Platform mode shows Fintech page
- [ ] Docs mode shows Docs page
- [ ] FAQ works on all domains
- [ ] Footer navigation works across domains
- [ ] Header navigation works correctly
- [ ] 404 page shows for invalid routes on main domain

## Advanced Local Testing with Hosts File

For more realistic testing, you can modify your hosts file to use actual subdomains locally:

### macOS/Linux
Add to `/etc/hosts`:
```
127.0.0.1 credbyfuteur.local
127.0.0.1 institutions.credbyfuteur.local
127.0.0.1 platform.credbyfuteur.local
127.0.0.1 docs.credbyfuteur.local
```

Then access:
- http://credbyfuteur.local:5173
- http://institutions.credbyfuteur.local:5173
- http://platform.credbyfuteur.local:5173
- http://docs.credbyfuteur.local:5173

### Windows
Add to `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1 credbyfuteur.local
127.0.0.1 institutions.credbyfuteur.local
127.0.0.1 platform.credbyfuteur.local
127.0.0.1 docs.credbyfuteur.local
```

## Troubleshooting

### Mode Parameter Not Working
- Ensure you're using the exact parameter name: `?mode=institutions`
- Check browser console for any JavaScript errors
- Clear browser cache and reload

### Navigation Issues
- Check that `domainUtils.ts` is properly handling localhost
- Verify footer and header components are using `getCrossDomainUrl`
- Test with browser dev tools network tab to see actual requests

### Build Issues
- Run `npm run build` to test production build
- Use `npm run preview` to test built version locally
