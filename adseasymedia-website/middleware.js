/* middleware.js — Vercel Edge Middleware
 * Gates /admin.html: requires a valid, unexpired admin_session JWT cookie
 * (issued by /api/login). Anyone without one is redirected to /login.html.
 */
import { jwtVerify } from 'jose';

export const config = {
  matcher: ['/admin.html'],
};

export default async function middleware(request) {
  const secret = process.env.SESSION_SECRET;
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)admin_session=([^;]+)/);
  const token = match ? match[1] : null;

  if (token && secret) {
    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      return; // valid session — let the request through
    } catch (err) {
      // expired/invalid signature — fall through to redirect
    }
  }

  const url = new URL(request.url);
  const loginUrl = new URL('/login.html', url);
  loginUrl.searchParams.set('next', url.pathname);
  return Response.redirect(loginUrl, 302);
}
