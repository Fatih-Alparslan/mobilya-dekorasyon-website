'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactInfo {
    phone: string;
    email: string;
    address: string;
}

interface LogoData {
    logoText: string;
    hasLogoImage: boolean;
}

export default function Footer() {
    const { t } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        phone: '0555 555 55 55',
        email: 'info@mobilyadekorasyon.com',
        address: 'İstanbul, Türkiye\nCadde Sk. No:1'
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [logoData, setLogoData] = useState<LogoData | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // İletişim bilgilerini fetch et
        fetch('/api/contact/info')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setContactInfo(data.data);
                }
            })
            .catch(err => console.error(err));

        // Logo bilgilerini fetch et
        fetch('/api/settings/logo')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLogoData(data.data);
                }
            })
            .catch(err => console.error(err));

        // Fetch categories and projects to sort by count
        Promise.all([
            fetch('/api/projects/categories').then(res => res.json()),
            fetch('/api/projects').then(res => res.json())
        ])
            .then(([categoriesData, projectsData]) => {
                if (categoriesData.success && projectsData.success) {
                    const cats = categoriesData.data;
                    const projs = projectsData.data;

                    // Sort categories by project count (descending)
                    const sortedCats = cats.sort((a: any, b: any) => {
                        const aCount = projs.filter((p: any) => p.category === a.name).length;
                        const bCount = projs.filter((p: any) => p.category === b.name).length;
                        return bCount - aCount;
                    });

                    // Take first 4
                    setCategories(sortedCats.slice(0, 4));
                }
            })
            .catch(err => console.error(err));
    }, []);

    // Logo render fonksiyonu
    const renderLogo = () => {
        if (!logoData) {
            return (
                <h3 className="text-2xl font-bold mb-4">
                    212 Huzur <span className="text-yellow-500">Mobilya</span>
                </h3>
            );
        }

        // Eğer logo resmi varsa
        if (logoData.hasLogoImage) {
            return (
                <div className="mb-4">
                    <img
                        src={`/api/settings/logo/image?t=${Date.now()}`}
                        alt={logoData.logoText}
                        className="h-12 w-auto object-contain"
                    />
                </div>
            );
        }

        // Logo resmi yoksa text göster - "212 Huzur Mobilya" formatında
        const logoText = logoData.logoText || '212 Huzur Mobilya';
        const parts = logoText.split('Mobilya');

        return (
            <h3 className="text-2xl font-bold mb-4">
                {parts[0]}
                <span className="text-yellow-500">
                    Mobilya{parts[1] || ''}
                </span>
            </h3>
        );
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return null;
    }

    return (
        <footer className="bg-gray-950 text-white pt-16 pb-8 border-t border-gray-900">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 mb-12">
                {/* Brand */}
                <div>
                    {renderLogo()}
                    <p className="text-gray-400 leading-relaxed">
                        {t.footer.description}
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold text-lg mb-4">{t.footer.quickAccess}</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link href="/" className="hover:text-yellow-500">{t.footer.links.home}</Link></li>
                        <li><Link href="/projects" className="hover:text-yellow-500">{t.footer.links.projects}</Link></li>
                        <li><Link href="/about" className="hover:text-yellow-500">{t.footer.links.about}</Link></li>
                        <li><Link href="/contact" className="hover:text-yellow-500">{t.footer.links.contactPage}</Link></li>
                    </ul>
                </div>

                {/* Services - Dynamic Categories */}
                <div>
                    <h4 className="font-bold text-lg mb-4">{t.footer.services}</h4>
                    <ul className="space-y-2 text-gray-400">
                        {categories.length > 0 ? (
                            categories.map((category: any) => (
                                <li key={category.id}>
                                    <Link href={`/projects?category=${category.slug}`} className="hover:text-yellow-500">
                                        {category.name}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <>
                                <li><Link href="/projects" className="hover:text-yellow-500">Villa Tasarımı</Link></li>
                                <li><Link href="/projects" className="hover:text-yellow-500">Ofis Dekorasyonu</Link></li>
                                <li><Link href="/projects" className="hover:text-yellow-500">Mağaza Konsepti</Link></li>
                                <li><Link href="/projects" className="hover:text-yellow-500">Mobilya Üretimi</Link></li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-bold text-lg mb-4">{t.footer.contact}</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-start gap-3">
                            <MapPin className="text-yellow-500 shrink-0" size={20} />
                            <span className="whitespace-pre-line">{contactInfo.address}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="text-yellow-500 shrink-0" size={20} />
                            <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:text-yellow-500">
                                {contactInfo.phone}
                            </a>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="text-yellow-500 shrink-0" size={20} />
                            <a href={`mailto:${contactInfo.email}`} className="hover:text-yellow-500">
                                {contactInfo.email}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-900 pt-8 mt-8 text-center text-gray-500 text-sm">
                <p>© 2024 {t.footer.company}. {t.footer.rights}</p>
            </div>
        </footer>
    );
}
