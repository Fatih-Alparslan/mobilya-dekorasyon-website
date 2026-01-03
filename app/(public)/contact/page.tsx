'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Youtube, Twitter, Linkedin, MessageCircle, Globe, Share2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

// WhatsApp SVG Component
const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export default function ContactPage() {
    const { language, dict } = useLanguage();
    const [info, setInfo] = useState<any>(null);
    const [socials, setSocials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/contact/info').then(res => res.json()),
            fetch('/api/social-media').then(res => res.json())
        ])
            .then(([infoData, socialData]) => {
                if (infoData.success) setInfo(infoData.data);
                if (socialData.success) setSocials(socialData.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert(language === 'tr' ? 'Mesajınız alındı, teşekkürler.' : 'Message received, thank you.');
        e.currentTarget.reset();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">{dict.common.loading}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-32 pt-40">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6">
                            <Sparkles size={16} className="text-yellow-500" />
                            <span className="text-yellow-500 text-sm font-medium">
                                {language === 'tr' ? 'İletişim' : 'Contact'}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            {dict.header.contact}
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            {language === 'tr'
                                ? 'Projeleriniz için bizimle iletişime geçin, hayallerinizi gerçeğe dönüştürelim.'
                                : 'Contact us for your projects, let\'s turn your dreams into reality.'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Side: Info & Map (approx 35% -> using 4/12 = 33%) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Info Cards - Compact */}
                        <div className="grid gap-4">
                            <a
                                href={`tel:${(info?.phone || '').replace(/\s/g, '')}`}
                                className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:border-yellow-500/50 transition-colors block cursor-pointer group"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="text-yellow-500 group-hover:scale-110 transition-transform"><Phone size={20} /></div>
                                    <h3 className="text-white font-bold text-sm group-hover:text-yellow-500 transition-colors">{language === 'tr' ? 'Telefon' : 'Phone'}</h3>
                                </div>
                                <p className="text-gray-400 text-sm font-medium pl-8 group-hover:text-gray-300">{info?.phone || '0555 555 55 55'}</p>
                            </a>

                            <a
                                href={`mailto:${info?.email || 'info@mobilyadekorasyon.com'}`}
                                className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:border-yellow-500/50 transition-colors block cursor-pointer group"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="text-yellow-500 group-hover:scale-110 transition-transform"><Mail size={20} /></div>
                                    <h3 className="text-white font-bold text-sm group-hover:text-yellow-500 transition-colors">{language === 'tr' ? 'E-Posta' : 'Email'}</h3>
                                </div>
                                <p className="text-gray-400 text-sm font-medium pl-8 break-all group-hover:text-gray-300">{info?.email || 'info@mobilyadekorasyon.com'}</p>
                            </a>

                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:border-yellow-500/50 transition-colors">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="text-yellow-500"><MapPin size={20} /></div>
                                    <h3 className="text-white font-bold text-sm">{language === 'tr' ? 'Adres' : 'Address'}</h3>
                                </div>
                                <p className="text-gray-400 text-sm pl-8 whitespace-pre-line">{info?.address || 'İstanbul, Türkiye'}</p>
                            </div>
                        </div>

                        {/* WhatsApp Button */}
                        {(() => {
                            const whatsappAccount = socials.find(s =>
                                s.icon === 'WhatsApp' ||
                                s.icon === 'MessageCircle' ||
                                s.platform.toLowerCase().includes('whatsapp')
                            );

                            const href = whatsappAccount?.url || `https://wa.me/${(info?.phone || '').replace(/\D/g, '').replace(/^0/, '90')}`;

                            return (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#25D366] hover:bg-[#128C7E] text-white p-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold w-full shadow-lg shadow-green-500/20"
                                >
                                    <WhatsAppIcon />
                                    <span className="text-sm">{language === 'tr' ? 'WhatsApp ile Hemen Ulaşın' : 'Contact via WhatsApp'}</span>
                                </a>
                            );
                        })()}

                        {/* Social Media Links */}
                        {socials.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {socials.map(acc => {
                                    const Icon = getSocialIcon(acc.icon);
                                    return (
                                        <a
                                            key={acc.id}
                                            href={acc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-gray-800 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                            title={acc.platform}
                                        >
                                            <Icon size={18} />
                                        </a>
                                    )
                                })}
                            </div>
                        )}

                        {/* Map - Compact */}
                        <div className="h-48 bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                            <iframe
                                src={info?.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192697.8885052968!2d28.871754641659954!3d41.00549580931257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1704320000000!5m2!1str!2str"}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right Side: Form (approx 65% -> using 8/12 = 66%) */}
                    <div className="lg:col-span-8 bg-gray-900/30 p-8 md:p-12 rounded-3xl border border-gray-800">
                        <div className="mb-10">
                            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                                {language === 'tr' ? 'Bize Mesaj Gönderin' : 'Send us a Message'}
                            </h3>
                            <p className="text-gray-400 text-lg">
                                {language === 'tr'
                                    ? 'Projeleriniz için detaylı bilgi almak, fiyat teklifi istemek veya sadece merhaba demek için formu doldurabilirsiniz.'
                                    : 'You can fill out the form to get detailed information about your projects, ask for a quote or just to say hello.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">
                                        {language === 'tr' ? 'Adınız' : 'Your Name'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-gray-600"
                                        placeholder={language === 'tr' ? 'Adınız' : 'John'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">
                                        {language === 'tr' ? 'Soyadınız' : 'Your Surname'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-gray-600"
                                        placeholder={language === 'tr' ? 'Soyadınız' : 'Doe'}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">
                                        {language === 'tr' ? 'E-Posta' : 'Email'}
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-gray-600"
                                        placeholder="mail@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">
                                        {language === 'tr' ? 'Telefon' : 'Phone'}
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-gray-600"
                                        placeholder="0555 555 55 55"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">
                                    {language === 'tr' ? 'Mesajınız' : 'Your Message'}
                                </label>
                                <textarea
                                    rows={8}
                                    required
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-gray-600 resize-none"
                                    placeholder={language === 'tr' ? 'Mesajınızı buraya yazın...' : 'Type your message here...'}
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 text-lg shadow-lg shadow-yellow-500/20"
                                >
                                    <Send size={20} />
                                    {language === 'tr' ? 'Mesajı Gönder' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
