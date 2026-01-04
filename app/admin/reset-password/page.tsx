'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Key, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Geçersiz şifre sıfırlama linki');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }

        if (newPassword.length < 6) {
            setError('Şifre en az 6 karakter olmalı');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/admin/login');
                }, 3000);
            } else {
                setError(data.message || 'Bir hata oluştu');
            }
        } catch (err) {
            setError('Bağlantı hatası. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
                <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Geçersiz Link</h2>
                        <p className="text-gray-400 mb-6">
                            Şifre sıfırlama linki geçersiz veya süresi dolmuş.
                        </p>
                        <Link
                            href="/admin/forgot-password"
                            className="text-yellow-500 hover:text-yellow-400"
                        >
                            Yeni link talep et
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
                <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Şifre Değiştirildi</h2>
                        <p className="text-gray-400 mb-6">
                            Şifreniz başarıyla değiştirildi. Giriş sayfasına yönlendiriliyorsunuz...
                        </p>
                        <Link
                            href="/admin/login"
                            className="text-yellow-500 hover:text-yellow-400"
                        >
                            Hemen giriş yap
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800">
                <div className="text-center">
                    <Key className="mx-auto w-12 h-12 text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white">Yeni Şifre Belirle</h2>
                    <p className="mt-2 text-gray-400">
                        Hesabınız için yeni bir şifre oluşturun.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="newPassword" className="sr-only">
                            Yeni Şifre
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                name="newPassword"
                                type={showPassword ? 'text' : 'password'}
                                required
                                disabled={loading}
                                minLength={6}
                                className="relative block w-full rounded-md border-0 bg-gray-800 py-3 px-3 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                                placeholder="Yeni şifre (en az 6 karakter)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="sr-only">
                            Şifre Tekrar
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirm ? 'text' : 'password'}
                                required
                                disabled={loading}
                                minLength={6}
                                className="relative block w-full rounded-md border-0 bg-gray-800 py-3 px-3 pr-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                                placeholder="Şifre tekrar"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                            >
                                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md bg-yellow-500 py-3 px-4 text-sm font-bold text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-gray-950">
                <div className="text-white">Yükleniyor...</div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
