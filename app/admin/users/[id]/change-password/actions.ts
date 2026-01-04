'use server';

import { updateUserPassword } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function changePasswordAction(formData: FormData) {
    'use server';

    const userId = parseInt(formData.get('userId') as string);
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!userId || !newPassword || !confirmPassword) {
        return { success: false, message: 'Tüm alanlar gerekli' };
    }

    if (newPassword !== confirmPassword) {
        return { success: false, message: 'Şifreler eşleşmiyor' };
    }

    if (newPassword.length < 6) {
        return { success: false, message: 'Şifre en az 6 karakter olmalı' };
    }

    try {
        const success = await updateUserPassword(userId, newPassword);

        if (success) {
            revalidatePath(`/admin/users/${userId}`);
            return { success: true, message: 'Şifre başarıyla değiştirildi', redirectTo: `/admin/users/${userId}` };
        } else {
            return { success: false, message: 'Şifre güncellenemedi' };
        }
    } catch (error) {
        console.error('Change password error:', error);
        return { success: false, message: 'Bir hata oluştu' };
    }
}
