---
description: Full quality audit of the docs site
allowed-tools: Bash, Read, Grep, Glob
---
DOCS SITE AUDIT — Check everything:
1. FILE INTEGRITY: Verify all 10 page components exist and are non-empty (Home, Quickstart, Authentication, ApiReference, Sandbox, Errors, DataModels, Webhooks, Changelog, FAQ)
2. IMPORT VERIFICATION: For each page, verify every import resolves to a real file.
3. DATA SHAPE CHECK: For each data file, verify exports match what pages expect.
4. LINK AUDIT: Find every Link, a href, onClick, navigate() in src/docs/. Cross-reference sidebar links against Router paths. Flag mismatches.
5. BAD PATTERN SCAN: localhost, staging, TODO, FIXME, placeholder, console.log, undefined/NaN/null in JSX
6. CLAIM VERIFICATION: Find every stat claim (50,000+, 99.9%, SOC 2, etc.) and flag as UNVERIED.
7. BRANDING CHECK: Logo must be image not text. Title must not say Dashboard. Footer must match www.futeurcredx.com. Copyright 2026.
8. SECURITY: vercel.json exists with SPA rewrites. Security headers configured. No API keys in client code.
9. BUILD: npm run build must pass with 0 errors.
Report ALL findings with file:line references. Do NOT summarize.
