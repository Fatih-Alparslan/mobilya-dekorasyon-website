import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminSession } from '@/lib/auth';
import { getLogoSettings, updateLogo, updateLogoText, deleteLogo } from '@/lib/db';

// GET - Mevcut logo ayarlarını getir
export async function GET() {
    try {
        const settings = await getLogoSettings();

        if (!settings) {
            return NextResponse.json({
                success: false,
                message: 'Ayarlar bulunamadı'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                id: settings.id,
                logoText: settings.logo_text,
                hasLogoImage: !!settings.logo_data,
                logoMimeType: settings.logo_mime_type,
                logoFileSize: settings.logo_file_size,
                updatedAt: settings.updated_at,
            }
        });
    } catch (error) {
        console.error('Get logo settings error:', error);
        return NextResponse.json({
            success: false,
            message: 'Sunucu hatası'
        }, { status: 500 });
    }
}

// POST - Logo yükle veya güncelle
export async function POST(request: Request) {
    try {
        // Admin session kontrolü
        const sessionData = await getAdminSession();
        if (!sessionData) {
            return NextResponse.json({
                success: false,
                message: 'Yetkisiz erişim'
            }, { status: 401 });
        }

        const body = await request.json();
        const { logoData, logoText } = body;

        // Logo resmi varsa güncelle
        if (logoData) {
            await updateLogo(logoData);
        }

        // Logo text varsa güncelle
        if (logoText) {
            await updateLogoText(logoText);
        }

        return NextResponse.json({
            success: true,
            message: 'Logo başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update logo error:', error);
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : 'Sunucu hatası'
        }, { status: 500 });
    }
}

// DELETE - Logo'yu sil
export async function DELETE() {
    try {
        // Admin session kontrolü
        const sessionData = await getAdminSession();
        if (!sessionData) {
            return NextResponse.json({
                success: false,
                message: 'Yetkisiz erişim'
            }, { status: 401 });
        }

        await deleteLogo();

        return NextResponse.json({
            success: true,
            message: 'Logo başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete logo error:', error);
        return NextResponse.json({
            success: false,
            message: 'Sunucu hatası'
        }, { status: 500 });
    }
}
