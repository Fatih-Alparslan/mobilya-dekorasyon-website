import { createAboutSectionAction } from '../actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewAboutSectionPage() {
    return (
        <div className="max-w-2xl">
            <Link
                href="/admin/about"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
            >
                <ArrowLeft size={20} />
                Bölümlere Dön
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Yeni Bölüm Ekle</h2>

            <form action={createAboutSectionAction} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Başlık *
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                            placeholder="Biz Kimiz?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            İçerik *
                        </label>
                        <textarea
                            name="content"
                            required
                            rows={8}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                            placeholder="Bölüm içeriğini buraya yazın..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Sıralama
                        </label>
                        <input
                            type="number"
                            name="display_order"
                            defaultValue={0}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Küçük sayılar önce gösterilir
                        </p>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            defaultChecked
                            className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                        />
                        <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Aktif (Sayfada göster)
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            Bölümü Ekle
                        </button>
                        <Link
                            href="/admin/about"
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
