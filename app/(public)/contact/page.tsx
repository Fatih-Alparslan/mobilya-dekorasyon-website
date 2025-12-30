'use client';

import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ContactInfo {
    phone: string;
    email: string;
    address: string;
    working_hours: string;
}

export default function ContactPage() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    // Google test keys (for development)
    const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

    useEffect(() => {
        // İletişim bilgilerini fetch et
        fetch('/api/contact/info')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setContactInfo(data.data);
                }
            })
            .catch(err => console.error('Contact info fetch error:', err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate reCAPTCHA
        if (!recaptchaToken) {
            setError('Lütfen robot olmadığınızı doğrulayın');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, recaptchaToken })
            });

            const data = await res.json();

            if (data.success) {
                setSubmitted(true);
                setFormData({ name: '', phone: '', email: '', message: '' });
                setRecaptchaToken(null);
                recaptchaRef.current?.reset();
            } else {
                setError(data.message || 'Bir hata oluştu');
            }
        } catch (err) {
            setError('Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyiniz.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-black pt-32 pb-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">İletişim</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Projeleriniz için teklif almak veya sorularınız için bizimle iletişime geçebilirsiniz.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {/* Info Cards */}
                    <div className="space-y-6">
                        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                            <Phone className="text-yellow-500 mb-4" size={32} />
                            <h3 className="text-xl font-bold text-white mb-2">Telefon</h3>
                            <p className="text-gray-400">{contactInfo?.working_hours || 'Yükleniyor...'}</p>
                            <a
                                href={`tel:${contactInfo?.phone?.replace(/\s/g, '')}`}
                                className="text-white font-bold text-lg mt-2 block hover:text-yellow-500"
                            >
                                {contactInfo?.phone || '0555 555 55 55'}
                            </a>
                        </div>
                        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                            <MessageCircle className="text-yellow-500 mb-4" size={32} />
                            <h3 className="text-xl font-bold text-white mb-2">WhatsApp</h3>
                            <p className="text-gray-400">Hızlı iletişim için</p>
                            <a
                                href={`https://wa.me/${contactInfo?.phone?.replace(/\s/g, '').replace(/^0/, '90')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                            >
                                WhatsApp'ta Yaz
                            </a>
                        </div>
                        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                            <Mail className="text-yellow-500 mb-4" size={32} />
                            <h3 className="text-xl font-bold text-white mb-2">E-posta</h3>
                            <p className="text-gray-400">Her türlü sorunuz için</p>
                            <a
                                href={`mailto:${contactInfo?.email}`}
                                className="text-white font-bold text-lg mt-2 block hover:text-yellow-500 break-all"
                            >
                                {contactInfo?.email || 'info@mobilyadekorasyon.com'}
                            </a>
                        </div>
                        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                            <MapPin className="text-yellow-500 mb-4" size={32} />
                            <h3 className="text-xl font-bold text-white mb-2">Adres</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {contactInfo?.address || 'Cadde Sokak No:123, Kadıköy, İstanbul'}
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        {submitted ? (
                            <div className="bg-gray-900 p-8 md:p-12 rounded-xl border border-gray-800 text-center">
                                <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
                                <h3 className="text-2xl font-bold text-white mb-4">Mesajınız Gönderildi!</h3>
                                <p className="text-gray-400 mb-8">
                                    Mesajınız için teşekkür ederiz. En kısa sürede size dönüş yapacağız.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                                >
                                    Yeni Mesaj Gönder
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 md:p-12 rounded-xl border border-gray-800 space-y-6">
                                {error && (
                                    <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Adınız Soyadınız *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-500 disabled:opacity-50"
                                            placeholder="İsim Soyisim"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Telefon Numaranız *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-500 disabled:opacity-50"
                                            placeholder="0555 555 55 55"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        E-posta *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-500 disabled:opacity-50"
                                        placeholder="ornek@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Mesajınız *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        rows={5}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg py-3 px-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-500 disabled:opacity-50"
                                        placeholder="Projenizden bahsedin..."
                                    />
                                </div>

                                {/* reCAPTCHA */}
                                <div className="flex justify-center">
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={RECAPTCHA_SITE_KEY}
                                        onChange={(token) => setRecaptchaToken(token)}
                                        onExpired={() => setRecaptchaToken(null)}
                                        theme="dark"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Gönderiliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Gönder
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
