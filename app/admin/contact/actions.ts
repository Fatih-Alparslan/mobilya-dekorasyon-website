'use server';

import { deleteSubmission } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteContactSubmissionAction(id: number) {
    await deleteSubmission(id);
    revalidatePath('/admin/contact');
    redirect('/admin/contact');
}
