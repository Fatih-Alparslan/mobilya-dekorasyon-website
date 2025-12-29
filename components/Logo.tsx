import { getLogoSettings } from '@/lib/db';
import Link from 'next/link';

export default async function Logo() {
    const settings = await getLogoSettings();

    if (!settings) {
        return (
            <Link href="/" className="text-2xl font-bold tracking-tighter">
                MOBİLYA<span className="text-yellow-500">DEKORASYON</span>
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

    // Logo resmi yoksa text göster
    return (
        <Link href="/" className="text-2xl font-bold tracking-tighter">
            {settings.logo_text.split('DEKORASYON')[0]}
            <span className="text-yellow-500">
                {settings.logo_text.includes('DEKORASYON') ? 'DEKORASYON' : ''}
            </span>
        </Link>
    );
}
