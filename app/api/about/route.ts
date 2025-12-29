import { NextResponse } from 'next/server';
import { getAboutSections } from '@/lib/db';

// GET - Aktif hakkımızda bölümlerini getir (public)
export async function GET() {
    try {
        const sections = await getAboutSections();

        return NextResponse.json({
            success: true,
            data: sections
        });
    } catch (error) {
        console.error('Get about sections error:', error);
        return NextResponse.json({
            success: false,
            message: 'Bölümler yüklenemedi'
        }, { status: 500 });
    }
}
