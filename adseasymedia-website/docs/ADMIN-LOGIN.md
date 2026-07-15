# Admin Login Setup

A minimal, single-admin login protecting `/admin.html`, built as a small custom
backend on top of Vercel Serverless + Edge Middleware (no third-party auth
service, no database).

## How it works

- `login.html` — public login form, posts credentials to `/api/login`.
- `api/login.js` — Node serverless function. Checks the submitted username/password
  against env vars and, on success, sets an `HttpOnly`, `Secure` cookie containing
  a signed JWT (8-hour expiry).
- `middleware.js` — Edge Middleware that runs before `/admin.html` loads. It
  verifies the JWT cookie; if missing or invalid, it redirects to `/login.html`.
- `api/logout.js` — clears the cookie.
- `admin.html` — placeholder protected page. Replace its content with whatever
  the login should actually gate.

No credentials or session secrets are stored in the repo — everything sensitive
lives in Vercel environment variables.

## One-time setup

1. Install the two new dependencies (already listed in `package.json`):
   ```
   npm install
   ```
2. Generate a password hash locally — the plaintext password is never sent
   anywhere, including to Claude:
   ```
   node scripts/hash-password.js "choose-a-strong-password"
   ```
   This prints an `ADMIN_PASSWORD_HASH` value.
3. Generate a session secret:
   ```
   openssl rand -hex 32
   ```
4. In the Vercel dashboard: **Project → Settings → Environment Variables**, add:
   | Name | Value |
   |---|---|
   | `ADMIN_USERNAME` | your chosen admin username |
   | `ADMIN_PASSWORD_HASH` | output from step 2 |
   | `SESSION_SECRET` | output from step 3 |

   Apply them to Production (and Preview, if you want the same login there).
5. Redeploy. Visit `/admin.html` — you should be redirected to `/login.html`
   until you sign in.

## Notes / limits

- This protects **one** admin identity, not multiple users or roles — matches
  the "just gate one internal page" requirement. It is not a full accounts
  system.
- Cookies are set `Secure`, so login only works over HTTPS (Vercel's
  production/preview URLs). Local `vercel dev` over plain `http://localhost`
  will not persist the cookie unless you temporarily drop the `Secure` flag
  in `api/login.js` for local testing — put it back before deploying.
- If `SESSION_SECRET` is ever exposed (e.g., committed by mistake, pasted into
  a chat tool, leaked in logs), rotate it immediately in Vercel and notify
  Security/Compliance/IT per standard incident process — the old value must
  be treated as compromised.
- Sessions last 8 hours (`SESSION_TTL_SECONDS` in `api/login.js`); adjust if
  you need shorter/longer.
- **Before this goes live for a real client-facing admin area, have it
  reviewed** — this is a minimal scaffold, not a hardened auth system (no
  rate limiting on login attempts, no audit log, no password reset flow).
