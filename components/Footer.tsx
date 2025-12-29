'use client';

import Link from 'next/link';
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ContactInfo {
    phone: string;
    email: string;
    address: string;
}

export default function Footer() {
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        phone: '0555 555 55 55',
        email: 'info@mobilyadekorasyon.com',
        address: 'İstanbul, Türkiye\nCadde Sk. No:1'
    });
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        // İletişim bilgilerini fetch et
        // Fetch contact info
        fetch('/api/contact/info')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setContactInfo(data.data);
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

    return (
        <footer className="bg-gray-950 text-white pt-16 pb-8 border-t border-gray-900">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 mb-12">
                {/* Brand */}
                <div>
                    <h3 className="text-2xl font-bold mb-4">
                        MOBİLYA<span className="text-yellow-500">DEKORASYON</span>
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                        Kalite ve estetiği buluşturarak yaşam alanlarınıza değer katıyoruz. Modern tasarımlar ve profesyonel uygulamalar.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold text-lg mb-4">Hızlı Erişim</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link href="/" className="hover:text-yellow-500">Anasayfa</Link></li>
                        <li><Link href="/projects" className="hover:text-yellow-500">Projeler</Link></li>
                        <li><Link href="/about" className="hover:text-yellow-500">Hakkımızda</Link></li>
                        <li><Link href="/contact" className="hover:text-yellow-500">İletişim</Link></li>
                    </ul>
                </div>

                {/* Services - Dynamic Categories */}
                <div>
                    <h4 className="font-bold text-lg mb-4">Hizmetler</h4>
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
                    <h4 className="font-bold text-lg mb-4">İletişim</h4>
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
                <p>© 2024 Mobilya Dekorasyon. Tüm hakları saklıdır.</p>
            </div>
        </footer>
    );
}
