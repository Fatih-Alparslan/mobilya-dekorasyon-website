'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

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
            setError(data.message || 'Giriş başarısız!');
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
                            className="relative block w-full rounded-md border-0 bg-gray-800 py-3 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 mb-4"
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
                            className="relative block w-full rounded-md border-0 bg-gray-800 py-3 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-yellow-500 py-3 px-4 text-sm font-bold text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Giriş Yap
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-500 mt-4">
                        <p>Varsayılan: admin / admin123</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
