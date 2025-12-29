'use server';

import { addCategory, updateCategory, deleteCategory } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategoryAction(formData: FormData) {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;

    await addCategory({ name, slug, description });

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function updateCategoryAction(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;

    await updateCategory(id, { name, slug, description });

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function deleteCategoryAction(id: number) {
    await deleteCategory(id);
    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    revalidatePath('/projects');
    redirect('/admin/categories');
}
