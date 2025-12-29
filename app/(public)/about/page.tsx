'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function AboutPage() {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/about')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSections(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">Yükleniyor...</div>
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
                            <span className="text-yellow-500 text-sm font-medium">Hakkımızda</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                            Hayallerinizdeki Mekanları Gerçeğe Dönüştürüyoruz
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Mobilya ve dekorasyon sektöründe yılların deneyimi ile, her projede mükemmeliyeti hedefliyoruz.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-6xl mx-auto space-y-32">
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Image Side */}
                            {section.image_url && (
                                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                                    <div className="relative aspect-square rounded-2xl overflow-hidden">
                                        <img
                                            src={section.image_url}
                                            alt={section.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    </div>
                                </div>
                            )}

                            {/* Content Side */}
                            <div className={`${index % 2 === 1 ? 'md:order-1' : ''} ${!section.image_url ? 'md:col-span-2' : ''}`}>
                                <div className="space-y-6">
                                    <div>
                                        <div className="inline-block bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1 mb-4">
                                            <span className="text-yellow-500 text-sm font-medium">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <h2 className="text-4xl font-bold mb-4">{section.title}</h2>
                                    </div>
                                    <div className="prose prose-invert prose-lg max-w-none">
                                        {section.content.split('\n').map((paragraph: string, idx: number) => (
                                            paragraph.trim() && (
                                                <p key={idx} className="text-gray-300 leading-relaxed mb-4">
                                                    {paragraph}
                                                </p>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-black mb-6">
                        Hayallerinizdeki Projeyi Birlikte Gerçekleştirelim
                    </h2>
                    <p className="text-black/80 text-lg mb-8 max-w-2xl mx-auto">
                        Uzman ekibimiz sizin için en iyi çözümleri üretmeye hazır. Hemen iletişime geçin!
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-black text-white px-8 py-4 rounded-lg font-bold hover:bg-gray-900 transition-colors"
                    >
                        İletişime Geçin
                    </a>
                </div>
            </div>
        </div>
    );
}
