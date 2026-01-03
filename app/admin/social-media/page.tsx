'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Check, Share2, Instagram, Facebook, Youtube, Twitter, Linkedin, MessageCircle, MapPin, Globe, Mail } from 'lucide-react';
import { addSocialMediaAction, updateSocialMediaAction, deleteSocialMediaAction, editSocialMediaAction } from './actions';

// WhatsApp SVG Component
const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

// Icon mapping for selection display
const AVAILABLE_ICONS = [
    { name: 'Instagram', icon: Instagram },
    { name: 'Facebook', icon: Facebook },
    { name: 'Youtube', icon: Youtube },
    { name: 'Twitter', icon: Twitter },
    { name: 'Linkedin', icon: Linkedin },
    { name: 'WhatsApp', icon: WhatsAppIcon },
    { name: 'MessageCircle', icon: WhatsAppIcon, label: 'WhatsApp' },
    { name: 'Phone', icon: MessageCircle },
    { name: 'Globe', icon: Globe },
    { name: 'Mail', icon: Mail }
];

// Cleaned list for UI
const ICON_OPTIONS = [
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Youtube', label: 'Youtube' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Linkedin', label: 'Linkedin' },
    { value: 'MessageCircle', label: 'WhatsApp' },
    { value: 'Globe', label: 'Web Site' },
    { value: 'Mail', label: 'E-Posta' },
];

export default function SocialMediaAdmin() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{ show: boolean; type: 'add' | 'edit'; data?: any }>({
        show: false,
        type: 'add'
    });
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number | null }>({
        show: false,
        id: null
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await fetch('/api/social-media?all=true');
            const data = await res.json();
            if (data.success) {
                setAccounts(data.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        // Optimistic update
        setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, is_active: !currentStatus } : acc));

        try {
            await updateSocialMediaAction(id, !currentStatus);
        } catch (e) {
            // Revert on error
            console.error(e);
            fetchAccounts();
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        try {
            await deleteSocialMediaAction(deleteConfirm.id);
            setDeleteConfirm({ show: false, id: null });
            fetchAccounts();
        } catch (e) {
            console.error(e);
            alert('Silme işlemi başarısız');
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            if (modal.type === 'add') {
                await addSocialMediaAction(formData);
            } else {
                await editSocialMediaAction(modal.data.id, formData);
            }
            setModal({ show: false, type: 'add' });
            fetchAccounts();
        } catch (e) {
            console.error(e);
            alert('Kaydetme işlemi başarısız');
        }
    };

    const getIconComponent = (iconName: string) => {
        const iconDef = AVAILABLE_ICONS.find(i => i.name === iconName);
        const Icon = iconDef ? iconDef.icon : Share2;
        return <Icon size={20} />;
    };

    if (loading) return <div className="p-8">Yükleniyor...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sosyal Medya Hesapları</h2>
                <button
                    onClick={() => setModal({ show: true, type: 'add' })}
                    className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                >
                    <Plus size={20} />
                    Yeni Ekle
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">İkon</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Durum</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {accounts.map((account) => (
                            <tr key={account.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                                    {getIconComponent(account.icon)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">
                                    {account.platform}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                    <a href={account.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline">
                                        {account.url}
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => handleToggleStatus(account.id, !!account.is_active)}
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${account.is_active
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {account.is_active ? 'Aktif' : 'Pasif'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setModal({ show: true, type: 'edit', data: account })}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Düzenle"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm({ show: true, id: account.id })}
                                            className="text-red-500 hover:text-red-700"
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {accounts.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        Henüz hiç sosyal medya hesabı eklenmemiş.
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {modal.type === 'add' ? 'Yeni Hesap Ekle' : 'Hesabı Düzenle'}
                            </h3>
                            <button
                                onClick={() => setModal({ show: false, type: 'add' })}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Platform Adı</label>
                                <input
                                    name="platform"
                                    required
                                    defaultValue={modal.data?.platform || ''}
                                    placeholder="Örn: Instagram"
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">İkon Seçimi</label>
                                <select
                                    name="icon"
                                    required
                                    defaultValue={modal.data?.icon || 'Instagram'}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
                                >
                                    {ICON_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL linki</label>
                                <input
                                    name="url"
                                    required
                                    type="url"
                                    defaultValue={modal.data?.url || ''}
                                    placeholder="https://..."
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:ring-yellow-500 focus:border-yellow-500"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModal({ show: false, type: 'add' })}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 font-medium"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-xl text-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Emin misiniz?</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Bu hesabı silmek istediğinize emin misiniz?</p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null })}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
                            >
                                Hayır
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Evet, Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
