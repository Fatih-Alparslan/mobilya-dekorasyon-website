'use client';

import { createProjectAction } from '../../actions';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { tr } from 'date-fns/locale';
import { format } from 'date-fns';

registerLocale('tr', tr);

export default function NewProjectPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    useEffect(() => {
        fetch('/api/projects/categories')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCategories(data.data);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(prev => [...prev, ...files]);

        // Create preview URLs
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrls(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        // If removing featured image, set first remaining as featured
        if (index === featuredImageIndex) {
            setFeaturedImageIndex(0);
        } else if (index < featuredImageIndex) {
            setFeaturedImageIndex(prev => prev - 1);
        }
    };

    const handleSetFeatured = (index: number) => {
        // Confirmation is done via Modal
        setFeaturedImageIndex(index);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Remove the original images input and add selected files
        formData.delete('images');

        // Reorder files so featured image is first
        const reorderedFiles = [...selectedFiles];
        if (featuredImageIndex > 0 && featuredImageIndex < reorderedFiles.length) {
            const featuredFile = reorderedFiles[featuredImageIndex];
            reorderedFiles.splice(featuredImageIndex, 1);
            reorderedFiles.unshift(featuredFile);
        }

        reorderedFiles.forEach(file => {
            formData.append('images', file);
        });

        await createProjectAction(formData);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Yeni Proje Ekle</h2>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proje Başlığı</label>
                    <input
                        name="title"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori</label>
                    <select
                        name="category_id"
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
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                </div>

                {previewUrls.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Seçilen Fotoğraflar ({selectedFiles.length})
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {previewUrls.map((url, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Preview ${idx + 1}`}
                                        className={`w-full h-32 object-cover rounded border ${idx === featuredImageIndex
                                            ? 'border-yellow-500 border-2'
                                            : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                    />
                                    {idx === featuredImageIndex && (
                                        <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                            ⭐ Ana Fotoğraf
                                        </div>
                                    )}
                                    {idx !== featuredImageIndex && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetFeatured(idx)}
                                            className="absolute top-2 left-2 bg-gray-800/80 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-500 hover:text-black"
                                            title="Ana Fotoğraf Yap"
                                        >
                                            ⭐ Ana Yap
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        title="Resmi Kaldır"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fotoğraf Yükle {selectedFiles.length > 0 && `(${selectedFiles.length} seçildi)`}
                    </label>
                    <input
                        type="file"
                        name="images"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Birden fazla fotoğraf seçebilirsiniz
                    </p>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                    >
                        Kaydet
                    </button>
                </div>
            </form>
        </div>
    );
}
