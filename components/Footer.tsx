'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone, Youtube, Twitter, MessageCircle, Globe, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageProvider';

interface ContactInfo {
    phone: string;
    email: string;
    address: string;
}

interface LogoData {
    logoText: string;
    hasLogoImage: boolean;
}

// WhatsApp SVG Component
const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export default function Footer() {
    const { language, dict } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        phone: '0555 555 55 55',
        email: 'info@mobilyadekorasyon.com',
        address: 'İstanbul, Türkiye\nCadde Sk. No:1'
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [socialAccounts, setSocialAccounts] = useState<any[]>([]);
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

        // Sosyal medya hesaplarını fetch et
        fetch('/api/social-media')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSocialAccounts(data.data);
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

    const getSocialIcon = (iconName: string) => {
        switch (iconName) {
            case 'Instagram': return Instagram;
            case 'Facebook': return Facebook;
            case 'Youtube': return Youtube;
            case 'Twitter': return Twitter;
            case 'Linkedin': return Linkedin;
            case 'MessageCircle': return WhatsAppIcon;
            case 'WhatsApp': return WhatsAppIcon;
            case 'Globe': return Globe;
            case 'Mail': return Mail;
            default: return Share2;
        }
    };

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
                        {dict.home.hero_subtitle}
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold text-lg mb-4">{dict.footer.quick_links}</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link href="/" className="hover:text-yellow-500">{dict.header.home}</Link></li>
                        <li><Link href="/projects" className="hover:text-yellow-500">{dict.header.projects}</Link></li>
                        <li><Link href="/about" className="hover:text-yellow-500">{dict.header.about}</Link></li>
                        <li><Link href="/contact" className="hover:text-yellow-500">{dict.header.contact}</Link></li>
                    </ul>
                </div>

                {/* Services - Dynamic Categories */}
                <div>
                    <h4 className="font-bold text-lg mb-4">{dict.home.our_services}</h4>
                    <ul className="space-y-2 text-gray-400">
                        {categories.length > 0 ? (
                            categories.map((category: any) => (
                                <li key={category.id}>
                                    <Link href={`/projects?category=${category.slug}`} className="hover:text-yellow-500">
                                        {language === 'en' ? (category.name_en || category.name) : category.name}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500">{dict.common.loading}</li>
                        )}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-bold text-lg mb-4">{dict.footer.contact_us}</h4>
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
                        {socialAccounts.length > 0 && (
                            <li className="pt-4 flex gap-4 flex-wrap">
                                {socialAccounts.map((account: any) => {
                                    const Icon = getSocialIcon(account.icon);
                                    return (
                                        <a
                                            key={account.id}
                                            href={account.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-yellow-500 transition-colors"
                                            title={account.platform}
                                        >
                                            <Icon size={24} />
                                        </a>
                                    );
                                })}
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-900 pt-8 mt-8 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} 212 Huzur Mobilya. {dict.footer.rights}</p>
            </div>
        </footer>
    );
}
