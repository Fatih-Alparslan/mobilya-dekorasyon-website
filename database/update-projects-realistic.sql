-- Eski projeleri tamamen sil
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE project_images;
TRUNCATE TABLE projects;
SET FOREIGN_KEY_CHECKS = 1;

-- Auto increment'i sıfırla
ALTER TABLE projects AUTO_INCREMENT = 1;
ALTER TABLE project_images AUTO_INCREMENT = 1;

-- Gerçekçi projeler ekle
INSERT INTO projects (title, category, category_id, description, date) VALUES
-- Villa Projeleri
('Modern Deniz Manzaralı Villa', 'Villa Tasarımı', 1, 'Bodrum''da deniz manzaralı 450m² lüks villa projesi. Açık mutfak konsepti, geniş teraslar ve sonsuzluk havuzu ile modern yaşam alanı tasarımı. Doğal taş ve ahşap detaylarla zenginleştirilmiş minimalist iç mekan düzenlemesi.', '2024-01-15'),

('Bağ Evi Villa Dekorasyonu', 'Villa Tasarımı', 1, 'Alaçatı''da 300m² bağ evi konseptli villa iç mimarlık projesi. Rustik ve modern tasarımın birleşimi, özel tasarım mobilyalar ve yerel taş kullanımı. Geniş bahçe düzenlemesi ve dış mekan oturma alanları.', '2024-02-20'),

('Şehir İçi Müstakil Villa', 'Villa Tasarımı', 1, 'İstanbul Zekeriyaköy''de 380m² müstakil villa tam dekorasyon projesi. Smart home sistemi, özel aydınlatma tasarımı ve lüks malzeme seçimleri. Kapalı havuz, spa ve fitness alanı tasarımı dahil.', '2023-12-10'),

-- Ofis Projeleri
('Teknoloji Şirketi Ofisi', 'Ofis Dekorasyonu', 2, 'Maslak''ta 600m² teknoloji şirketi ofis tasarımı. Açık çalışma alanları, toplantı odaları ve dinlenme bölümleri. Ergonomik mobilyalar, akustik paneller ve modern aydınlatma sistemleri ile verimlilik odaklı tasarım.', '2024-03-05'),

('Hukuk Bürosu İç Mimarlık', 'Ofis Dekorasyonu', 2, 'Nişantaşı''nda 250m² prestijli hukuk bürosu dekorasyonu. Klasik ve modern çizgilerin birleşimi, özel yapım ahşap mobilyalar ve şık detaylar. Müşteri kabul salonu ve özel toplantı odaları tasarımı.', '2023-11-25'),

-- İç Mimarlık Projeleri
('Loft Daire Dönüşümü', 'İç Mimarlık', 3, 'Karaköy''de 180m² loft daire tam dönüşüm projesi. Endüstriyel tarz, yüksek tavanlar ve geniş pencereler. Açık plan yaşam alanı, özel tasarım mutfak ve çalışma köşesi. Metal ve ahşap detaylarla zenginleştirilmiş tasarım.', '2024-01-30'),

('Cafe & Restaurant Tasarımı', 'İç Mimarlık', 3, 'Bebek''te 200m² cafe & restaurant iç mekan projesi. Bohem tarz dekorasyon, özel aydınlatma ve rahat oturma düzeni. Açık mutfak konsepti ve Instagram-friendly köşeler.', '2023-10-18'),

-- Mobilya Projeleri
('Özel Tasarım Yatak Odası', 'Mobilya Üretimi', 4, 'Tam ölçü yatak odası takımı üretimi. Ceviz kaplama gardrop, şifonyer, başucu ve komodin. Gizli aydınlatma sistemleri ve özel aksesuar detayları. Modern ve fonksiyonel tasarım.', '2024-02-14'),

('Mutfak Dolabı Projesi', 'Mobilya Üretimi', 4, 'Amerikan mutfak konsepti için özel tasarım dolap sistemi. Yüksek kalite MDF lake, soft-close sistemler ve ergonomik iç düzenleme. Ada mutfak ve bar tezgahı dahil 25m² dolap üretimi.', '2023-12-28');

-- Proje resimlerini ekle
INSERT INTO project_images (project_id, image_url, display_order) VALUES
-- Modern Deniz Manzaralı Villa
(1, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 1),
(1, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 2),
(1, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 3),

-- Bağ Evi Villa
(2, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 1),
(2, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 2),

-- Şehir İçi Villa
(3, 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800', 1),
(3, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 2),
(3, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', 3),

-- Teknoloji Şirketi Ofisi
(4, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 1),
(4, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', 2),
(4, 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800', 3),

-- Hukuk Bürosu
(5, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', 1),
(5, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 2),

-- Loft Daire
(6, 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800', 1),
(6, 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800', 2),
(6, 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=800', 3),

-- Cafe & Restaurant
(7, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 1),
(7, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 2),
(7, 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', 3),

-- Yatak Odası
(8, 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800', 1),
(8, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800', 2),

-- Mutfak Dolabı
(9, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800', 1),
(9, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 2),
(9, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800', 3);
