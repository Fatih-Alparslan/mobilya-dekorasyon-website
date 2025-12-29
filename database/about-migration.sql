-- Hakkımızda bölümleri tablosu
CREATE TABLE IF NOT EXISTS about_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Örnek veriler
INSERT INTO about_sections (title, content, display_order, is_active) VALUES
('Biz Kimiz?', '2010 yılından bu yana mobilya ve dekorasyon sektöründe faaliyet gösteren firmamız, yaşam alanlarınızı hayallerinizdeki mekanlara dönüştürüyor. Uzman ekibimiz ve kaliteli malzemelerimizle, her projede mükemmeliyeti hedefliyoruz.\n\nMüşteri memnuniyetini ön planda tutarak, modern ve fonksiyonel tasarımlar sunuyoruz. Her proje bizim için özel ve benzersizdir.', 1, TRUE),

('Vizyonumuz', 'Türkiye''nin önde gelen mobilya ve dekorasyon markası olmak, müşterilerimize en iyi hizmeti sunarak sektörde fark yaratmak.\n\nYenilikçi tasarımlar ve sürdürülebilir çözümlerle geleceği şekillendirmek, her projede kalite standartlarını yükseltmek.', 2, TRUE),

('Misyonumuz', 'Müşteri memnuniyetini ön planda tutarak, kaliteli, estetik ve fonksiyonel çözümler sunmak. Her projede özgün tasarımlar ve kusursuz işçilikle değer katmak.\n\nSektördeki deneyimimiz ve uzman kadromuzla, hayallerinizdeki mekanları gerçeğe dönüştürüyoruz.', 3, TRUE),

('Neden Bizi Seçmelisiniz?', '✓ 10+ yıllık sektör deneyimi\n✓ Uzman tasarım ekibi\n✓ Kaliteli malzeme kullanımı\n✓ Zamanında teslimat\n✓ Müşteri odaklı hizmet\n✓ Rekabetçi fiyatlar\n✓ Satış sonrası destek\n\nHer projede mükemmellik için çalışıyoruz.', 4, TRUE);
