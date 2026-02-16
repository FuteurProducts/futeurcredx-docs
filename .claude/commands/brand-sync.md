---
description: Fetch branding from www.futeurcredx.com and sync to docs site
allowed-tools: Bash, Read, Edit, Write
---
BRAND SYNC:
1. Fetch: curl -s -L "https://www.futeurcredx.com" > /tmp/www-source.html
2. Extract footer structure and all legal text (Privacy, Terms, GLBA, disclaimers)
3. Extract logo image/SVG
4. Extract favicon
5. Compare against current docs site. Fix any mismatches.
6. The docs site must use IDENTICAL branding to www.futeurcredx.com. Do NOT make up footer links. Do NOT use text instead of logo images.
7. Rebuild and test.
