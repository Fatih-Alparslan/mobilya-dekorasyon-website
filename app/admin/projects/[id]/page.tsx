'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { tr } from 'date-fns/locale';
import { format } from 'date-fns';

registerLocale('tr', tr);

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [project, setProject] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [imagesToKeep, setImagesToKeep] = useState<string[]>([]);
    const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    useEffect(() => {
        if (!id) return;

        // Fetch project
        fetch(`/api/projects/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProject(data.data);
                    setImagesToKeep(data.data.imageUrls || []);
                    if (data.data.date) {
                        setSelectedDate(new Date(data.data.date));
                    }
                    // First image is featured by default (due to ORDER BY in query)
                    if (data.data.imageUrls && data.data.imageUrls.length > 0) {
                        setFeaturedImageUrl(data.data.imageUrls[0]);
                    }
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
        // If removing featured image, set first remaining as featured
        if (imageUrl === featuredImageUrl) {
            const remaining = imagesToKeep.filter(url => url !== imageUrl);
            setFeaturedImageUrl(remaining.length > 0 ? remaining[0] : '');
        }
    };

    const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setNewFiles(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Clear input value to allow re-selection of same file
        e.target.value = '';
    };

    const handleRemoveNewFile = (index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSetFeatured = async (imageUrl: string) => {
        // Confirmation processed via Modal, proceeding directly
        try {
            const response = await fetch(`/api/projects/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageUrl }),
            });

            const data = await response.json();

            if (data.success) {
                setFeaturedImageUrl(imageUrl);
            } else {
                alert(data.message || 'Ana fotoğraf güncellenemedi');
            }
        } catch (error) {
            console.error('Set featured error:', error);
            alert('Ana fotoğraf güncellenirken bir hata oluştu');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Append new files manually since we are managing them in state
        formData.delete('newImages'); // Clear default input capture
        newFiles.forEach(file => {
            formData.append('newImages', file);
        });

        // Add images to keep as JSON
        formData.append('imagesToKeep', JSON.stringify(imagesToKeep));

        // Add featured image URL to persist the selection
        if (featuredImageUrl) {
            formData.append('featuredImageUrl', featuredImageUrl);
        }

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
                    <div className="mt-1">
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)}
                            locale="tr"
                            dateFormat="dd.MM.yyyy"
                            wrapperClassName="w-full"
                            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            placeholderText="Tarih seçin"
                        />
                        <input
                            type="hidden"
                            name="date"
                            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                        />
                    </div>
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
                                    className={`w-full h-32 object-cover rounded border ${url === featuredImageUrl
                                        ? 'border-yellow-500 border-2'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                />
                                {url === featuredImageUrl && (
                                    <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                        ⭐ Ana Fotoğraf
                                    </div>
                                )}
                                {url !== featuredImageUrl && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetFeatured(url)}
                                        className="absolute top-2 left-2 bg-gray-800/80 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-500 hover:text-black"
                                        title="Ana Fotoğraf Yap"
                                    >
                                        ⭐ Ana Yap
                                    </button>
                                )}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Yeni Fotoğraf Ekle {newFiles.length > 0 && `(${newFiles.length} seçildi)`}
                    </label>
                    <input
                        type="file"
                        name="newImages"
                        multiple
                        accept="image/*"
                        onChange={handleNewFileChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400"
                    />

                    {newPreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            {newPreviews.map((url, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={url}
                                        alt={`New Preview ${idx + 1}`}
                                        className="w-full h-32 object-cover rounded border border-gray-300 dark:border-gray-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveNewFile(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        title="Kaldır"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
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
