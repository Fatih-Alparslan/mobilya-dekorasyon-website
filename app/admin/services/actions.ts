'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addService, updateService, deleteService } from '@/lib/db';

export async function createServiceAction(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const icon = formData.get('icon') as string;
    const display_order = formData.get('display_order') as string;
    const is_active = formData.get('is_active') === 'on';

    try {
        await addService({
            title,
            description,
            icon: icon || 'Wrench',
            display_order: parseInt(display_order) || 0,
            is_active
        });

        revalidatePath('/admin/services');
        revalidatePath('/');
    } catch (error) {
        console.error('Create service error:', error);
        throw error;
    }

    redirect('/admin/services');
}

export async function updateServiceAction(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const icon = formData.get('icon') as string;
    const display_order = formData.get('display_order') as string;
    const is_active = formData.get('is_active') === 'on';

    try {
        await updateService(parseInt(id), {
            title,
            description,
            icon,
            display_order: parseInt(display_order) || 0,
            is_active
        });

        revalidatePath('/admin/services');
        revalidatePath('/');
    } catch (error) {
        console.error('Update service error:', error);
        throw error;
    }

    redirect('/admin/services');
}

export async function deleteServiceAction(id: string) {
    try {
        await deleteService(parseInt(id));

        revalidatePath('/admin/services');
        revalidatePath('/');
    } catch (error) {
        console.error('Delete service error:', error);
        throw error;
    }

    redirect('/admin/services');
}
