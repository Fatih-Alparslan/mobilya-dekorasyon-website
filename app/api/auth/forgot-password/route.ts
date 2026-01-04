import { NextResponse } from 'next/server';
import { getUserByEmail, createPasswordResetToken, logAuditEntry } from '@/lib/db';
import { getClientIp, sanitizeInput } from '@/lib/security';

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    try {
        const body = await request.json();
        const email = sanitizeInput(body.email || '');

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email gerekli' },
                { status: 400 }
            );
        }

        // Get user by email
        const user = await getUserByEmail(email);

        // Always return success to prevent email enumeration
        // But only send email if user exists
        if (user) {
            // Create password reset token
            const token = await createPasswordResetToken(user.id);

            // In a real app, you would send an email here
            // For now, we'll just log it
            console.log('Password reset token for', user.username, ':', token);
            console.log('Reset URL:', `http://localhost:3000/admin/reset-password?token=${token}`);

            // Log the request
            await logAuditEntry({
                user_id: user.id,
                username: user.username,
                action: 'PASSWORD_RESET_REQUESTED',
                ip_address: ip,
                user_agent: userAgent,
                details: `Reset token generated`,
                success: true,
            });

            // TODO: Send email with reset link
            // await sendPasswordResetEmail(user.email, token);
        } else {
            // Log failed attempt
            await logAuditEntry({
                username: email,
                action: 'PASSWORD_RESET_FAILED',
                ip_address: ip,
                user_agent: userAgent,
                details: 'Email not found',
                success: false,
            });
        }

        // Always return success message
        return NextResponse.json({
            success: true,
            message: 'Eğer bu email adresi sistemde kayıtlıysa, şifre sıfırlama linki gönderildi.',
        });
    } catch (error) {
        console.error('Forgot password error:', error);

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
