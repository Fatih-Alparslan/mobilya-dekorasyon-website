import { NextResponse } from 'next/server';
import { getProjectById, updateProject, setFeaturedImage } from '@/lib/db';
import { cookies } from 'next/headers';
import { saveFile } from '@/lib/upload';
import { getAdminSession } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const project = await getProjectById(id);

        if (!project) {
            return NextResponse.json({
                success: false,
                message: 'Proje bulunamadı'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Get project error:', error);
        return NextResponse.json({
            success: false,
            message: 'Proje yüklenemedi'
        }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Admin session kontrolü
        const sessionData = await getAdminSession();
        if (!sessionData) {
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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Admin session kontrolü
        const sessionData = await getAdminSession();
        if (!sessionData) {
            return NextResponse.json({
                success: false,
                message: 'Yetkisiz erişim'
            }, { status: 401 });
        }

        const { id } = await params;
        const formData = await request.formData();

        const title = formData.get('title') as string;
        const category_id = formData.get('category_id') as string;
        const description = formData.get('description') as string;
        const date = formData.get('date') as string;

        // Mevcut projeyi al
        const currentProject = await getProjectById(id);
        if (!currentProject) {
            return NextResponse.json({
                success: false,
                message: 'Proje bulunamadı'
            }, { status: 404 });
        }

        // Kullanıcının tutmak istediği resimleri al
        const imagesToKeepJson = formData.get('imagesToKeep') as string;
        const imagesToKeep = imagesToKeepJson ? JSON.parse(imagesToKeepJson) : currentProject.imageUrls;

        // Yeni resimler varsa ekle
        const newImageUrls: string[] = [];
        const files = formData.getAll('newImages') as File[];

        for (const file of files) {
            if (file.size > 0 && file.name !== 'undefined') {
                const url = await saveFile(file);
                newImageUrls.push(url);
            }
        }

        // Tutulacak resimleri + yeni resimleri birleştir
        const allImages = [...imagesToKeep, ...newImageUrls];

        await updateProject(id, {
            title,
            category: '', // Backward compatibility
            category_id: parseInt(category_id),
            description,
            date,
            imageUrls: allImages,
        });

        // If featuredImageUrl is provided, update it
        const featuredImageUrl = formData.get('featuredImageUrl') as string;
        if (featuredImageUrl) {
            await setFeaturedImage(id, featuredImageUrl);
        }

        return NextResponse.json({
            success: true,
            message: 'Proje başarıyla güncellendi'
        });
    } catch (error) {
        console.error('Update project error:', error);
        return NextResponse.json({
            success: false,
            message: 'Proje güncellenemedi'
        }, { status: 500 });
    }
}
