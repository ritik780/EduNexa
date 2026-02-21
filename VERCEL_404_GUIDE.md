# Understanding & Fixing Vercel 404: NOT_FOUND for SPAs

## 1. The Fix (What to Change)

### Code changes made
- **`frontend/vite.config.js`**: Added explicit `base: '/'` and `build.outDir: 'dist'`
- **`frontend/vercel.json`**: Added `framework: null`, `buildCommand`, and `outputDirectory` so Vercel doesn’t override your config

### Vercel Dashboard settings
1. **Project Settings → General**
2. **Root Directory**: `frontend` (so Vercel uses `frontend/` as the project root)
3. **Framework Preset**: **Other** (not Vite) – avoids Vercel overriding your rewrites
4. Save, then **Redeploy** (Deployments → ⋯ → Redeploy)

---

## 2. Root Cause

### What was happening
- **Intended**: `/feed`, `/login`, `/sign-in/sso-callback` should load your SPA; React Router handles routing.
- **Actual**: Vercel treated each path as a file request. There is no `/feed` file, only `index.html`, so Vercel returned 404.

### Why it happened
1. **Static hosting vs SPA**
   - Vercel maps URLs to files (e.g. `/about` → `/about/index.html` or `/about.html`).
   - Your SPA has one `index.html`; all routes are handled in the browser by React Router.
   - Without a rewrite, paths like `/feed` have no matching file → 404.

2. **Framework preset**
   - If Framework Preset is "Vite", Vercel may apply its own config and ignore or override your `vercel.json` rewrites.

3. **Root directory**
   - If Root Directory is wrong, Vercel may use the wrong `vercel.json` or build/output folders.

---

## 3. Underlying Concepts

### Why this behavior exists
- Vercel supports both:
  - **Multi-page apps**: each route = separate file
  - **SPAs**: one entry file, client-side routing
- It can’t assume you’re building an SPA, so it defaults to file-based routing. You must configure the “fallback” behavior.

### Mental model
1. Request comes in (e.g. `GET /feed`).
2. Vercel checks for a file at that path → none found.
3. Without a rewrite, it returns 404.
4. With a rewrite like `"/(.*)" → "/index.html"`, it serves `index.html` instead.
5. React loads, React Router reads `/feed` and renders the right component.

### How it fits in
- Rewrites run **after** static file lookup.
- Static assets (`/assets/*`, `/favicon.png`) are served as files.
- All other paths are sent to `index.html` so the SPA can handle them.

---

## 4. Warning Signs & Similar Issues

### Signs this might happen again
- Refresh on `/feed` (or any non-root route) returns 404.
- Direct link to a route shows 404; navigation from `/` works.
- 404 appears right after OAuth/callback redirects.

### Similar situations
- **Netlify**: use `_redirects` or `netlify.toml` rewrites.
- **Firebase Hosting**: use `"source": "**", "destination": "/index.html"` in `firebase.json`.
- **AWS S3 + CloudFront**: configure 404 and 403 to return `index.html`.

### Code smells
- SPA deployed without any routing/rewrite config.
- `vercel.json` present but no `rewrites` for SPA fallback.
- Framework preset set to “Vite” or “Create React App” while you rely on custom routing.

---

## 5. Alternatives & Trade-offs

| Approach | Pros | Cons |
|----------|------|------|
| **Rewrites in vercel.json** | Standard, clear, no app changes | Requires correct Root Directory and framework preset |
| **404.html = index.html** | Extra fallback if rewrites fail | Same content in two files; still need rewrites in practice |
| **Serverless function** | Full control over response | More setup, slower than static rewrites |
| **Next.js or similar** | Built-in SPA routing | Requires framework change |

**Practical choice**: Use `rewrites` in `vercel.json` plus Framework Preset "Other", and keep the 404 fallback as a safety net.
