import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getContactSubmissions, markSubmissionAsRead, deleteSubmission, getUnreadSubmissionsCount } from '@/lib/db';

// GET - Tüm mesajları listele (admin only)
export async function GET() {
    try {
        // Admin session kontrolü
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');

        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({
                success: false,
                message: 'Yetkisiz erişim'
            }, { status: 401 });
        }

        const submissions = await getContactSubmissions();
        const unreadCount = await getUnreadSubmissionsCount();

        return NextResponse.json({
            success: true,
            data: submissions,
            unreadCount
        });
    } catch (error) {
        console.error('Get submissions error:', error);
        return NextResponse.json({
            success: false,
            message: 'Sunucu hatası'
        }, { status: 500 });
    }
}

// PATCH - Mesajın okundu/okunmadı durumunu değiştir (admin only)
export async function PATCH(request: Request) {
    try {
        // Admin session kontrolü
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');

        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({
                success: false,
                message: 'Yetkisiz erişim'
            }, { status: 401 });
        }

        const body = await request.json();
        const { id, is_read } = body;

        if (!id || is_read === undefined) {
            return NextResponse.json({
                success: false,
                message: 'Mesaj ID ve durum gerekli'
            }, { status: 400 });
        }

        await markSubmissionAsRead(id, is_read);

        return NextResponse.json({
            success: true,
            message: is_read ? 'Mesaj okundu olarak işaretlendi' : 'Mesaj okunmadı olarak işaretlendi'
        });
    } catch (error) {
        console.error('Toggle read error:', error);
        return NextResponse.json({
            success: false,
            message: 'Sunucu hatası'
        }, { status: 500 });
    }
}

// DELETE - Mesajı sil (admin only)
export async function DELETE(request: Request) {
    try {
        // Admin session kontrolü
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');

        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({
                success: false,
                message: 'Yetkisiz erişim'
            }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Mesaj ID gerekli'
            }, { status: 400 });
        }

        const deleted = await deleteSubmission(parseInt(id));

        if (!deleted) {
            return NextResponse.json({
                success: false,
                message: 'Mesaj bulunamadı'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Mesaj başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete submission error:', error);
        return NextResponse.json({
            success: false,
            message: 'Sunucu hatası'
        }, { status: 500 });
    }
}
