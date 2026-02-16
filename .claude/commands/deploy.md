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

8. CHANGELOG (runs after deploy is verified live):

   a. Get the diff since the last changelog entry:
      LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)
      DIFF=$(git log $LAST_TAG..HEAD --pretty=format:"%s" --no-merges)
      FILES_CHANGED=$(git diff --stat $LAST_TAG..HEAD -- src/ | tail -1)

   b. Generate a bank-facing changelog entry using this prompt internally:

      "You are writing a changelog entry for LumiqAI, a credit analytics platform used by banks like JPMorgan Chase, Wells Fargo, Santander, and Citibank. Your audience is a bank CTO or integration engineer.

      Here are the raw git commits since the last release:
      $DIFF

      Files changed: $FILES_CHANGED

      Write a changelog entry with:
      - A date and professional title (e.g. 'Security & Compliance Update', 'API Accuracy Release', 'Platform Reliability Update')
      - 3-7 bullet points describing changes FROM THE BANK'S PERSPECTIVE
      - NO git hashes, NO file names, NO internal framework names (no PrismJS, no Vite, no Tailwind)
      - NO jargon. A bank compliance officer should understand every line.
      - Group related changes (don't list 42 brand fixes individually — say 'Brand consistency standardized across all platform surfaces')
      - Highlight security improvements, compliance changes, data accuracy fixes, and new capabilities
      - Use language like: 'Enhanced', 'Improved', 'Resolved', 'Added', 'Upgraded'
      - If a change affects API behavior, mention the endpoint
      - If a change affects data accuracy, explain what was wrong and what's now correct
      - Skip purely cosmetic changes unless they affect the bank-facing demo experience

      Return ONLY a JSON object:
      {
        \"version\": \"X.Y.Z\",
        \"date\": \"YYYY-MM-DD\",
        \"title\": \"Short Professional Title\",
        \"category\": \"security|compliance|api|platform|data\",
        \"highlights\": [\"bullet 1\", \"bullet 2\", ...],
        \"banksAffected\": [\"all\"] or [\"chase\", \"santander\"] if specific
      }"

   c. Parse the JSON response and prepend the new entry to src/docs/data/changelog.ts

   d. Rebuild and redeploy with the updated changelog included (repeat steps 1-7).

   e. Tag the release:
      git tag -a "v$VERSION" -m "$TITLE"
      git push --tags
