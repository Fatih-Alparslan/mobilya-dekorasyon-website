# 🪑 Mobilya Dekorasyon Web Sitesi

Modern, güvenli ve çok dilli mobilya dekorasyon şirketi web sitesi.

## ✨ Özellikler

### 🌐 Public Site
- **Çok Dilli**: Türkçe ve İngilizce dil desteği
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Proje Galerisi**: Kategorilere göre filtreleme ve sayfalama
- **İletişim Formu**: reCAPTCHA korumalı
- **WhatsApp Entegrasyonu**: Hızlı iletişim
- **Google Maps**: Konum gösterimi
- **SEO Optimizasyonu**: Arama motorları için optimize edilmiş

### 🔐 Admin Paneli
- **Güvenli Giriş**: Rate limiting, brute-force koruması ve audit logging
- **Kullanıcı Yönetimi (RBAC)**:
  - **Süper Yönetici**: Tüm sistem kontrolü, kullanıcı yönetimi (ekleme/silme/düzenleme)
  - **Yönetici**: İçerik yönetimi (kullanıcı yönetimi hariç tam erişim)
  - **Editör**: İçerik düzenleme (bazı kritik silme işlemleri kısıtlı olabilir)
  - **Hesap Durumu**: Kullanıcıları aktif/pasif yapabilme
- **Proje Yönetimi**: CRUD işlemleri, çoklu resim yükleme, öne çıkan görsel belirleme
- **Kategori Yönetimi**: Dinamik kategori sistemi
- **İletişim Yönetimi**: Form gönderilerini görüntüleme, okundu işaretleme
- **Hakkımızda & Hizmetler**: Sürükle-bırak sıralama özellikli içerik yönetimi
- **Sosyal Medya**: Platform linklerini yönetme
- **Logo & Site Ayarları**: Görsel yönetimi ve site başlıkları

## 🔒 Güvenlik Özellikleri

- ✅ **Rate Limiting**: Brute force saldırılarına karşı koruma
- ✅ **Audit Logging**: Tüm admin işlemlerinin kaydı
- ✅ **Secure Sessions**: Veritabanı tabanlı session yönetimi
- ✅ **HTTPS Enforcement**: Production'da zorunlu HTTPS
- ✅ **Input Sanitization**: XSS ve SQL injection koruması
- ✅ **Secure Cookies**: HttpOnly, Secure, SameSite flags

Detaylı güvenlik bilgisi için: [SECURITY.md](./SECURITY.md)

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Veritabanını Ayarlayın

MAMP veya XAMPP ile MySQL'i başlatın ve `.env.local` dosyası oluşturun:

```env
DB_HOST=localhost
DB_PORT=8889
DB_USER=root
DB_PASSWORD=root
DB_NAME=mobilyadekorasyon
```

### 3. Veritabanı Migration'larını Çalıştırın

```bash
# Ana schema
node run-migration.js

# Güvenlik tabloları
node run-security-migration.js

# Kategoriler
node run-category-migration.js

# Hakkımızda bölümleri
node run-about-migration.js

# Hizmetler
node run-services-migration.js

# İletişim bilgileri
node run-contact-migration.js

# Featured image desteği
node run-featured-migration.js

# Kullanıcı Yönetimi ve Rol Sistemi
# (Not: Bu adımda veritabanında 'users' tablosu güncellenir ve varsayılan Super Admin oluşturulur)
# database/user-management-schema.sql dosyasını import etmeniz gerekebilir veya migration scripti:
# (Manuel işlem gerekebilir, sql dosyasını kontrol edin)
```

### 4. Admin Kullanıcısı
Sistem ilk kurulumda varsayılan bir `super_admin` kullanıcısına ihtiyaç duyar.
Veritabanında `users` tablosunda manuel olarak veya seeds sql dosyası ile ilk kullanıcıyı oluşturun.
Şifreler `bcrypt` ile hashlenmelidir. Yardımcı script:

```bash
node update-admin-password.js
```

### 5. Development Server'ı Başlatın

```bash
npm run dev
```

Site: [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Proje Yapısı

```
mobilyadekorasyon/
├── app/                    # Next.js app directory
│   ├── (public)/          # Public sayfalar
│   ├── admin/             # Admin paneli
│   └── api/               # API routes
├── components/            # React bileşenleri
├── contexts/              # React contexts (dil)
├── database/              # SQL schema dosyaları
├── lib/                   # Yardımcı fonksiyonlar
│   ├── db.ts             # Veritabanı işlemleri
│   ├── security.ts       # Güvenlik fonksiyonları
│   └── dictionary.ts     # Çeviri sözlüğü
├── public/                # Statik dosyalar
└── translations/          # Dil dosyaları
```

## 🛠️ Teknolojiler

- **Framework**: Next.js 16 (App Router)
- **Database**: MySQL
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Security**: bcrypt, rate limiting
- **Date Handling**: date-fns
- **Captcha**: reCAPTCHA

## 📝 Production Checklist

Siteyi yayınlamadan önce:

- [ ] Güvenlik migration'ları çalıştırıldı
- [ ] Admin şifresi güçlü bir şifre ile değiştirildi
- [ ] HTTPS sertifikası kuruldu
- [ ] Environment variables production'a taşındı
- [ ] Veritabanı yedekleme sistemi kuruldu
- [ ] reCAPTCHA keys production için güncellendi
- [ ] Google Maps API key eklendi

## 🔧 Bakım

### Audit Log Temizleme

```sql
DELETE FROM admin_audit_log 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### Session Temizleme

```sql
DELETE FROM admin_sessions WHERE expires_at < NOW();
```

## 📞 Destek

Sorun yaşarsanız:
1. Console log'larını kontrol edin
2. Veritabanı bağlantısını kontrol edin
3. [SECURITY.md](./SECURITY.md) dosyasına bakın

---

**Versiyon**: 1.0.0  
**Son Güncelleme**: 4 Ocak 2026
