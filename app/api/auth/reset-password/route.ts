import { NextResponse } from 'next/server';
import {
    getPasswordResetToken,
    updateUserPassword,
    markTokenAsUsed,
    logAuditEntry,
    getUserById
} from '@/lib/db';
import { getClientIp } from '@/lib/security';

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    try {
        const body = await request.json();
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return NextResponse.json(
                { success: false, message: 'Token ve yeni şifre gerekli' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, message: 'Şifre en az 6 karakter olmalı' },
                { status: 400 }
            );
        }

        // Verify token
        const resetToken = await getPasswordResetToken(token);

        if (!resetToken) {
            await logAuditEntry({
                username: 'unknown',
                action: 'PASSWORD_RESET_INVALID_TOKEN',
                ip_address: ip,
                user_agent: userAgent,
                details: 'Invalid or expired token',
                success: false,
            });

            return NextResponse.json(
                { success: false, message: 'Geçersiz veya süresi dolmuş token' },
                { status: 400 }
            );
        }

        // Get user
        const user = await getUserById(resetToken.user_id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Kullanıcı bulunamadı' },
                { status: 404 }
            );
        }

        // Update password
        await updateUserPassword(resetToken.user_id, newPassword);

        // Mark token as used
        await markTokenAsUsed(token);

        // Log successful password reset
        await logAuditEntry({
            user_id: user.id,
            username: user.username,
            action: 'PASSWORD_RESET_SUCCESS',
            ip_address: ip,
            user_agent: userAgent,
            details: 'Password successfully reset',
            success: true,
        });

        return NextResponse.json({
            success: true,
            message: 'Şifreniz başarıyla değiştirildi. Giriş yapabilirsiniz.',
        });
    } catch (error) {
        console.error('Reset password error:', error);

        await logAuditEntry({
            username: 'unknown',
            action: 'PASSWORD_RESET_ERROR',
            ip_address: ip,
            user_agent: userAgent,
            details: error instanceof Error ? error.message : 'Unknown error',
            success: false,
        });

        return NextResponse.json(
            { success: false, message: 'Bir hata oluştu' },
            { status: 500 }
        );
    }
}
