# Deployment Guide

## 1. Push to GitHub

From the project root:

```bash
git init
git add .
git commit -m "Initial commit: AdsEasy Media website"
git branch -M main
git remote add origin https://github.com/<your-username>/adseasymedia-website.git
git push -u origin main
```

Or without the CLI: create a new repo on github.com → "uploading an existing file" → drag the whole folder in.

## 2. Deploy on Vercel

1. Sign in at [vercel.com](https://vercel.com) (GitHub login recommended).
2. **Add New → Project** → import `adseasymedia-website`.
3. Settings (Vercel auto-detects most of this):
   - Framework preset: **Other**
   - Build command: *(leave empty)*
   - Output directory: *(leave empty — serves from root)*
   - Install command: *(leave empty)*
4. Click **Deploy**. Live in ~30 seconds at `<project>.vercel.app`.

Every push to `main` auto-deploys. Pull requests get preview URLs.

### Alternative: Vercel CLI

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

## 3. Custom domain

1. Vercel project → **Settings → Domains** → add `adseasymedia.com` and `www.adseasymedia.com`.
2. At your registrar, point DNS as Vercel instructs (A record `76.76.21.21` for apex, CNAME `cname.vercel-dns.com` for www).
3. HTTPS is automatic.

## 4. After the domain is live

- Search-replace `https://www.adseasymedia.com` in all HTML files, `sitemap.xml`, and `robots.txt` if your real domain differs.
- Complete everything in [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) (contact details, forms, stats).
- Submit `sitemap.xml` in Google Search Console.

## How `vercel.json` is configured

| Setting | Effect |
|---|---|
| `cleanUrls: true` | `/about` serves `about.html`; `.html` URLs redirect to clean ones |
| Security headers | `nosniff`, `X-Frame-Options: DENY`, referrer & permissions policies |
| `/assets/*` caching | 1 year, immutable |
| HTML caching | `must-revalidate` — updates appear immediately after deploy |
