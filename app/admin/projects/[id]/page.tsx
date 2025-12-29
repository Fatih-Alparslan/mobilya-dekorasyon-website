'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X } from 'lucide-react';

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [project, setProject] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [imagesToKeep, setImagesToKeep] = useState<string[]>([]);

    useEffect(() => {
        if (!id) return;

        // Fetch project
        fetch(`/api/projects/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProject(data.data);
                    setImagesToKeep(data.data.imageUrls || []);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        // Fetch categories
        fetch('/api/projects/categories')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCategories(data.data);
                }
            })
            .catch(err => console.error(err));
    }, [id]);

    const handleRemoveImage = (imageUrl: string) => {
        setImagesToKeep(prev => prev.filter(url => url !== imageUrl));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Add images to keep as JSON
        formData.append('imagesToKeep', JSON.stringify(imagesToKeep));

        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                body: formData
            });

            if (res.ok) {
                router.push('/admin');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8">Yükleniyor...</div>;
    if (!project) return <div className="p-8">Proje bulunamadı</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Projeyi Düzenle</h2>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proje Başlığı</label>
                    <input
                        name="title"
                        defaultValue={project.title}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
                    <select
                        name="category_id"
                        defaultValue={project.category_id || ''}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    >
                        <option value="">Kategori Seçin</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tarih</label>
                    <input
                        name="date"
                        type="date"
                        defaultValue={project.date}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Açıklama</label>
                    <textarea
                        name="description"
                        rows={4}
                        defaultValue={project.description}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mevcut Resimler
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {imagesToKeep.map((url: string, idx: number) => (
                            <div key={idx} className="relative group">
                                <img
                                    src={url}
                                    alt="Project"
                                    className="w-full h-32 object-cover rounded border border-gray-300 dark:border-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(url)}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    title="Resmi Sil"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        {imagesToKeep.length === 0 && (
                            <span className="text-gray-500 text-sm col-span-3">Resim yok</span>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Yeni Fotoğraf Ekle</label>
                    <input
                        type="file"
                        name="newImages"
                        multiple
                        accept="image/*"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                    >
                        Güncelle
                    </button>
                </div>
            </form>
        </div>
    );
}
