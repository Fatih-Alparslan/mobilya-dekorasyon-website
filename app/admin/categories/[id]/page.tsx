'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [initialSlug, setInitialSlug] = useState('');

    useEffect(() => {
        if (!id) return;

        // Kategori bilgilerini yükle
        fetch(`/api/categories/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setName(data.data.name);
                    setSlug(data.data.slug);
                    setInitialSlug(data.data.slug);
                    setDescription(data.data.description || '');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Kategori yüklenemedi');
                setLoading(false);
            });
    }, [id]);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ı/g, 'i')
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (value: string) => {
        setName(value);
        if (!slug || slug === initialSlug) {
            setSlug(generateSlug(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, slug, description })
            });

            const data = await res.json();

            if (data.success) {
                router.push('/admin/categories');
            } else {
                setError(data.message || 'Bir hata oluştu');
            }
        } catch (err) {
            setError('Sunucu hatası');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Yükleniyor...</div>;
    if (error && !name) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="max-w-2xl">
            <Link
                href="/admin/categories"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
            >
                <ArrowLeft size={20} />
                Kategorilere Dön
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Kategori Düzenle</h2>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Kategori Adı *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                            placeholder="Villa Tasarımı"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Slug *
                        </label>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                            placeholder="villa-tasarimi"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            URL'de kullanılacak benzersiz tanımlayıcı
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Açıklama
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                            placeholder="Kategori açıklaması (opsiyonel)"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                        <Link
                            href="/admin/categories"
                            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
                        >
                            İptal
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
