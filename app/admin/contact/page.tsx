'use client';

import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { deleteContactSubmissionAction } from './actions';

interface ContactInfo {
    phone: string;
    email: string;
    address: string;
    working_hours: string;
    map_embed_url?: string;
}

interface ContactSubmission {
    id: number;
    name: string;
    phone: string;
    email: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function AdminContactPage() {
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        phone: '',
        email: '',
        address: '',
        working_hours: '',
        map_embed_url: ''
    });
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: number | null }>({ show: false, id: null });

    useEffect(() => {
        fetchContactInfo();
        fetchSubmissions();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const res = await fetch('/api/contact/info');
            const data = await res.json();
            if (data.success) {
                setContactInfo(data.data);
            }
        } catch (error) {
            console.error('Fetch contact info error:', error);
        }
    };

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('/api/contact/submissions');
            const data = await res.json();
            if (data.success) {
                setSubmissions(data.data);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error('Fetch submissions error:', error);
        }
    };

    const handleUpdateContactInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/contact/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactInfo)
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'İletişim bilgileri başarıyla güncellendi!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Bir hata oluştu' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Sunucu hatası' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleRead = async (id: number, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/contact/submissions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, is_read: !currentStatus })
            });

            if (res.ok) {
                await fetchSubmissions();
            }
        } catch (error) {
            console.error('Toggle read error:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">İletişim Yönetimi</h2>

            {message && (
                <div
                    className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Silme Onay Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Mesajı Sil
                            </h3>
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null })}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null })}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Hayır
                            </button>
                            <form action={deleteContactSubmissionAction.bind(null, deleteConfirm.id!)}>
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

            {/* İletişim Bilgileri Düzenleme */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Phone size={24} />
                    İletişim Bilgileri
                </h3>

                <form onSubmit={handleUpdateContactInfo} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Telefon
                            </label>
                            <input
                                type="text"
                                value={contactInfo.phone}
                                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                E-posta
                            </label>
                            <input
                                type="email"
                                value={contactInfo.email}
                                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Adres
                        </label>
                        <input
                            type="text"
                            value={contactInfo.address}
                            onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Çalışma Saatleri
                        </label>
                        <input
                            type="text"
                            value={contactInfo.working_hours}
                            onChange={(e) => setContactInfo({ ...contactInfo, working_hours: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500"
                            disabled={loading}
                            placeholder="Pazartesi - Cumartesi: 09:00 - 19:00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Google Maps Embed Linki
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Google Haritalar'da yerinizi bulup "Paylaş" {'>'} "Harita yerleştir" kısmındaki iframe kodunun içindeki <strong>src="..."</strong> linkini buraya yapıştırın.
                        </p>
                        <textarea
                            rows={3}
                            value={contactInfo.map_embed_url || ''}
                            onChange={(e) => setContactInfo({ ...contactInfo, map_embed_url: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 text-sm font-mono"
                            disabled={loading}
                            placeholder="https://www.google.com/maps/embed?pb=!1m18!1m12!..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </form>
            </div>

            {/* Gelen Mesajlar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <MessageSquare size={24} />
                    Gelen Mesajlar
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </h3>

                {submissions.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        Henüz mesaj bulunmuyor
                    </p>
                ) : (
                    <div className="space-y-4">
                        {submissions.map((submission) => (
                            <div
                                key={submission.id}
                                className={`p-4 rounded-lg border ${submission.is_read
                                    ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">
                                            {submission.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {submission.email} • {submission.phone}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(submission.created_at)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleToggleRead(submission.id, submission.is_read)}
                                            className={`${submission.is_read
                                                ? 'text-gray-500 hover:text-gray-700'
                                                : 'text-blue-500 hover:text-blue-700'
                                                }`}
                                            title={submission.is_read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
                                        >
                                            {submission.is_read ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteConfirm({ show: true, id: submission.id })}
                                            className="text-red-500 hover:text-red-700"
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {submission.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
