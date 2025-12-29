import { NextResponse } from 'next/server';
import { getCategories, addCategory } from '@/lib/db';
import { cookies } from 'next/headers';

// GET - Tüm kategorileri getir
export async function GET() {
    try {
        const categories = await getCategories();

        return NextResponse.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        return NextResponse.json({
            success: false,
            message: 'Kategoriler yüklenemedi'
        }, { status: 500 });
    }
}

// POST - Yeni kategori ekle (admin only)
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
        const { name, slug, description } = body;

        if (!name || !slug) {
            return NextResponse.json({
                success: false,
                message: 'Kategori adı ve slug gerekli'
            }, { status: 400 });
        }

        const categoryId = await addCategory({ name, slug, description });

        return NextResponse.json({
            success: true,
            message: 'Kategori başarıyla eklendi',
            categoryId
        });
    } catch (error: any) {
        console.error('Add category error:', error);

        // Duplicate entry hatası
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({
                success: false,
                message: 'Bu kategori adı veya slug zaten kullanılıyor'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: 'Kategori eklenemedi'
        }, { status: 500 });
    }
}
