import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: Middleware runs on Edge Runtime and cannot use Node.js modules
// Session validation is done in API routes and server components instead

export function middleware(request: NextRequest) {
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
    const isLoginPath = request.nextUrl.pathname === '/admin/login';
    const isForgotPassword = request.nextUrl.pathname === '/admin/forgot-password';
    const isResetPassword = request.nextUrl.pathname === '/admin/reset-password';
    const isApiAuth = request.nextUrl.pathname.startsWith('/api/auth');

    // Allow auth API routes
    if (isApiAuth) {
        return NextResponse.next();
    }

    // Allow public password reset pages
    if (isForgotPassword || isResetPassword) {
        return NextResponse.next();
    }

    if (isAdminPath && !isLoginPath) {
        const sessionToken = request.cookies.get('admin_session')?.value;

        if (!sessionToken) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Session validation is done in API routes and server components
        // Middleware just checks if cookie exists
        return NextResponse.next();
    }

    if (isLoginPath) {
        const sessionToken = request.cookies.get('admin_session')?.value;

        if (sessionToken) {
            // If cookie exists, assume logged in (will be validated by server)
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
