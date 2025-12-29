import { NextResponse } from 'next/server';
import { getAllAboutSections, addAboutSection } from '@/lib/db';
import { cookies } from 'next/headers';

// GET - Tüm hakkımızda bölümlerini getir (admin)
export async function GET() {
    try {
        const sections = await getAllAboutSections();

        return NextResponse.json({
            success: true,
            data: sections
        });
    } catch (error) {
        console.error('Get all about sections error:', error);
        return NextResponse.json({
            success: false,
            message: 'Bölümler yüklenemedi'
        }, { status: 500 });
    }
}

// POST - Yeni hakkımızda bölümü ekle (admin only)
export async function POST(request: Request) {
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
        const { title, content, image_url, display_order, is_active } = body;

        if (!title || !content) {
            return NextResponse.json({
                success: false,
                message: 'Başlık ve içerik gerekli'
            }, { status: 400 });
        }

        const id = await addAboutSection({
            title,
            content,
            image_url: image_url || null,
            display_order: display_order || 0,
            is_active: is_active !== undefined ? is_active : true
        });

        return NextResponse.json({
            success: true,
            message: 'Bölüm başarıyla eklendi',
            data: { id }
        });
    } catch (error) {
        console.error('Add about section error:', error);
        return NextResponse.json({
            success: false,
            message: 'Bölüm eklenemedi'
        }, { status: 500 });
    }
}
