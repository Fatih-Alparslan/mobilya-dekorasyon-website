import { createServiceAction } from '../actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ICON_OPTIONS = [
    { value: 'Home', label: 'Home (Ev/Villa)' },
    { value: 'Building2', label: 'Building2 (Ofis/Bina)' },
    { value: 'Wrench', label: 'Wrench (İç Mimarlık)' },
    { value: 'Sofa', label: 'Sofa (Mobilya)' },
    { value: 'Paintbrush', label: 'Paintbrush (Dekorasyon)' },
    { value: 'Hammer', label: 'Hammer (İnşaat)' },
    { value: 'Ruler', label: 'Ruler (Planlama)' },
    { value: 'Package', label: 'Package (Teslimat)' },
];

export default function NewServicePage() {
    return (
        <div className="max-w-2xl">
            <Link
                href="/admin/services"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
            >
                <ArrowLeft size={20} />
                Hizmetlere Dön
            </Link>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Yeni Hizmet Ekle</h2>

            <form action={createServiceAction} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
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
                            placeholder="Villa Tasarımı"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Açıklama *
                        </label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                            placeholder="Hizmet açıklamasını buraya yazın..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            İkon
                        </label>
                        <select
                            name="icon"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                        >
                            {ICON_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
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
                            Aktif (Ana sayfada göster)
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            Hizmeti Ekle
                        </button>
                        <Link
                            href="/admin/services"
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
