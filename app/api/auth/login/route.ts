import { NextResponse } from 'next/server';
import { getUserByUsername, verifyPassword } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: 'Kullanıcı adı ve şifre gerekli' },
                { status: 400 }
            );
        }

        // Kullanıcıyı veritabanından getir
        const user = await getUserByUsername(username);

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Kullanıcı bulunamadı' },
                { status: 401 }
            );
        }

        // Şifreyi doğrula
        const isValid = await verifyPassword(password, user.password_hash);

        if (!isValid) {
            return NextResponse.json(
                { success: false, message: 'Hatalı şifre' },
                { status: 401 }
            );
        }

        // Başarılı giriş - session cookie set et
        const response = NextResponse.json({ success: true, user: { id: user.id, username: user.username } });

        response.cookies.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 gün
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
