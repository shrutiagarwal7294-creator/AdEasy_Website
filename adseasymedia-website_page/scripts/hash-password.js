#!/usr/bin/env node
/* scripts/hash-password.js
 * Generates a bcrypt hash for the ADMIN_PASSWORD_HASH env var.
 * Run locally — the plaintext password never leaves your machine and is
 * never sent to Claude or committed to the repo.
 *
 * Usage:
 *   node scripts/hash-password.js "your-new-password"
 *
 * (Passing it as an argument is simplest here; if you'd rather not have it
 * in shell history, clear your history afterward or wrap this in your own
 * prompt-based script.)
 */
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.js "your-new-password"');
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log('\nADMIN_PASSWORD_HASH=' + hash);
  console.log('\nAdd this (and ADMIN_USERNAME, SESSION_SECRET) as environment');
  console.log('variables in Vercel > Project Settings > Environment Variables.');
  console.log('Never commit the plaintext password or this hash to git history alongside it in a way that links them.');
});
