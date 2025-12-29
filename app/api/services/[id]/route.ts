import { NextResponse } from 'next/server';
import { getServiceById, updateService, deleteService } from '@/lib/db';
import { cookies } from 'next/headers';

// GET - Hizmet detayı
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const service = await getServiceById(parseInt(id));

        if (!service) {
            return NextResponse.json({
                success: false,
                message: 'Hizmet bulunamadı'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: service
        });
    } catch (error) {
        console.error('Get service error:', error);
        return NextResponse.json({
            success: false,
            message: 'Hizmet yüklenemedi'
        }, { status: 500 });
    }
}

// PUT - Hizmet güncelle (admin only)
export async function PUT(
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
        const { title, description, icon, display_order, is_active } = body;

        if (!title || !description) {
            return NextResponse.json({
                success: false,
                message: 'Başlık ve açıklama gerekli'
            }, { status: 400 });
        }

        await updateService(parseInt(id), {
            title,
            description,
            icon,
            display_order,
            is_active
        });

        return NextResponse.json({
            success: true,
            message: 'Hizmet başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update service error:', error);
        return NextResponse.json({
            success: false,
            message: 'Hizmet güncellenemedi'
        }, { status: 500 });
    }
}

// DELETE - Hizmet sil (admin only)
export async function DELETE(
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
        const deleted = await deleteService(parseInt(id));

        if (!deleted) {
            return NextResponse.json({
                success: false,
                message: 'Hizmet bulunamadı'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Hizmet başarıyla silindi'
        });
    } catch (error) {
        console.error('Delete service error:', error);
        return NextResponse.json({
            success: false,
            message: 'Hizmet silinemedi'
        }, { status: 500 });
    }
}
