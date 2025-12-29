-- Hizmetler tablosu
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100) DEFAULT 'Wrench',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Örnek veriler
INSERT INTO services (title, description, icon, display_order, is_active) VALUES
('Villa Tasarımı', 'Özel yaşam alanları için modern ve lüks villa projeleri.', 'Home', 1, TRUE),
('Ofis Dekorasyonu', 'Verimlilik artıran, ergonomik ve şık ofis tasarımları.', 'Building2', 2, TRUE),
('İç Mimarlık', 'Mekan analizi ve konsept geliştirme ile bütüncü çözümler.', 'Wrench', 3, TRUE),
('Mobilya Üretimi', 'Mekana özel ölçü ve tasarım mobilya imalatı.', 'Sofa', 4, TRUE);
