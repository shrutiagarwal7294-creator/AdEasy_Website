/* /api/login.js — Vercel serverless function (Node runtime)
 * Verifies admin username/password against env vars and issues a
 * short-lived, HttpOnly session cookie (JWT) on success.
 *
 * Required env vars (set in Vercel Project Settings > Environment Variables,
 * never commit these):
 *   ADMIN_USERNAME       e.g. "admin"
 *   ADMIN_PASSWORD_HASH  bcrypt hash — generate with scripts/hash-password.js
 *   SESSION_SECRET       long random string, e.g. `openssl rand -hex 32`
 */
const bcrypt = require('bcryptjs');
const { SignJWT } = require('jose');

const COOKIE_NAME = 'admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ADMIN_USERNAME, ADMIN_PASSWORD_HASH, SESSION_SECRET } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !SESSION_SECRET) {
    console.error('Missing ADMIN_USERNAME / ADMIN_PASSWORD_HASH / SESSION_SECRET env vars');
    return res.status(500).json({ error: 'Server not configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const { username, password } = body || {};

  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const usernameOk = username === ADMIN_USERNAME;
  // Always run bcrypt.compare (even on username mismatch) against the real
  // hash so response timing doesn't leak whether the username was correct.
  const passwordOk = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

  if (!usernameOk || !passwordOk) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const secretKey = new TextEncoder().encode(SESSION_SECRET);
  const token = await new SignJWT({ sub: username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey);

  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}`
  );
  return res.status(200).json({ ok: true });
};
