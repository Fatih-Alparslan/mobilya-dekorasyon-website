import { NextResponse } from 'next/server';
import { setFeaturedImage } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const body = await request.json();
        const { imageUrl } = body;

        if (!imageUrl) {
            return NextResponse.json({
                success: false,
                message: 'Resim URL\'si gerekli'
            }, { status: 400 });
        }

        const success = await setFeaturedImage(id, imageUrl);

        if (!success) {
            return NextResponse.json({
                success: false,
                message: 'Resim bulunamadı'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Ana fotoğraf başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Set featured image error:', error);
        return NextResponse.json({
            success: false,
            message: 'Ana fotoğraf güncellenemedi'
        }, { status: 500 });
    }
}
