import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getContactInfo, updateContactInfo } from '@/lib/db';

// GET - İletişim bilgilerini getir (public)
export async function GET() {
    try {
        const info = await getContactInfo();

        if (!info) {
            return NextResponse.json({
                success: false,
                message: 'İletişim bilgileri bulunamadı'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: info
        });
    } catch (error) {
        console.error('Get contact info error:', error);
        return NextResponse.json({
            success: false,
            message: 'Sunucu hatası'
        }, { status: 500 });
    }
}

// POST - İletişim bilgilerini güncelle (admin only)
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
        const { phone, email, address, working_hours, map_lat, map_lng, map_embed_url } = body;

        await updateContactInfo({
            phone,
            email,
            address,
            working_hours,
            map_lat,
            map_lng,
            map_embed_url
        });

        return NextResponse.json({
            success: true,
            message: 'İletişim bilgileri başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update contact info error:', error);
        return NextResponse.json({
            success: false,
            message: 'Sunucu hatası'
        }, { status: 500 });
    }
}
