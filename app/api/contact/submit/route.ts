import { NextResponse } from 'next/server';
import { submitContactForm } from '@/lib/db';

// Telefon numarasını formatla (0XXX XXX XX XX)
function formatPhoneNumber(phone: string): string {
    // Sadece rakamları al
    const digits = phone.replace(/\D/g, '');

    // Türk telefon formatı (0XXX XXX XX XX)
    if (digits.length === 11 && digits.startsWith('0')) {
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
    }

    // 10 haneli ise başına 0 ekle
    if (digits.length === 10) {
        return `0${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
    }

    // Formatlanamıyorsa olduğu gibi döndür
    return phone;
}

// POST - Kullanıcı mesajını kaydet
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, email, message } = body;

        // Validasyon
        if (!name || !phone || !email || !message) {
            return NextResponse.json({
                success: false,
                message: 'Tüm alanları doldurunuz'
            }, { status: 400 });
        }

        // Email formatı kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                success: false,
                message: 'Geçerli bir e-posta adresi giriniz'
            }, { status: 400 });
        }

        // Telefon formatı kontrolü (basit)
        const phoneRegex = /^[0-9\s\-\+\(\)]{10,20}$/;
        if (!phoneRegex.test(phone)) {
            return NextResponse.json({
                success: false,
                message: 'Geçerli bir telefon numarası giriniz'
            }, { status: 400 });
        }

        // Telefonu formatla
        const formattedPhone = formatPhoneNumber(phone.trim());

        // Mesajı kaydet
        const submissionId = await submitContactForm({
            name: name.trim(),
            phone: formattedPhone,
            email: email.trim(),
            message: message.trim()
        });

        return NextResponse.json({
            success: true,
            message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
            submissionId
        });
    } catch (error) {
        console.error('Submit contact form error:', error);
        return NextResponse.json({
            success: false,
            message: 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyiniz.'
        }, { status: 500 });
    }
}
