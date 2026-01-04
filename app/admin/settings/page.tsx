'use client';

import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Type, LayoutGrid } from 'lucide-react';

interface LogoSettings {
    id: number;
    logoText: string;
    hasLogoImage: boolean;
    logoMimeType: string | null;
    logoFileSize: number | null;
    selectedFavicon: string;
    updatedAt: string;
}

const FAVICONS = [
    { id: 'default', name: 'Varsayılan', path: '/favicon.ico' },
    { id: 'sofa', name: 'Koltuk', path: '/favicons/sofa.svg' },
    { id: 'chair', name: 'Sandalye', path: '/favicons/chair.svg' },
    { id: 'bed', name: 'Yatak', path: '/favicons/bed.svg' },
    { id: 'home', name: 'Ev', path: '/favicons/home.svg' },
];

export default function SettingsPage() {
    const [settings, setSettings] = useState<LogoSettings | null>(null);
    const [logoText, setLogoText] = useState('');
    const [selectedFavicon, setSelectedFavicon] = useState('default');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/logo');
            const data = await res.json();

            if (data.success) {
                setSettings(data.data);
                setLogoText(data.data.logoText);
                if (data.data.selectedFavicon) {
                    setSelectedFavicon(data.data.selectedFavicon);
                }

                // Eğer logo varsa, önizleme URL'ini ayarla
                if (data.data.hasLogoImage) {
                    setLogoPreview('/api/settings/logo/image?t=' + Date.now());
                }
            }
        } catch (error) {
            console.error('Ayarlar yüklenemedi:', error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Dosya tipini kontrol et
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Lütfen bir resim dosyası seçin' });
            return;
        }

        // Dosya boyutunu kontrol et (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Dosya boyutu 5MB\'dan küçük olmalıdır' });
            return;
        }

        setSelectedFile(file);

        // Önizleme oluştur
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadLogo = async () => {
        if (!selectedFile && !logoText && !selectedFavicon) {
            setMessage({ type: 'error', text: 'Lütfen bir değişiklik yapın' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            let logoData = null;

            if (selectedFile) {
                // Dosyayı base64'e çevir
                const reader = new FileReader();
                logoData = await new Promise<string>((resolve, reject) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(selectedFile);
                });
            }

            const res = await fetch('/api/settings/logo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logoData, logoText, favicon: selectedFavicon }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Ayarlar başarıyla güncellendi!' });
                setSelectedFile(null);
                await fetchSettings();
                // Refresh to update header
                window.location.reload();
            } else {
                setMessage({ type: 'error', text: data.message || 'Bir hata oluştu' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Sunucu hatası' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLogo = async () => {
        setLoading(true);
        setMessage(null);
        setShowDeleteConfirm(false);

        try {
            const res = await fetch('/api/settings/logo', {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Logo başarıyla silindi!' });
                setLogoPreview(null);
                setSelectedFile(null);
                await fetchSettings();
            } else {
                setMessage({ type: 'error', text: data.message || 'Bir hata oluştu' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Sunucu hatası' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Site Ayarları</h2>

            {/* Message */}
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
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Logo'yu Sil
                            </h3>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Logo'yu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Hayır
                            </button>
                            <button
                                onClick={handleDeleteLogo}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Evet, Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Favicon Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <LayoutGrid size={24} />
                    Favicon Seçimi
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {FAVICONS.map((icon) => (
                        <div
                            key={icon.id}
                            onClick={() => setSelectedFavicon(icon.id)}
                            className={`
                                cursor-pointer rounded-xl p-4 border-2 flex flex-col items-center gap-2 transition-all
                                ${selectedFavicon === icon.id
                                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
                            `}
                        >
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
                                <img src={icon.path} alt={icon.name} className="w-8 h-8 object-contain" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{icon.name}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs text-gray-500 dark:text-gray-400">
                    Seçtiğiniz ikon tarayıcı sekmesinde görünen site ikonu (favicon) olarak ayarlanacaktır.
                </div>
            </div>

            {/* Logo Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <ImageIcon size={24} />
                    Logo Yönetimi
                </h3>

                {/* Current Logo Preview */}
                {logoPreview && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mevcut Logo
                        </label>
                        <div className="relative inline-block">
                            <img
                                src={logoPreview}
                                alt="Logo"
                                className="max-h-32 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                            />
                            {settings?.hasLogoImage && (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    disabled={loading}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Logo'yu Sil"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                )}


                {/* Logo Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Yeni Logo Yükle
                    </label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <Upload size={20} />
                            <span>Dosya Seç</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={loading}
                            />
                        </label>
                        {selectedFile && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        PNG, JPG veya GIF formatında, maksimum 5MB
                    </p>
                </div>

                {/* Logo Text */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <Type size={18} />
                        Logo Metni (Fallback)
                    </label>
                    <input
                        type="text"
                        value={logoText}
                        onChange={(e) => setLogoText(e.target.value)}
                        placeholder="212 Huzur Mobilya"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Logo resmi yoksa bu metin gösterilecektir. "Mobilya" kelimesi sarı renkte vurgulanır.
                    </p>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleUploadLogo}
                    disabled={loading}
                    className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Bilgi</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Seçilen Favicon, tarayıcı sekmesinde görünür.</li>
                    <li>• Logo resmi yüklerseniz, site başlığında bu resim gösterilir</li>
                    <li>• Logo resmi yoksa, logo metni gösterilir</li>
                    <li>• Değişiklikler anında tüm sayfalarda görünür</li>
                </ul>
            </div>
        </div>
    );
}
