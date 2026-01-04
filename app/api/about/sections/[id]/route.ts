import { NextResponse } from 'next/server';
import { getAboutSectionById, updateAboutSection, deleteAboutSection } from '@/lib/db';
import { cookies } from 'next/headers';
import { getAdminSession } from '@/lib/auth';

// GET - Hakkımızda bölümü detayı
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const section = await getAboutSectionById(parseInt(id));

        if (!section) {
            return NextResponse.json({
                success: false,
                message: 'Bölüm bulunamadı'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: section
        });
    } catch (error) {
        console.error('Get about section error:', error);
        return NextResponse.json({
            success: false,
            message: 'Bölüm yüklenemedi'
        }, { status: 500 });
    }
}

// PUT - Hakkımızda bölümünü güncelle (admin only)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Admin session kontrolü
        const sessionData = await getAdminSession();
        if (!sessionData) {
            return NextResponse.json({
                success: false,
                message: 'Yetkisiz erişim'
            }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { title, content, image_url, display_order, is_active } = body;

        if (!title || !content) {
            return NextResponse.json({
                success: false,
                message: 'Başlık ve içerik gerekli'
            }, { status: 400 });
        }

        await updateAboutSection(parseInt(id), {
            title,
            content,
            image_url,
            display_order,
            is_active
        });

        return NextResponse.json({
            success: true,
            message: 'Bölüm başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update about section error:', error);
        return NextResponse.json({
            success: false,
            message: 'Bölüm güncellenemedi'
        }, { status: 500 });
    }
}

// DELETE - Hakkımızda bölümünü sil (admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Admin session kontrolü
        const sessionData = await getAdminSession();
        if (!sessionData) {
            return NextResponse.json({
                success: false,
                message: 'Yetkisiz erişim'
            }, { status: 401 });
        }

        const { id } = await params;
        const deleted = await deleteAboutSection(parseInt(id));

        if (!deleted) {
            return NextResponse.json({
                success: false,
                message: 'Bölüm bulunamadı'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Bölüm başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete about section error:', error);
        return NextResponse.json({
            success: false,
            message: 'Bölüm silinemedi'
        }, { status: 500 });
    }
}
