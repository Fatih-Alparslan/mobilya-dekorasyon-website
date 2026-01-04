import { NextResponse } from 'next/server';
import {
    getUserByUsername,
    verifyPassword,
    logAuditEntry,
    createAdminSession,
    getAdminSettings
} from '@/lib/db';
import {
    checkRateLimit,
    resetRateLimit,
    getClientIp,
    generateSessionToken,
    hashSessionToken,
    sanitizeInput,
    isSecureConnection
} from '@/lib/security';

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    try {
        // Get security settings
        const settings = await getAdminSettings();
        const maxAttempts = settings?.max_login_attempts || 5;
        const lockoutMinutes = settings?.lockout_duration_minutes || 15;
        const requireHttps = settings?.require_https || false;

        // Check HTTPS requirement (only in production)
        if (process.env.NODE_ENV === 'production' && requireHttps) {
            if (!isSecureConnection(request)) {
                await logAuditEntry({
                    username: 'unknown',
                    action: 'LOGIN_ATTEMPT',
                    ip_address: ip,
                    user_agent: userAgent,
                    details: 'Rejected: Non-HTTPS connection',
                    success: false,
                });

                return NextResponse.json(
                    { success: false, message: 'Güvenli bağlantı gerekli (HTTPS)' },
                    { status: 403 }
                );
            }
        }

        const body = await request.json();
        const username = sanitizeInput(body.username || '');
        const password = body.password || '';

        if (!username || !password) {
            await logAuditEntry({
                username: username || 'unknown',
                action: 'LOGIN_ATTEMPT',
                ip_address: ip,
                user_agent: userAgent,
                details: 'Missing credentials',
                success: false,
            });

            return NextResponse.json(
                { success: false, message: 'Kullanıcı adı ve şifre gerekli' },
                { status: 400 }
            );
        }

        // Rate limiting check
        const rateLimitResult = checkRateLimit(ip, {
            windowMs: 15 * 60 * 1000, // 15 minutes
            maxAttempts: maxAttempts,
            blockDurationMs: lockoutMinutes * 60 * 1000,
        });

        if (!rateLimitResult.allowed) {
            const blockedMinutes = rateLimitResult.blockedUntil
                ? Math.ceil((rateLimitResult.blockedUntil - Date.now()) / 60000)
                : lockoutMinutes;

            await logAuditEntry({
                username,
                action: 'LOGIN_BLOCKED',
                ip_address: ip,
                user_agent: userAgent,
                details: `Rate limit exceeded. Blocked for ${blockedMinutes} minutes`,
                success: false,
            });

            return NextResponse.json(
                {
                    success: false,
                    message: `Çok fazla başarısız giriş denemesi. ${blockedMinutes} dakika sonra tekrar deneyin.`,
                    blockedUntil: rateLimitResult.blockedUntil,
                },
                { status: 429 }
            );
        }

        // Get user from database
        const user = await getUserByUsername(username);

        if (!user) {
            await logAuditEntry({
                username,
                action: 'LOGIN_FAILED',
                ip_address: ip,
                user_agent: userAgent,
                details: 'User not found',
                success: false,
            });

            return NextResponse.json(
                {
                    success: false,
                    message: 'Kullanıcı adı veya şifre hatalı',
                    remaining: rateLimitResult.remaining,
                },
                { status: 401 }
            );
        }

        if (!user.is_active) {
            await logAuditEntry({
                username,
                action: 'LOGIN_BLOCKED',
                ip_address: ip,
                user_agent: userAgent,
                details: 'Account disabled',
                success: false,
            });

            return NextResponse.json(
                {
                    success: false,
                    message: 'Hesabınız devre dışı bırakılmıştır. Y yönetici ile iletişime geçin.',
                    remaining: rateLimitResult.remaining,
                },
                { status: 403 }
            );
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password_hash);

        if (!isValid) {
            await logAuditEntry({
                user_id: user.id,
                username,
                action: 'LOGIN_FAILED',
                ip_address: ip,
                user_agent: userAgent,
                details: 'Invalid password',
                success: false,
            });

            return NextResponse.json(
                {
                    success: false,
                    message: 'Kullanıcı adı veya şifre hatalı',
                    remaining: rateLimitResult.remaining,
                },
                { status: 401 }
            );
        }

        // Successful login - reset rate limit
        resetRateLimit(ip);

        // Generate secure session token
        const sessionToken = generateSessionToken();
        const tokenHash = hashSessionToken(sessionToken);

        // Calculate session expiration
        const sessionTimeoutHours = settings?.session_timeout_hours || 4;
        const expiresAt = new Date(Date.now() + sessionTimeoutHours * 60 * 60 * 1000);

        // Create session in database
        await createAdminSession({
            user_id: user.id,
            session_token_hash: tokenHash,
            ip_address: ip,
            user_agent: userAgent,
            expires_at: expiresAt,
        });

        // Log successful login
        await logAuditEntry({
            user_id: user.id,
            username,
            action: 'LOGIN_SUCCESS',
            ip_address: ip,
            user_agent: userAgent,
            details: `Session expires at ${expiresAt.toISOString()}`,
            success: true,
        });

        // Set secure cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username
            },
            expiresAt: expiresAt.toISOString(),
        });

        response.cookies.set('admin_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            expires: expiresAt,
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);

        await logAuditEntry({
            username: 'unknown',
            action: 'LOGIN_ERROR',
            ip_address: ip,
            user_agent: userAgent,
            details: error instanceof Error ? error.message : 'Unknown error',
            success: false,
        });

        return NextResponse.json(
            { success: false, message: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
