-- Site ayarları tablosu
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  logo_text VARCHAR(255) NOT NULL DEFAULT 'MOBİLYADEKORASYON',
  logo_data MEDIUMBLOB,
  logo_mime_type VARCHAR(100),
  logo_file_size INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Varsayılan ayarları ekle
INSERT INTO site_settings (logo_text) VALUES ('MOBİLYADEKORASYON')
ON DUPLICATE KEY UPDATE logo_text = logo_text;
