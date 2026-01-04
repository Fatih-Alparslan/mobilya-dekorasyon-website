'use server';

import { getAllUsers, deleteUser } from '@/lib/db';
import { revalidatePath } from 'next/cache';



export async function deleteUserAction(formData: FormData) {
    'use server';

    const userId = parseInt(formData.get('userId') as string);

    if (!userId) {
        return { success: false, message: 'Kullanıcı ID gerekli' };
    }

    try {
        const success = await deleteUser(userId);

        if (success) {
            revalidatePath('/admin/users');
            return { success: true, message: 'Kullanıcı silindi' };
        } else {
            return { success: false, message: 'Kullanıcı silinemedi' };
        }
    } catch (error) {
        console.error('Delete user error:', error);
        return { success: false, message: 'Bir hata oluştu' };
    }
}

export async function createUserAction(formData: FormData) {
    'use server';

    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!username || !email || !password) {
        return { success: false, message: 'Tüm alanlar gerekli' };
    }

    try {
        const role = formData.get('role') as 'super_admin' | 'admin' | 'editor';
        const { createUser } = await import('@/lib/db');
        await createUser({ username, email, password, role });

        revalidatePath('/admin/users');
        return { success: true, message: 'Kullanıcı oluşturuldu', redirectTo: '/admin/users' };
    } catch (error: any) {
        console.error('Create user error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Bu kullanıcı adı veya email zaten kullanılıyor' };
        }
        return { success: false, message: 'Kullanıcı oluşturulamadı' };
    }
}

export async function updateUserAction(formData: FormData) {
    'use server';

    const userId = parseInt(formData.get('userId') as string);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const isActive = formData.get('isActive') === 'true';

    if (!userId || !username || !email) {
        return { success: false, message: 'Tüm alanlar gerekli' };
    }

    try {
        const role = formData.get('role') as string;
        const { updateUser } = await import('@/lib/db');
        await updateUser(userId, { username, email, is_active: isActive, role });

        revalidatePath('/admin/users');
        return { success: true, message: 'Kullanıcı güncellendi', redirectTo: '/admin/users' };
    } catch (error: any) {
        console.error('Update user error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, message: 'Bu kullanıcı adı veya email zaten kullanılıyor' };
        }
        return { success: false, message: 'Kullanıcı güncellenemedi' };
    }
}
