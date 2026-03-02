import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://ryans-auto-solution.vercel.app',
    'https://www.ryansautosolution.com',
    'https://ryansautosolution.com',
];

export function proxy(request: NextRequest) {
    // ── CORS for API routes ──────────────────────────────────────────────────
    if (request.nextUrl.pathname.startsWith('/api')) {
        const origin = request.headers.get('origin') ?? '';
        const isAllowed = ALLOWED_ORIGINS.includes(origin);

        // Handle preflight
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 204,
                headers: {
                    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
                    'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Max-Age': '86400',
                },
            });
        }

        // Add CORS headers to actual responses
        const response = NextResponse.next();
        if (isAllowed) {
            response.headers.set('Access-Control-Allow-Origin', origin);
            response.headers.set('Access-Control-Allow-Credentials', 'true');
            response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
            response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
        }
        return response;
    }

    // ── Admin auth guard ─────────────────────────────────────────────────────
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        const authCookie = request.cookies.get('admin_session');
        if (!authCookie) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Parse session once for role checks
        let session: { username?: string; role?: string } = {};
        try {
            session = JSON.parse(authCookie.value);
        } catch {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        const { role } = session;
        const { pathname } = request.nextUrl;

        // Settings page: admin-only
        if (pathname.startsWith('/admin/settings') && role !== 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        // User management page: admin-only
        if (pathname.startsWith('/admin/users') && role !== 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }

        // Marketing role: only allowed on /admin (dashboard) and /admin/social
        if (role === 'marketing') {
            const allowed = pathname === '/admin' || pathname.startsWith('/admin/social');
            if (!allowed) {
                return NextResponse.redirect(new URL('/admin/social', request.url));
            }
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
