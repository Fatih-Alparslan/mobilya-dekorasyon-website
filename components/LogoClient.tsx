'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LogoClient() {
    const [logoData, setLogoData] = useState<{
        logoText: string;
        hasLogoImage: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/settings/logo')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLogoData(data.data);
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    if (loading || !logoData) {
        return (
            <Link href="/" className="text-2xl font-bold tracking-tighter">
                212 Huzur <span className="text-yellow-500">Mobilya</span>
            </Link>
        );
    }

    // Eğer logo resmi varsa
    if (logoData.hasLogoImage) {
        return (
            <Link href="/" className="flex items-center">
                <img
                    src={`/api/settings/logo/image?t=${Date.now()}`}
                    alt={logoData.logoText}
                    className="h-12 w-auto object-contain max-w-[200px]"
                />
            </Link>
        );
    }

    // Logo resmi yoksa text göster - "212 Huzur Mobilya" formatında
    const logoText = logoData.logoText || '212 Huzur Mobilya';
    const parts = logoText.split('Mobilya');

    return (
        <Link href="/" className="text-2xl font-bold tracking-tighter">
            {parts[0]}
            <span className="text-yellow-500">
                Mobilya{parts[1] || ''}
            </span>
        </Link>
    );
}
