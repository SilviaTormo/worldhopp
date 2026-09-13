# Worldhopp — run & preview doc

Static Angular 20 site (single home page + lazy destination routes). No backend, no env files needed.

## Reproduce artifacts

1. Install deps (npm; there is a package-lock.json):
   ```
   npm ci        # or: npm install
   ```
2. Production build (compiles Angular AND generates `dist/worldhopp-modern/browser/404.html` for GitHub Pages deep links):
   ```
   npm run build
   ```
   - Expected: ~97.8 kB initial transfer, zero errors. A MODULE_TYPELESS_PACKAGE_JSON warning from `scripts/make-404.js` is harmless.
   - Always build via `npm run build`, never bare `ng build` — the 404 step only runs in the npm script.

## Run the preview server

Serve the built output with caching disabled (avoids the stale-bundle trap — the embedded browser caches `main-*.js` aggressively when max-age > 0):

```
npx http-server dist/worldhopp-modern/browser -p 4301 -c-1 --silent
```

- Port: 4301 (project's established preview port; 4200/4300 reserved for `ng serve`).
- Detached launch (Windows, PowerShell):
  ```
  powershell -NoProfile -Command "(Start-Process -FilePath 'npx.cmd' -ArgumentList 'http-server','dist/worldhopp-modern/browser','-p','4301','-c-1','--silent' -RedirectStandardOutput '<log>' -RedirectStandardError '<log>.err' -WindowStyle Hidden -PassThru).Id"
  ```
  Note: Start-Process on the `.cmd` shim keeps the wrapper alive until the server exits, so run it with a generous timeout or expect the call to "time out" while the server itself is up. Verify with `netstat -ano | grep :4301` and `Get-Process -Id <pid>`.
- Health checks: `http://127.0.0.1:4301/` → 200. `/destino/<slug>` deep links return 404 on http-server (no SPA fallback); GitHub Pages serves the generated `404.html` instead, so deep links work there. Client-side navigation from home works everywhere.

## Known quirks of the embedded preview browser

- `scrollIntoView` is broken — use `src/app/shared/scroll-to.ts` (rAF helper) for all programmatic scrolling.
- CSS animations can stay frozen for offscreen elements — the Barcelona cable car is driven by rAF + IntersectionObserver instead.
- After rebuilding, hard-refresh / navigate to bust any cached bundle.
