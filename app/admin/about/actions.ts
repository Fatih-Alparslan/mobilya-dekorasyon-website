'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addAboutSection, updateAboutSection, deleteAboutSection } from '@/lib/db';

export async function createAboutSectionAction(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const display_order = formData.get('display_order') as string;
    const is_active = formData.get('is_active') === 'on';

    try {
        await addAboutSection({
            title,
            content,
            image_url: null,
            display_order: parseInt(display_order) || 0,
            is_active
        });

        revalidatePath('/admin/about');
        revalidatePath('/about');
    } catch (error) {
        console.error('Create about section error:', error);
        throw error;
    }

    redirect('/admin/about');
}

export async function updateAboutSectionAction(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const display_order = formData.get('display_order') as string;
    const is_active = formData.get('is_active') === 'on';

    try {
        await updateAboutSection(parseInt(id), {
            title,
            content,
            display_order: parseInt(display_order) || 0,
            is_active
        });

        revalidatePath('/admin/about');
        revalidatePath('/about');
    } catch (error) {
        console.error('Update about section error:', error);
        throw error;
    }

    redirect('/admin/about');
}

export async function deleteAboutSectionAction(id: string) {
    try {
        await deleteAboutSection(parseInt(id));

        revalidatePath('/admin/about');
        revalidatePath('/about');
    } catch (error) {
        console.error('Delete about section error:', error);
        throw error;
    }

    redirect('/admin/about');
}
