'use server';

import { addProject, deleteProject, updateProject } from '@/lib/db';
import { saveFile } from '@/lib/upload';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProjectAction(formData: FormData) {
    const title = formData.get('title') as string;
    const category_id = formData.get('category_id') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;

    // Handle Images
    const imageUrls: string[] = [];
    const files = formData.getAll('images') as File[]; // Get all files with name 'images'

    for (const file of files) {
        if (file.size > 0 && file.name !== 'undefined') {
            const url = await saveFile(file);
            imageUrls.push(url);
        }
    }

    await addProject({
        title,
        category: '', // Backward compatibility
        category_id: parseInt(category_id),
        description,
        date: date || new Date().toISOString().split('T')[0],
        imageUrls,
    });

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/projects');
    redirect('/admin');
}

export async function updateProjectAction(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;

    // Existing images (passed as hidden inputs or we might need to fetch them if not replacing)
    // For simplicity, let's say we append new images to existing ones? 
    // Or we strictly replace? 
    // A better UI would allow removing specific images.
    // For this generic "admin panel", usually users want to ADD photos or REPLACE.
    // Let's implement: Previous images + New Images.

    // We need to fetch the current project to know existing images if we want to keep them
    // But since this is a server action, let's assume the user passes currently kept image URLs as hidden inputs
    const existingImages = formData.getAll('existingImages') as string[];

    const newImageUrls: string[] = [];
    const files = formData.getAll('newImages') as File[];

    for (const file of files) {
        if (file.size > 0 && file.name !== 'undefined') {
            const url = await saveFile(file);
            newImageUrls.push(url);
        }
    }

    await updateProject(id, {
        title,
        category,
        description,
        date,
        imageUrls: [...existingImages, ...newImageUrls],
    });

    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/projects');
    redirect('/admin');
}

export async function deleteProjectAction(id: string) {
    await deleteProject(id);
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/projects');
    redirect('/admin');
}
