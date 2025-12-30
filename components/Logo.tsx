import { getLogoSettings } from '@/lib/db';
import Link from 'next/link';

export default async function Logo() {
    const settings = await getLogoSettings();

    if (!settings) {
        return (
            <Link href="/" className="text-2xl font-bold tracking-tighter">
                212 Huzur <span className="text-yellow-500">Mobilya</span>
            </Link>
        );
    }

    // Eğer logo resmi varsa
    if (settings.logo_data) {
        return (
            <Link href="/" className="flex items-center">
                <img
                    src="/api/settings/logo/image"
                    alt={settings.logo_text}
                    className="h-12 w-auto object-contain"
                />
            </Link>
        );
    }

    // Logo resmi yoksa text göster - "212 Huzur Mobilya" formatında
    const logoText = settings.logo_text || '212 Huzur Mobilya';
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
