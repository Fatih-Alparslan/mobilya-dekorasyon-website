import { NextResponse } from 'next/server';
import { getAllServices } from '@/lib/db';

// GET - Tüm hizmetleri getir (admin)
export async function GET() {
    try {
        const services = await getAllServices();

        return NextResponse.json({
            success: true,
            data: services
        });
    } catch (error) {
        console.error('Get all services error:', error);
        return NextResponse.json({
            success: false,
            message: 'Hizmetler yüklenemedi'
        }, { status: 500 });
    }
}
