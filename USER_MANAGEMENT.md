# 🔐 Kullanıcı Yönetimi ve Şifre Sıfırlama Dokümantasyonu

## ✨ Özellikler

### 1. Kullanıcı Yönetimi
- ✅ Kullanıcı listesi görüntüleme
- ✅ Yeni kullanıcı ekleme
- ✅ Kullanıcı düzenleme
- ✅ Kullanıcı silme
- ✅ Şifre değiştirme
- ✅ Aktif/Pasif durum yönetimi
- ✅ Son giriş zamanı takibi

### 2. Şifre Sıfırlama
- ✅ "Şifremi Unuttum" özelliği
- ✅ Email ile token gönderme
- ✅ Token doğrulama
- ✅ Yeni şifre belirleme
- ✅ Otomatik token süresi dolma (1 saat)

## 📁 Dosya Yapısı

```
app/
├── admin/
│   ├── users/
│   │   ├── page.tsx                    # Kullanıcı listesi
│   │   ├── actions.ts                  # Server actions
│   │   ├── DeleteUserButton.tsx        # Silme butonu
│   │   ├── new/
│   │   │   └── page.tsx               # Yeni kullanıcı
│   │   └── [id]/
│   │       ├── page.tsx               # Kullanıcı düzenle
│   │       ├── EditUserForm.tsx       # Düzenleme formu
│   │       └── change-password/
│   │           ├── page.tsx           # Şifre değiştir
│   │           └── actions.ts         # Şifre actions
│   ├── forgot-password/
│   │   └── page.tsx                   # Şifremi unuttum
│   └── reset-password/
│       └── page.tsx                   # Şifre sıfırlama
└── api/
    └── auth/
        ├── forgot-password/
        │   └── route.ts               # Şifre sıfırlama talebi
        └── reset-password/
            └── route.ts               # Şifre sıfırlama

database/
├── user-management-schema.sql         # Veritabanı şeması
└── run-user-management-migration.js   # Migration script
```

## 🗄️ Veritabanı Tabloları

### `users` (Güncellenmiş)
```sql
- id (INT, PRIMARY KEY)
- username (VARCHAR)
- email (VARCHAR)
- password_hash (VARCHAR)
- is_active (BOOLEAN)           # Yeni
- last_login (TIMESTAMP)        # Yeni
- created_by (INT)              # Yeni
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)        # Yeni
```

### `password_reset_tokens` (Yeni)
```sql
- id (INT, PRIMARY KEY)
- user_id (INT, FOREIGN KEY)
- token (VARCHAR, UNIQUE)
- expires_at (TIMESTAMP)
- used (BOOLEAN)
- created_at (TIMESTAMP)
```

## 🚀 Kullanım

### Kullanıcı Yönetimi

#### Kullanıcı Listesi
```
http://localhost:3000/admin/users
```
- Tüm kullanıcıları görüntüle
- Aktif/Pasif durum
- Son giriş zamanı
- Düzenle/Sil işlemleri

#### Yeni Kullanıcı Ekle
```
http://localhost:3000/admin/users/new
```
- Kullanıcı adı (zorunlu)
- Email (zorunlu)
- Şifre (min 6 karakter)

#### Kullanıcı Düzenle
```
http://localhost:3000/admin/users/[id]
```
- Kullanıcı adı değiştir
- Email değiştir
- Aktif/Pasif durumu değiştir

#### Şifre Değiştir
```
http://localhost:3000/admin/users/[id]/change-password
```
- Yeni şifre (min 6 karakter)
- Şifre tekrarı

### Şifre Sıfırlama

#### 1. Şifremi Unuttum
```
http://localhost:3000/admin/forgot-password
```
- Email adresi gir
- Token console'da görünecek (email entegrasyonu yapılmadı)

#### 2. Şifre Sıfırlama
```
http://localhost:3000/admin/reset-password?token=XXXXXX
```
- Token ile şifre sıfırlama sayfası
- Yeni şifre belirle
- Otomatik login sayfasına yönlendirme

## 🔧 API Endpoints

### POST `/api/auth/forgot-password`
Şifre sıfırlama talebi oluşturur.

**Request:**
```json
{
  "email": "admin@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Eğer bu email adresi sistemde kayıtlıysa, şifre sıfırlama linki gönderildi."
}
```

**Console Output:**
```
Password reset token for admin : abc123...
Reset URL: http://localhost:3000/admin/reset-password?token=abc123...
```

