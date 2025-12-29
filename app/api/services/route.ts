import { NextResponse } from 'next/server';
import { getServices } from '@/lib/db';

// GET - Aktif hizmetleri getir (public)
export async function GET() {
    try {
        const services = await getServices();

        return NextResponse.json({
            success: true,
            data: services
        });
    } catch (error) {
        console.error('Get services error:', error);
        return NextResponse.json({
            success: false,
            message: 'Hizmetler yüklenemedi'
        }, { status: 500 });
    }
}
