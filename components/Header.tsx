'use client';

import Link from 'next/link';
import { Menu, X, Phone, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from './LogoClient';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('0555 555 55 55');
    const { t } = useLanguage();

    useEffect(() => {
        // İletişim bilgilerini fetch et
        fetch('/api/contact/info')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data.phone) {
                    setPhoneNumber(data.data.phone);
                }
            })
            .catch(err => console.error('Phone fetch error:', err));
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800 text-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Logo />


                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 items-center font-medium">
                    <Link href="/" className="hover:text-yellow-500 transition-colors">
                        {t.nav.home}
                    </Link>
                    <Link href="/projects" className="hover:text-yellow-500 transition-colors">
                        {t.nav.projects}
                    </Link>
                    <Link href="/about" className="hover:text-yellow-500 transition-colors">
                        {t.nav.about}
                    </Link>
                    <Link href="/contact" className="hover:text-yellow-500 transition-colors">
                        {t.nav.contact}
                    </Link>
                </nav>

                {/* CTA Button & Language Switcher */}
                <div className="hidden md:flex items-center gap-4">
                    <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm hover:text-yellow-500">
                        <Phone size={18} />
                        {phoneNumber}
                    </a>
                    <LanguageSwitcher />
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-black border-t border-gray-800 p-4 absolute w-full h-screen">
                    <nav className="flex flex-col gap-6 text-lg font-medium text-center pt-8">
                        <Link href="/" onClick={() => setIsOpen(false)}>{t.nav.home}</Link>
                        <Link href="/projects" onClick={() => setIsOpen(false)}>{t.nav.projects}</Link>
                        <Link href="/about" onClick={() => setIsOpen(false)}>{t.nav.about}</Link>
                        <Link href="/contact" onClick={() => setIsOpen(false)}>{t.nav.contact}</Link>
                        <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="flex items-center justify-center gap-2 hover:text-yellow-500">
                            <Phone size={18} />
                            {phoneNumber}
                        </a>
                        <div className="flex justify-center mt-4">
                            <LanguageSwitcher />
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
