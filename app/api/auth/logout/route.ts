import { NextResponse, NextRequest } from 'next/server';
import { deleteSession, logAuditEntry } from '@/lib/db';
import { getClientIp, hashSessionToken } from '@/lib/security';

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    try {
        // Get session token from cookie
        const sessionToken = request.cookies.get('admin_session')?.value;

        if (sessionToken) {
            const tokenHash = hashSessionToken(sessionToken);

            // Delete session from database
            await deleteSession(tokenHash);

            // Log logout action
            await logAuditEntry({
                username: 'admin', // We don't have user info here, but it's logged
                action: 'LOGOUT',
                ip_address: ip,
                user_agent: userAgent,
                success: true,
            });
        }

        // Clear cookie
        const response = NextResponse.json({ success: true });
        response.cookies.delete('admin_session');

        return response;
    } catch (error) {
        console.error('Logout error:', error);

        // Still clear the cookie even if database cleanup fails
        const response = NextResponse.json({ success: true });
        response.cookies.delete('admin_session');

        return response;
    }
}
