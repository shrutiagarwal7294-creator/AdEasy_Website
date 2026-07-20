# AdsEasy Media Website — Project Notes (Handoff)

Last updated: 2026-07-20

This file exists so a new Claude session (different account) can pick up this project with full context. Paste this whole file into your first message on the new account, or just tell Claude to "read PROJECT-NOTES.md in this folder" if it has file access already.

## What this project is

A static marketing website for "AdsEasy Media," a digital marketing agency — 49+ HTML pages (services, industries, tools, blog, etc.) sharing one stylesheet and a few JS files. No build step, no framework — plain HTML/CSS/JS, opened directly or hosted as static files.

Root folder: `adseasymedia-website/adseasymedia-website/` (yes, nested once — the outer folder is just a wrapper).

Key shared files:
- `assets/css/style.css` — single stylesheet for the entire site.
- `assets/js/main.js` — shared behavior: nav, mobile menu, scroll-reveal animations, counters, generic accordion engine, generic slider/carousel engine, form validation, range sliders.
- `assets/js/*-calculator.js` — one file per page-specific lead-gen calculator (see below).
- `assets/img/` — logo assets (added this session, see "Logo" below).

## Established design patterns (reuse these, don't reinvent)

**Lead-gate calculator pattern** — every interactive calculator (ROI calculators, cost estimators, etc.) follows the same shape:
- `.calc-card` > `.calc-inputs` (form fields) + `.calc-results` > `.calc-results-content` (blurred via `.locked` class until unlocked) + `.lead-gate` overlay button.
- A shared `#lead-modal` overlay (present once per page, near `</body>`) with a form using `id="cpl-lead-form"` — **never** `id="lead-form"`, because many pages already have a `<div id="lead-form">` contact-form-card element; a duplicate ID broke `getElementById` lookups on 3 industry pages early on (real bug, since fixed everywhere).
- Shared `localStorage` key `aem_lead_unlocked` — "ask once, ever" across the *entire site*, not per-page. This is intentional (site-wide unlock), not a bug — a user reported "results aren't locked" and this was the explanation, not an issue to fix.
- Each calculator JS file builds a WhatsApp deep link (`waLines()`/`waUrl()` helpers) so submitting the lead form opens WhatsApp with a pre-filled message including their inputs.
- Reference implementation: `assets/js/app-calculator.js` (Mobile App Development Cost Estimator) — cleanest, most recent example.

**Icon hover/tap-reveal pattern (`.cap-grid`)** — used to de-texify sections that were originally dense paragraph/bullet lists (services lists, "who is this for" lists, etc.):
```html
<div class="cap-grid reveal">
  <div class="cap-node" tabindex="0"><div class="cap-badge">🎯</div><div>Label</div><div class="cap-tip">Detail shown on hover/tap/focus.</div></div>
  ...
</div>
```
CSS uses **flexbox**, not grid `auto-fit` — `display:flex;flex-wrap:wrap;justify-content:center` with fixed-width `.cap-node`. This was a deliberate fix: grid `auto-fit` left-aligns an incomplete last row, which looked broken; flexbox centers it. If adding more `.cap-grid` sections, keep using flexbox — do not "simplify" back to grid `auto-fit`.

A near-identical earlier pattern, `.process-flow`/`.process-node`/`.process-tip`, is used for numbered process steps (e.g. the 5-step SEO process) — same hover/tap-reveal idea, already correct.

**Case-study carousel pattern (`.cs-slider`)** — reuses the generic `.tslider` engine in `main.js` (originally built for testimonials), extended with a `data-autoplay="false"` opt-out and optional prev/next arrows:
```html
<div class="cs-slider reveal mt-4">
  <div class="tslider" data-autoplay="false">
    <div class="tslider-track">
      <div class="tslide"><article class="cs-card">
        <div class="cs-head"><span class="tag">...</span><h3>...</h3></div>
        <div class="cs-body">
          <div class="cs-metrics">...</div>
          <div class="accordion cs-accordion"><div class="acc-item"><button class="acc-btn" aria-expanded="false"><span>Read the full case study</span><span class="plus">＋</span></button><div class="acc-body">
            <p><strong>Challenge:</strong>...</p><p><strong>Solution:</strong>...</p><p><strong>Execution:</strong>...</p>
            <p style="font-style:italic;color:var(--ink)">&ldquo;quote&rdquo; <span style="color:var(--ink-mute)">— attribution</span></p>
            <a class="link-arrow" href="contact.html#consult">Get results like this</a>
          </div></div></div>
        </div>
      </article></div>
      <!-- repeat .tslide for each case study -->
    </div>
  </div>
  <div class="cs-controls"><button class="cs-arrow prev">‹</button><div class="tnav" role="tablist" aria-label="Case studies"></div><button class="cs-arrow next">›</button></div>
</div>
```
The JS in `main.js` auto-builds the dot navigation into `.tnav` and wires up `.cs-arrow.prev`/`.next` — **no JS changes needed** to add a new carousel, just follow this markup. `.cs-slider{max-width:860px;margin-inline:auto}` must be on the **outer wrapper**, never on `.tslider-track` directly (a mistake caught early — putting max-width on the track squeezes all slides into that width instead of just the viewport).

Pages currently using this pattern: `modern-seo.html` (5 case studies), `mobile-app-development.html` (5), `affiliate-marketing.html` (5).

## Logo (added this session, 2026-07-20)

User supplied a logo image (teal/blue "ADS" wordmark with upward arrow graphic + "EASY MEDIA" text band below, on a flat white background — not transparent).

