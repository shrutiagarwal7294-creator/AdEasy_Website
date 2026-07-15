# AdsEasy Media — Website

Static marketing website for AdsEasy Media, an AI-first digital marketing agency. 47 pages of pure HTML/CSS/JS — **no build step, no framework**. One exception: a small Vercel Serverless + Edge Middleware admin login (see [docs/ADMIN-LOGIN.md](docs/ADMIN-LOGIN.md)), which is why `package.json` now exists.

## Quick start

```bash
# Run locally (any static server works)
npx serve .
# or just open index.html in a browser
```

## Deploy to Vercel

1. Push this repo to GitHub (see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)).
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Framework preset: **Other**. Build command: *none*. Output directory: *root*. Deploy.

`vercel.json` is already configured with clean URLs (`/about` instead of `/about.html`), security headers, and asset caching.

## Project structure

```
├── index.html                  # Home page
├── about.html, contact.html, faq.html, ...
├── services.html               # Services hub → 18 service pages
├── industries.html             # Industries hub → 11 industry pages
├── blog.html                   # Blog hub → 6 articles (blog-*.html)
├── tools.html                  # 8 free marketing calculators
├── case-studies.html
├── privacy.html, terms.html, cookies.html
├── assets/
│   ├── css/style.css           # Single shared stylesheet
│   ├── js/main.js              # Shared behaviour (nav, animations, forms)
│   ├── js/calculators.js       # Calculator logic + charts (tools page)
│   └── og-cover.svg            # Open Graph image
├── robots.txt
├── sitemap.xml
├── vercel.json                 # Vercel config (clean URLs, headers)
├── login.html, admin.html      # Admin login + placeholder protected page
├── middleware.js               # Edge Middleware — gates /admin.html
├── api/login.js, api/logout.js # Serverless auth endpoints
├── scripts/hash-password.js    # Local helper to generate ADMIN_PASSWORD_HASH
└── docs/                       # Documentation
```

## Documentation

| Doc | Purpose |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the site works — page flow, navigation, JS/CSS, SEO setup |
| [docs/PAGES.md](docs/PAGES.md) | Full inventory of all 47 pages |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Step-by-step GitHub upload + Vercel deployment |
| [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md) | ⚠️ Placeholders to replace before going live |
| [docs/ADMIN-LOGIN.md](docs/ADMIN-LOGIN.md) | Admin login setup — env vars, password hashing, how it works |

## ⚠️ Before launch

Contact details, domain URLs, stats, and testimonials are **synthetic placeholders**. See [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md) before publishing.
