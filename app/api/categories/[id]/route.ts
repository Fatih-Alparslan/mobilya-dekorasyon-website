import { NextResponse } from 'next/server';
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/db';
import { cookies } from 'next/headers';
import { getAdminSession } from '@/lib/auth';

// GET - Kategori detayı
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const category = await getCategoryById(parseInt(id));

        if (!category) {
            return NextResponse.json({
                success: false,
                message: 'Kategori bulunamadı'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Get category error:', error);
        return NextResponse.json({
            success: false,
            message: 'Kategori yüklenemedi'
        }, { status: 500 });
    }
}

// PUT - Kategori güncelle (admin only)
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
        const { name, slug, description } = body;

        if (!name || !slug) {
            return NextResponse.json({
                success: false,
                message: 'Kategori adı ve slug gerekli'
            }, { status: 400 });
        }

        await updateCategory(parseInt(id), { name, slug, description });

        return NextResponse.json({
            success: true,
            message: 'Kategori başarıyla güncellendi'
        });
    } catch (error: any) {
        console.error('Update category error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({
                success: false,
                message: 'Bu kategori adı veya slug zaten kullanılıyor'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: 'Kategori güncellenemedi'
        }, { status: 500 });
    }
}

// DELETE - Kategori sil (admin only)
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

        // Bu kategoriye ait proje var mı kontrol et
        const { pool } = await import('@/lib/db');
        const [projects] = await pool.query(
            'SELECT COUNT(*) as count FROM projects WHERE category_id = ?',
            [parseInt(id)]
        );

        const projectCount = (projects as any)[0].count;

        if (projectCount > 0) {
            return NextResponse.json({
                success: false,
                message: `Bu kategoriye ait ${projectCount} proje var. Önce projeleri başka kategoriye taşıyın veya silin.`
            }, { status: 400 });
        }

        const deleted = await deleteCategory(parseInt(id));

        if (!deleted) {
            return NextResponse.json({
                success: false,
                message: 'Kategori bulunamadı'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Kategori başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        return NextResponse.json({
            success: false,
            message: 'Kategori silinemedi'
        }, { status: 500 });
    }
}
