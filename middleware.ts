import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        const authCookie = request.cookies.get('admin_session');
        if (!authCookie) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Check role for user management page - only admins can access
        if (request.nextUrl.pathname.startsWith('/admin/users')) {
            try {
                const session = JSON.parse(authCookie.value);
                if (session.role !== 'admin') {
                    // Redirect editors away from user management
                    return NextResponse.redirect(new URL('/admin', request.url));
                }
            } catch {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
