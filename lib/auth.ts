import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSessionByToken, getUserById } from '@/lib/db';
import { hashSessionToken } from '@/lib/security';

/**
 * Validate admin session on server side
 * Call this in server components or server actions
 * Redirects to login if session is invalid
 */
export async function validateAdminSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (!sessionToken) {
        redirect('/admin/login');
    }

    try {
        const tokenHash = hashSessionToken(sessionToken);
        const session = await getSessionByToken(tokenHash);

        if (!session) {
            // Invalid or expired session
            redirect('/admin/login');
        }

        // Get user info
        const user = await getUserById(session.user_id);

        if (!user) {
            redirect('/admin/login');
        }

        if (!user.is_active) {
            redirect('/admin/login?error=account_disabled');
        }

        return { session, user };
    } catch (error) {
        console.error('Session validation error:', error);
        redirect('/admin/login');
    }
}

/**
 * Check if user is logged in (without redirecting)
 * Returns session and user if valid, null otherwise
 */
export async function getAdminSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (!sessionToken) {
        return null;
    }

    try {
        const tokenHash = hashSessionToken(sessionToken);
        const session = await getSessionByToken(tokenHash);

        if (!session) {
            return null;
        }

        // Get user info
        const user = await getUserById(session.user_id);

        if (!user) {
            return null;
        }

        if (!user.is_active) {
            return null;
        }

        return { session, user };
    } catch (error) {
        console.error('Session check error:', error);
        return null;
    }
}
