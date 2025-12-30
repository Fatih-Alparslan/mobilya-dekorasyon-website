export const tr = {
    // Navigation
    nav: {
        home: 'ANASAYFA',
        projects: 'PROJELER',
        about: 'HAKKIMIZDA',
        contact: 'İLETİŞİM',
    },

    // Home Page
    home: {
        hero: {
            title: 'Hayallerinizdeki Mekanları Yaratıyoruz',
            subtitle: 'Modern ve şık mobilya çözümleriyle yaşam alanlarınızı dönüştürüyoruz',
            cta: 'Projelerimizi İnceleyin',
        },
        features: {
            title: 'Neden Bizi Seçmelisiniz?',
            quality: {
                title: 'Kaliteli İşçilik',
                description: 'Her detayda mükemmellik için özenle çalışıyoruz',
            },
            design: {
                title: 'Modern Tasarım',
                description: 'Çağdaş ve şık tasarımlarla mekanlarınızı güzelleştiriyoruz',
            },
            service: {
                title: 'Profesyonel Hizmet',
                description: 'Baştan sona profesyonel destek ve danışmanlık',
            },
        },
    },

    // Projects Page
    projects: {
        title: 'Projelerimiz',
        subtitle: 'Tamamladığımız başarılı projelerimize göz atın',
        viewDetails: 'Detayları Gör',
        noProjects: 'Henüz proje eklenmemiş',
        category: 'Kategori',
        date: 'Tarih',
    },

    // Contact Page
    contact: {
        title: 'İletişim',
        subtitle: 'Bizimle iletişime geçin',
        form: {
            name: 'Adınız',
            email: 'E-posta',
            phone: 'Telefon',
            message: 'Mesajınız',
            submit: 'Gönder',
            sending: 'Gönderiliyor...',
            success: 'Mesajınız başarıyla gönderildi!',
            error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        },
        info: {
            address: 'Adres',
            phone: 'Telefon',
            email: 'E-posta',
            hours: 'Çalışma Saatleri',
            weekdays: 'Pazartesi - Cuma: 09:00 - 18:00',
            weekend: 'Cumartesi: 10:00 - 16:00',
        },
    },

    // Admin Panel
    admin: {
        title: 'Yönetim Paneli',
        addProject: 'Yeni Proje Ekle',
        editProject: 'Projeyi Düzenle',
        deleteProject: 'Projeyi Sil',
        form: {
            titleTr: 'Başlık (Türkçe)',
            titleEn: 'Başlık (İngilizce)',
            descriptionTr: 'Açıklama (Türkçe)',
            descriptionEn: 'Açıklama (İngilizce)',
            category: 'Kategori',
            images: 'Görseller',
            save: 'Kaydet',
            cancel: 'İptal',
            saving: 'Kaydediliyor...',
        },
    },

    // Footer
    footer: {
        company: '212 Huzur Mobilya',
        rights: 'Tüm hakları saklıdır.',
        followUs: 'Bizi Takip Edin',
        quickAccess: 'Hızlı Erişim',
        services: 'Hizmetler',
        contact: 'İletişim',
        links: {
            home: 'Anasayfa',
            projects: 'Projeler',
            about: 'Hakkımızda',
            contactPage: 'İletişim',
        },
        description: 'Kalite ve estetiği buluşturarak yaşam alanlarınıza değer katıyoruz. Modern tasarımlar ve profesyonel uygulamalar.',
    },

    // Common
    common: {
        loading: 'Yükleniyor...',
        error: 'Bir hata oluştu',
        noImage: 'Resim Yok',
        readMore: 'Devamını Oku',
        close: 'Kapat',
    },
};

export type TranslationKeys = typeof tr;