Processing done: cropped out just the icon/arrow portion (excluding the "EASY MEDIA" text band, since that's redundant with the HTML text already in the nav/footer), removed the white background via distance-based alpha keying with proper un-premultiply (avoids white fringing on the dark footer background), saved to `assets/img/logo-icon.png`. Also generated a full transparent lockup (`assets/img/logo-full.png`, unused so far but kept for future use e.g. email signatures) and a favicon set (`assets/img/favicon-{16,32,48,64,128,180,192,512}.png`).

Site-wide, replaced:
- `<span class="logo-mark">AE</span>` → `<img src="assets/img/logo-icon.png" alt="AdsEasy Media logo" class="logo-mark">` (in both header nav and footer, on all 49 pages — the adjacent "AdsEasy Media" text span was left as real HTML text, not baked into the image, for accessibility/crispness).
- The old inline-SVG data-URI favicon → proper `<link rel="icon">`/`<link rel="apple-touch-icon">` tags pointing at the new favicon PNGs.
- `.logo-mark` CSS rule in `style.css` changed from a colored rounded-square badge (background/box-shadow/etc.) to plain image sizing (`height:36px;width:auto;object-fit:contain`).

The original file the user provided (`ads easy media logo.png`, in the project root) was left untouched.

## Recent content work (this engagement, roughly in order)

1. **Calculator lead-gate system** — built out across many pages (ROI calculators, cost estimators), with the shared unlock/WhatsApp pattern described above.
2. **`modern-seo.html`** — added Shopify SEO service, redesigned the SEO process into hover-icon steps, expanded case studies from 1 to 5 and converted to carousel, converted the services list into `.cap-grid`, general de-texify pass.
3. **Responsive audit** (via the `impeccable adapt` skill) — found the site's responsive foundation solid; fixed one real bug: mega-menu overflow on 1024–1240px laptop widths (`@media(min-width:1024px) and (max-width:1240px){.mega{min-width:320px;grid-template-columns:1fr}}`).
4. **`mobile-app-development.html`** — added a "Where Are You in Your Mobile App Roadmap?" icon section, built the App Development Cost Estimator calculator (`assets/js/app-calculator.js`), expanded case studies to 5 + carousel, converted the engagement-model cards to bullets, converted the services section to `.cap-grid`.
5. **`.cap-grid` alignment bug fix** — switched from CSS Grid `auto-fit` to flexbox (see pattern notes above) — applies to all 3 pages using it.
6. **`affiliate-marketing.html`** — added a true "Our Affiliate Marketing Services" `.cap-grid` (was previously mislabeled — the section under that heading actually listed *who can become an affiliate*, not the services themselves), kept the "who should become an affiliate" content as its own `.cap-grid`, added icons to the existing "Why is affiliate marketing important?" / "Our Values" comparison lists, added a new "Are You Searching for the Best Affiliate Marketing Company in India?" proof-points section, expanded case studies from 1 to 5 + carousel.
7. **Logo rollout** — see above.

## Known open items / unfinished business

- **Nothing has been pushed to GitHub.** All work above is local-only changes in the connected folder. See "GitHub" section below for why and what's needed.
- **AI-Powered Custom Application Development / PDF reference**: user once asked to add content "mentioned in PDF file" for `mobile-app-development.html`, but never provided the PDF. The service already exists on that page in some form; this specific ask is unresolved — ask the user for the PDF if they bring it up again.
- **App Cost Estimator pricing rate is a placeholder** (₹35,000/feature/platform in `assets/js/app-calculator.js`) — flagged to the user as needing calibration by a qualified team member before launch. Don't remove this caveat if touching that file again.
- **GitHub repo structure mismatch**: the remote (`https://github.com/shrutiagarwal7294-creator/AdEasy_Website`) has a root `README.md`, an image, a PDF, and a nested `adseasymedia-website/` subfolder (an older copy of this same site). The user chose to keep the remote's existing structure and merge local changes into it, rather than overwrite. Merge commands were drafted (using `git mv` + `git merge --allow-unrelated-histories -X ours`) but **never confirmed as executed** — this may need to be redone/re-verified if the user asks to push again.

## GitHub / git — important environment limitation

Git operations could not be reliably run from inside the Cowork sandbox for this project — `git init` produced a corrupted config, and `rm -rf .git` failed with "Operation not permitted" on retries. This looked like a genuine sandbox limitation, not just a fluke. **Recommendation: don't attempt git commands via the sandbox bash tool for this project — hand the user exact terminal commands to run themselves on their own machine instead.**

Also, entering GitHub credentials/tokens on the user's behalf is against policy — the user must authenticate their own git push.

## A sandbox quirk worth knowing about

In this environment, files edited via the Edit/Write tools don't always show up correctly if immediately re-read via the `bash` tool — the bash-mounted view of a file can be stale/truncated right after an edit (confirmed multiple times: `wc -l`, `grep`, even `node -c` syntax checks gave wrong/truncated results on freshly-edited files, while the Read tool showed the correct, complete content). **When in doubt about whether an edit "took," trust the Read tool over bash.** If you need to run JS logic against a file's real content (e.g. for a jsdom test), and you suspect bash is stale, copy the Read-tool-confirmed content into a `/tmp/*.js` file via a heredoc and test against that copy instead of the mounted path.

## How to resume work in a new session

1. Confirm the same folder is connected (`adseasymedia-website/adseasymedia-website`).
2. Skim this file.
3. Everything described above is already saved to disk — no need to redo it, just continue from "Known open items."
