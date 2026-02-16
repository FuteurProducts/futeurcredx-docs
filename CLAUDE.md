# LumiqAI Platform — Claude Code Context

## Project
LumiqAI is an SMB credit analytics platform sold to banks.
This repo contains BOTH the Dashboard (Clerk auth) and the Docs site (no auth).
Hostname routing in src/main.tsx decides which app to render:
- docs.futeurcredx.com → DocsApp
- all other hostnames → Dashboard App

## Tech Stack
- Vite + React + TypeScript + Tailwind + shadcn/ui
- Auth: Clerk (Dashboard only, not Docs)
- API: NestJS on EC2 at api.sandbox.futeurcredx.com
- Deploy: Vercel (marketing sites + docs), S3+CloudFront (dashboard)

## Tokens and API Keys
ALL TOKENS AND API KEYS REMOVED FROM VERSION CONTROL FOR SECURITY.
See CLAUDE.local.md (git-ignored) or your secrets manager for:
- Vercel tokens (products@futeur.ai account)
- GitHub PATs (FuteurProducts org)
- Bank sandbox API keys (Chase, Wells Fargo, Santander, Citi)
- Swagger credentials (prod and sandbox)

## Git Push (docs site)
```bash
# Replace $GITHUB_PAT with your personal access token from CLAUDE.local.md
git push --force https://$GITHUB_PAT@github.com/FuteurProducts/futeurcredx-docs.git main
```

## Vercel Deploy (docs site)
```bash
# Replace $VERCEL_TOKEN with token from CLAUDE.local.md
curl -s -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"futeur-cred-website","project":"futeur-cred-website","gitSource":{"type":"github","org":"FuteurProducts","repo":"futeurcredx-docs","ref":"main"},"target":"production"}'
```

## Domain Map
- docs.futeurcredx.com → Vercel → FuteurProducts/futeurcredx-docs
- sandbox.futeurcredx.com / db.futeurcredx.com → S3Front
- api.sandbox.futeurcredx.com → EC2 NestJS
- www.futeurcredx.com → Vercel → FuteurProducts/futeurcredx-website
- chase/wells-fargo/santander/citibank.futeurcredx.com → Vercel

## MANDATORY RULES
1. NEVER push without testing locally first (npm run build + vite preview + verify all routes)
2. NEVER report "all routes HTTP 200" as proof something works — you must verify CONTENT renders
3. NEVER commit tokens, API keys, or secrets to git — use CLAUDE.local.md (git-ignored)
4. NEVER make up content (footers, logos, claims) — always fetch from www.futeurcredx.com first
5. ALWAYS match branding to www.futeurcredx.com (logo, footer, colors, legal text)
6. ALWAYS run /audit before deploying
7. Use /deploy to push and deploy — it includes verification steps
