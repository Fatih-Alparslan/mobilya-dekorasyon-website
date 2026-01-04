'use client';

import { createUserAction } from '../actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewUserPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await createUserAction(formData);
            if (result.success && result.redirectTo) {
                router.push(result.redirectTo);
            } else if (!result.success) {
                setError(result.message);
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kullanıcılara Dön
                </Link>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <UserPlus className="w-7 h-7" />
                    Yeni Kullanıcı Ekle
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kullanıcı Adı *
                    </label>
                    <input
                        name="username"
                        type="text"
                        required
                        disabled={loading}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 disabled:opacity-50"
                        placeholder="admin"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                    </label>
                    <input
                        name="email"
                        type="email"
                        required
                        disabled={loading}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 disabled:opacity-50"
                        placeholder="admin@example.com"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Şifre sıfırlama için kullanılacak
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kullanıcı Rolü *
                    </label>
                    <select
                        name="role"
                        required
                        disabled={loading}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 disabled:opacity-50"
                    >
                        <option value="editor">Editör (Sadece içerik yönetimi)</option>
                        <option value="admin">Yönetici (Kullanıcı yönetimi hariç her şey)</option>
                        <option value="super_admin">Süper Yönetici (Tam yetki)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Şifre *
                    </label>
                    <input
                        name="password"
                        type="password"
                        required
                        disabled={loading}
                        minLength={6}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 disabled:opacity-50"
                        placeholder="En az 6 karakter"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Minimum 6 karakter
                    </p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <Link
                        href="/admin/users"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        İptal
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
                    </button>
                </div>
            </form>
        </div>
    );
}
