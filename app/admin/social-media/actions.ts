'use server'

import { addSocialMediaAccount, updateSocialMediaAccount, deleteSocialMediaAccount } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

async function checkAuth() {
    const session = (await cookies()).get('admin_session');
    if (!session) {
        throw new Error('Unauthorized');
    }
}

export async function addSocialMediaAction(formData: FormData) {
    await checkAuth();

    const platform = formData.get('platform') as string;
    const url = formData.get('url') as string;
    const icon = formData.get('icon') as string;
    // active and order managed differently or defaults

    await addSocialMediaAccount({
        platform,
        url,
        icon,
        is_active: true,
        display_order: 0 // Default, logic can be improved
    });

    revalidatePath('/admin/social-media');
    revalidatePath('/'); // Footer updates
}

export async function updateSocialMediaAction(id: number, isActive: boolean) {
    await checkAuth();
    await updateSocialMediaAccount(id, { is_active: isActive });
    revalidatePath('/admin/social-media');
    revalidatePath('/');
}

// For full update (edit url/platform)
export async function editSocialMediaAction(id: number, formData: FormData) {
    await checkAuth();
    const platform = formData.get('platform') as string;
    const url = formData.get('url') as string;
    const icon = formData.get('icon') as string;

    await updateSocialMediaAccount(id, { platform, url, icon });
    revalidatePath('/admin/social-media');
    revalidatePath('/');
}

export async function deleteSocialMediaAction(id: number) {
    await checkAuth();
    await deleteSocialMediaAccount(id);
    revalidatePath('/admin/social-media');
    revalidatePath('/');
}
