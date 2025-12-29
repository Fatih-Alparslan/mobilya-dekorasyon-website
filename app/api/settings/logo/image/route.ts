import { NextResponse } from 'next/server';
import { getLogoImage } from '@/lib/db';

export async function GET() {
    try {
        const logo = await getLogoImage();

        if (!logo) {
            return new NextResponse('Logo bulunamadı', { status: 404 });
        }

        // Buffer'ı Uint8Array'e çevir (NextResponse için gerekli)
        const imageData = new Uint8Array(logo.data);

        return new NextResponse(imageData, {
            headers: {
                'Content-Type': logo.mimeType,
                'Cache-Control': 'public, max-age=3600', // 1 saat cache
            },
        });
    } catch (error) {
        console.error('Get logo image error:', error);
        return new NextResponse('Sunucu hatası', { status: 500 });
    }
}
