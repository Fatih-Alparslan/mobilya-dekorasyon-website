import { getImageById } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const imageId = parseInt(id);

        if (isNaN(imageId)) {
            return new NextResponse('Invalid image ID', { status: 400 });
        }

        const image = await getImageById(imageId);

        if (!image) {
            return new NextResponse('Image not found', { status: 404 });
        }

        return new NextResponse(image.data, {
            headers: {
                'Content-Type': image.mimeType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving image:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
