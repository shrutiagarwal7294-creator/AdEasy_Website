# Architecture

## Overview

Pure static site: 47 flat HTML pages + one shared stylesheet + two JS files. No framework, no build step, no server-side code. Any static host serves it as-is.

```
Browser ──▶ *.html ──▶ assets/css/style.css   (design system, all components)
                   ──▶ assets/js/main.js       (shared behaviour, every page)
                   └──▶ assets/js/calculators.js (tools.html only)
```

## Page flow

```
index.html (Home)
├── about.html
├── services.html (hub) ──▶ 18 service pages (modern-seo, google-ads, meta-ads, ...)
├── industries.html (hub) ──▶ 11 industry pages (industry-*.html)
├── tools.html ──▶ 8 interactive calculators (single page)
├── blog.html (hub) ──▶ 6 articles (blog-*.html)
├── case-studies.html
├── faq.html
├── contact.html (6 forms)
└── footer ──▶ privacy.html · terms.html · cookies.html
```

Every page shares the same header (sticky nav + mega menus for Services/Industries) and footer. Navigation is duplicated in each HTML file — **changing the nav means updating all 47 files** (search-and-replace).

## CSS (`assets/css/style.css`)

Single stylesheet, ~423 lines. CSS custom properties define the design system (primary blue `#0B63CE`, fonts Manrope/Poppins via Google Fonts). Mobile-first responsive; mega menu collapses to accordion under 1024px.

## JavaScript

### `assets/js/main.js` — loaded on every page
- Sticky nav (adds `.scrolled` class past 10px)
- Mobile burger menu + submenu toggles
- Scroll-reveal animations (`IntersectionObserver` on `.reveal` elements)
- Animated counters (`data-count` / `data-suffix` attributes)
- Accordions, testimonial slider, back-to-top button
- Contact form validation + success animation — **email integration is a placeholder**; wire the marked section to a CRM/email endpoint

### `assets/js/calculators.js` — tools.html only
- 8 calculators: Google Ads Cost, Growth Rate, ROI, LTV/CAC, SaaS Churn, CAC, MRR, CRC
- Tab activation, canvas-based chart drawing, download/share of results
- No external chart library — charts drawn with vanilla `<canvas>`

## SEO

Each page carries: meta title/description, canonical URL, Open Graph + Twitter cards, and JSON-LD structured data (Organization, WebSite, Service, FAQPage, BreadcrumbList, BlogPosting as appropriate). Plus `sitemap.xml` and `robots.txt` at root.

All canonical/OG/sitemap URLs point to the placeholder domain `https://www.adseasymedia.com` — replace with the real domain before launch (see LAUNCH-CHECKLIST.md).

## Vercel behaviour (`vercel.json`)

- `cleanUrls: true` — serves `/about` for `about.html`; requests to `/about.html` 308-redirect to `/about`. Internal `href="about.html"` links keep working via that redirect.
- Security headers on all routes; 1-year immutable cache on `/assets/*`; no-cache on HTML.
- After launch, consider updating canonical URLs in the HTML from `.../about.html` to `.../about` to match clean URLs.
