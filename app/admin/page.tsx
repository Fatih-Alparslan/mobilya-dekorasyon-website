'use client';

import Link from 'next/link';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { deleteProjectAction } from './actions';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [projects, setProjects] = useState<any[]>([]);
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string | null; title: string }>({
        show: false,
        id: null,
        title: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            if (data.success) {
                setProjects(data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const d = new Date(dateString);
            return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Projeler</h2>
                <Link
                    href="/admin/projects/new"
                    className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                >
                    <Plus size={20} />
                    Yeni Proje Ekle
                </Link>
            </div>

            {/* Silme Onay Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Projeyi Sil
                            </h3>
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null, title: '' })}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            <strong>{deleteConfirm.title}</strong> projesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null, title: '' })}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Hayır
                            </button>
                            <form action={deleteProjectAction.bind(null, deleteConfirm.id!)}>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Evet, Sil
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Resim
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Başlık
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Kategori
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Tarih
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {project.imageUrls?.[0] ? (
                                        <img src={project.imageUrls[0]} alt={project.title} className="h-12 w-12 object-cover rounded" />
                                    ) : (
                                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400 text-xs">
                                            Resim Yok
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {project.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {project.category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {formatDate(project.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-3">
                                        <Link
                                            href={`/admin/projects/${project.id}`}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <Pencil size={18} />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteConfirm({ show: true, id: project.id, title: project.title })}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {projects.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        Henüz hiç proje yok.
                    </div>
                )}
            </div>
        </div>
    );
}