### POST `/api/auth/reset-password`
Şifreyi sıfırlar.

**Request:**
```json
{
  "token": "abc123...",
  "newPassword": "yenisifre123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Şifreniz başarıyla değiştirildi. Giriş yapabilirsiniz."
}
```

## 📊 Database Fonksiyonları

### Kullanıcı İşlemleri
```typescript
// Tüm kullanıcıları getir
const users = await getAllUsers();

// ID'ye göre kullanıcı
const user = await getUserById(1);

// Email'e göre kullanıcı
const user = await getUserByEmail('admin@example.com');

// Yeni kullanıcı oluştur
const userId = await createUser({
  username: 'newadmin',
  email: 'newadmin@example.com',
  password: 'password123',
  created_by: 1
});

// Kullanıcı güncelle
await updateUser(1, {
  username: 'updatedadmin',
  email: 'updated@example.com',
  is_active: true
});

// Şifre değiştir
await updateUserPassword(1, 'newpassword123');

// Kullanıcı sil
await deleteUser(1);

// Son giriş zamanını güncelle
await updateLastLogin(1);
```

### Şifre Sıfırlama İşlemleri
```typescript
// Reset token oluştur
const token = await createPasswordResetToken(userId);

// Token'ı doğrula
const resetToken = await getPasswordResetToken(token);

// Token'ı kullanılmış olarak işaretle
await markTokenAsUsed(token);

// Süresi dolmuş token'ları temizle
await cleanupExpiredTokens();
```

## 🔒 Güvenlik Özellikleri

### Email Enumeration Koruması
Şifre sıfırlama talebinde, email sistemde olsa da olmasa da aynı mesaj döner:
```
"Eğer bu email adresi sistemde kayıtlıysa, şifre sıfırlama linki gönderildi."
```

### Token Güvenliği
- ✅ Rastgele 64 karakter token
- ✅ 1 saat süre sonu
- ✅ Tek kullanımlık (used flag)
- ✅ Veritabanında saklanır

### Audit Logging
Tüm işlemler loglanır:
- `PASSWORD_RESET_REQUESTED`
- `PASSWORD_RESET_FAILED`
- `PASSWORD_RESET_SUCCESS`
- `PASSWORD_RESET_INVALID_TOKEN`
- `PASSWORD_RESET_ERROR`

## 📧 Email Entegrasyonu (TODO)

Şu anda token console'da görünüyor. Production için email gönderimi eklenecek:

```typescript
// TODO: Email gönderimi
// await sendPasswordResetEmail(user.email, token);
```

Önerilen email servisleri:
- SendGrid
- AWS SES
- Mailgun
- Resend

## 🎯 Kullanım Senaryoları

### Senaryo 1: Yeni Admin Ekleme
1. `/admin/users` sayfasına git
2. "Yeni Kullanıcı" butonuna tıkla
3. Bilgileri doldur
4. "Kullanıcı Oluştur"

### Senaryo 2: Kullanıcı Pasif Yapma
1. `/admin/users` sayfasına git
2. Kullanıcının "Düzenle" butonuna tıkla
3. "Aktif Kullanıcı" checkbox'ını kaldır
4. "Kaydet"

### Senaryo 3: Şifre Sıfırlama
1. Login sayfasında "Şifremi unuttum" linkine tıkla
2. Email adresini gir
3. Console'dan token'ı kopyala
4. `/admin/reset-password?token=XXXXX` adresine git
5. Yeni şifre belirle

## 🐛 Sorun Giderme

### Token Bulunamıyor
- Token'ın süresi dolmuş olabilir (1 saat)
- Token zaten kullanılmış olabilir
- Yeni token talep edin

### Email Gelmiyor
- Email entegrasyonu henüz yapılmadı
- Token console'da görünüyor
- Production'da email servisi eklenecek

### Kullanıcı Silinemiyor
- Kullanıcının aktif session'ları olabilir
- Foreign key constraint'ler kontrol edilmeli

## 📝 Notlar

- ⚠️ Email gönderimi henüz eklenmedi (console'da görünüyor)
- ✅ Tüm işlemler audit log'a kaydediliyor
- ✅ Token'lar 1 saat geçerli
- ✅ Şifreler bcrypt ile hash'leniyor
- ✅ Rate limiting aktif

---

**Son Güncelleme**: 4 Ocak 2026  
**Versiyon**: 2.0.0
