---
description: Find and fix React runtime crashes using error injection
allowed-tools: Bash, Read, Edit, Write
---
CRASH DEBUGGING — Do NOT analyze minified JS. Do NOT spend more than 2 minutes on static analysis.
1. Add window.onerror to index.html head BEFORE any scripts:
<script>window.onerror=function(m,u,l,c,e){document.body.innerHTML='<pre style="color:red;padding:20px">CRASH: '+m+'\nFile: '+u+'\nLine: '+l+'\nStack: '+(e?e.stack:'none')+'</pre>'};window.addEventListener('unhandledrejection',function(e){document.body.innerHTML='<pre style="color:red;padding:20px">PROMISE: '+e.reason+'\nack: '+(e.reason&&e.reason.stack?e.reason.stack:'none')+'</pre>'})</script>
2. Build: npm run build
3. Start: npx vite preview --port 4173
4. Fetch each route, look for CRASH: or PROMISE: in response body
5. The error tells you EXACTLY what broke. Fix it. Rebuild. Retest.
6. Remove the window.onerror script once fixed.
7. Run /audit to verify everything.
