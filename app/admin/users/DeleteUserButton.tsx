'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteUserAction } from './actions';
import ConfirmModal from '@/components/ConfirmModal';

export default function DeleteUserButton({ userId, username }: { userId: number; username: string }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const formData = new FormData();
        formData.append('userId', userId.toString());

        const result = await deleteUserAction(formData);

        if (result.success) {
            setShowConfirm(false);
        } else {
            alert(result.message);
        }
        setIsDeleting(false);
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                title="Kullanıcıyı Sil"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDelete}
                title="Kullanıcıyı Sil"
                message={`"${username}" kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
                confirmText="Sil"
                cancelText="İptal"
                isLoading={isDeleting}
            />
        </>
    );
}
