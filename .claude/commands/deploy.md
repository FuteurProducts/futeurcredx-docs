---
description: Build, push to GitHub, deploy to Vercel, and verify all routes
allowed-tools: Bash, Read
---
DEPLOY WORKFLOW — Follow these steps:
1. BUILD: Run npm run build. If it fails, stop and fix errors.
2. LOCAL TEST: Start npx vite preview --port 4173, wait 5s, then curl every route: /, /quickstart, /authentication, /api-reference, /sandbox, /errors, /data-models, /webhooks, /changelog, /faq. ALL must return HTTP 200. If any fail, stop and fix.
3. PUSH: git add -A && git commit -m "$ARGUMENTS" && git push --force https://$GITHUB_PAT@github.com/FuteurProducts/futeurcredx-docs.git main (Use the GitHub PAT from CLAUDE.md)
4. DEPLOY: curl -s -X POST "https://api.vercel.com/v13/deployments" -H "Authorization: Bearer $VERCEL_TOKEN" -H "Content-Type: application/json" -d '{"name":"futeur-cred-website","project":"futeur-cred-website","gitSource":{"type":"github","org":"FuteurProducts","repo":"futeurcredx-docs","ref":"main"},"target":"production"}' (Use the Vercel token from CLAUDE.md)
5. WAIT: Sleep 150 seconds for Vercel build.
6. VERIFY: Curl all 10 routes on docs.futeurcredx.com. All must return 200. Check security headers. Check cache headers to confirm new deploy is live.
7. REPORT: Show pass/fail for each route. If any fail, diagnose and fix.
