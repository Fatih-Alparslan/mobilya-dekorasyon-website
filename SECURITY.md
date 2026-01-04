# 🔐 Admin Paneli Güvenlik Özellikleri

Bu belge, mobilya dekorasyon web sitesinin admin paneli için uygulanan güvenlik özelliklerini açıklar.

## ✨ Güvenlik Özellikleri

### 1. **Rate Limiting (Hız Sınırlama)**
- ✅ IP bazlı giriş denemesi sınırlaması
- ✅ Varsayılan: 15 dakikada 5 deneme
- ✅ Aşıldığında: 15 dakika otomatik engelleme
- ✅ Başarılı girişte otomatik sıfırlama

### 2. **Güvenli Session Yönetimi**
- ✅ Veritabanı tabanlı session takibi
- ✅ Kriptografik güvenli token'lar (SHA-256)
- ✅ Session timeout: 4 saat (ayarlanabilir)
- ✅ Otomatik session temizleme
- ✅ IP ve User-Agent takibi

### 3. **Audit Logging (Denetim Kayıtları)**
- ✅ Tüm giriş denemeleri kaydedilir
- ✅ Başarılı/başarısız girişler
- ✅ IP adresi ve tarayıcı bilgisi
- ✅ Logout işlemleri
- ✅ Zaman damgası

### 4. **HTTPS Zorlaması**
- ✅ Production ortamında HTTPS kontrolü
- ✅ HTTP bağlantıları reddedilir
- ✅ Secure cookie flag'leri

### 5. **Input Sanitization**
- ✅ XSS koruması
- ✅ SQL injection koruması (prepared statements)
- ✅ Kullanıcı girdisi temizleme

### 6. **Cookie Güvenliği**
- ✅ HttpOnly flag (JavaScript erişimi yok)
- ✅ Secure flag (sadece HTTPS)
- ✅ SameSite: Strict (CSRF koruması)
- ✅ Otomatik süre sonu

## 📊 Veritabanı Tabloları

### `admin_audit_log`
Tüm admin işlemlerini kaydeder:
- Giriş denemeleri
- Başarılı/başarısız girişler
- IP adresleri
- Zaman damgaları

### `admin_sessions`
Aktif session'ları yönetir:
- Session token'ları (hash'lenmiş)
- Süre sonu bilgisi
- Son aktivite zamanı
- IP ve User-Agent

### `admin_settings`
Güvenlik ayarlarını saklar:
- Session timeout süresi
- Maksimum giriş denemesi
- Engelleme süresi
- HTTPS zorunluluğu
- IP whitelist (opsiyonel)

## 🚀 Kurulum

### 1. Güvenlik Tablolarını Oluşturun

```bash
# Veritabanınızı başlatın (MAMP/XAMPP)
# Ardından migration'ı çalıştırın:
node run-security-migration.js
```

### 2. Varsayılan Admin Kullanıcısı

Eğer henüz admin kullanıcınız yoksa:

```bash
node update-admin-password.js
```

### 3. Güvenlik Ayarlarını Kontrol Edin

Varsayılan ayarlar:
- **Session Timeout**: 4 saat
- **Max Login Attempts**: 5 deneme
- **Lockout Duration**: 15 dakika
- **Require HTTPS**: Production'da aktif

## 🔧 Güvenlik Ayarlarını Değiştirme

Gelecekte admin paneline bir ayarlar sayfası eklenebilir. Şu an için doğrudan veritabanından değiştirilebilir:

```sql
UPDATE admin_settings 
SET 
  session_timeout_hours = 2,
  max_login_attempts = 3,
  lockout_duration_minutes = 30
WHERE id = 1;
```

## 📝 Audit Log'ları Görüntüleme

```sql
-- Son 50 giriş denemesi
SELECT * FROM admin_audit_log 
ORDER BY created_at DESC 
LIMIT 50;

-- Başarısız giriş denemeleri
SELECT * FROM admin_audit_log 
WHERE success = FALSE 
ORDER BY created_at DESC;

-- Belirli bir IP'den gelen denemeler
SELECT * FROM admin_audit_log 
WHERE ip_address = 'IP_ADRESI' 
ORDER BY created_at DESC;
```

## 🛡️ Production Checklist

Siteyi yayınlamadan önce:

- [ ] Güvenlik migration'ı çalıştırıldı mı?
- [ ] Admin şifresi güçlü bir şifre ile değiştirildi mi?
- [ ] HTTPS sertifikası kuruldu mu?
- [ ] Veritabanı şifresi güçlü mü?
- [ ] `.env.local` dosyası `.gitignore`'da mı?
- [ ] Production ortamında `NODE_ENV=production` ayarlandı mı?
- [ ] Veritabanı yedekleme sistemi kuruldu mu?

## 🔒 Güvenlik İpuçları

1. **Güçlü Şifre Kullanın**
   - En az 12 karakter
   - Büyük/küçük harf, rakam ve özel karakter

2. **IP Whitelist (Opsiyonel)**
   - Sadece belirli IP'lerden erişim için:
   ```sql
   UPDATE admin_settings 
   SET ip_whitelist = '123.456.789.0,987.654.321.0' 
   WHERE id = 1;
   ```

3. **Düzenli Audit Log Kontrolü**
   - Şüpheli aktiviteleri takip edin
   - Bilinmeyen IP'lerden giriş denemelerini kontrol edin

4. **Session Temizliği**
   - Eski session'lar otomatik temizlenir
   - Manuel temizlik için:
   ```sql
   DELETE FROM admin_sessions WHERE expires_at < NOW();
   ```

## 🆘 Sorun Giderme

### "Çok fazla başarısız giriş denemesi" Hatası

Eğer kendinizi kilitlediyseniz:

```sql
-- Rate limit'i manuel olarak sıfırlayamazsınız (in-memory)
-- Ancak 15 dakika bekleyebilir veya sunucuyu yeniden başlatabilirsiniz
```

### Session Sürekli Sona Eriyor

Session timeout'u artırın:

```sql
UPDATE admin_settings 
SET session_timeout_hours = 8 
WHERE id = 1;
```

### Audit Log'ları Temizleme

Eski kayıtları silmek için:

```sql
-- 30 günden eski kayıtları sil
DELETE FROM admin_audit_log 
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

## 📞 Destek

Güvenlik ile ilgili sorularınız için:
- Audit log'ları kontrol edin
- Veritabanı bağlantısını kontrol edin
- Console log'larını inceleyin

---

**Son Güncelleme**: 4 Ocak 2026
**Güvenlik Seviyesi**: Production-Ready ✅
