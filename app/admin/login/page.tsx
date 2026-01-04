'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push('/admin');
                router.refresh();
            } else {
                // Show specific error messages
                if (res.status === 429) {
                    setError(data.message || 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.');
                } else if (data.remaining !== undefined) {
                    setError(`${data.message} (Kalan deneme: ${data.remaining})`);
                } else {
                    setError(data.message || 'Giriş başarısız!');
                }
            }
        } catch (err) {
            setError('Bağlantı hatası. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-md space-y-8 bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Yönetici Girişi</h2>
                    <p className="mt-2 text-gray-400">Devam etmek için giriş yapınız.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="sr-only">
                            Kullanıcı Adı
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            disabled={loading}
                            className="relative block w-full rounded-md border-0 bg-gray-800 py-3 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 mb-4 disabled:opacity-50"
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">
                            Şifre
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={loading}
                            className="relative block w-full rounded-md border-0 bg-gray-800 py-3 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-md bg-yellow-500 py-3 px-4 text-sm font-bold text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/admin/forgot-password"
                            className="text-sm text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                            Şifremi unuttum
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
