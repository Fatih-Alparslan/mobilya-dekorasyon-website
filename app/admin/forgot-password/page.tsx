'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.message || 'Bir hata oluştu');
            }
        } catch (err) {
            setError('Bağlantı hatası. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
                <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Email Gönderildi</h2>
                        <p className="text-gray-400 mb-6">
                            Eğer bu email adresi sistemde kayıtlıysa, şifre sıfırlama linki gönderildi.
                        </p>
                        <p className="text-sm text-gray-500 mb-8">
                            Email'inizi kontrol edin ve linke tıklayarak şifrenizi sıfırlayın.
                        </p>
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Giriş sayfasına dön
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
                    <h2 className="text-2xl font-bold text-white">Şifremi Unuttum</h2>
                    <p className="mt-2 text-gray-400">
                        Email adresinizi girin, size şifre sıfırlama linki gönderelim.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email Adresi
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                disabled={loading}
                                className="relative block w-full rounded-md border-0 bg-gray-800 py-3 pl-10 pr-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                                placeholder="Email adresiniz"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md bg-yellow-500 py-3 px-4 text-sm font-bold text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Linki Gönder'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Giriş sayfasına dön
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
