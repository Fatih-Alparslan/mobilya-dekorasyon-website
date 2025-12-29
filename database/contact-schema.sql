-- İletişim bilgileri tablosu (admin tarafından düzenlenebilir)
CREATE TABLE IF NOT EXISTS contact_info (
  id INT PRIMARY KEY DEFAULT 1,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  working_hours VARCHAR(255) NOT NULL,
  map_lat DECIMAL(10, 8),
  map_lng DECIMAL(11, 8),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kullanıcı mesajları tablosu
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at DESC),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayılan iletişim bilgilerini ekle
INSERT INTO contact_info (id, phone, email, address, working_hours) 
VALUES (1, '0555 555 55 55', 'info@mobilyadekorasyon.com', 'Cadde Sokak No:123, Kadıköy, İstanbul', 'Pazartesi - Cumartesi: 09:00 - 19:00')
ON DUPLICATE KEY UPDATE id = id;
