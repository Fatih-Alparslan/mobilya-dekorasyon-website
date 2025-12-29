-- Eski projeleri sil
DELETE FROM project_images;
DELETE FROM projects;

-- Auto increment sıfırla
ALTER TABLE projects AUTO_INCREMENT = 1;
ALTER TABLE project_images AUTO_INCREMENT = 1;

-- Gerçekçi projeler ekle
INSERT INTO projects (title, category, category_id, description, date) VALUES
('Modern Deniz Manzaralı Villa', 'Villa Tasarımı', 1, 'Bodrum''da deniz manzaralı 450m² lüks villa projesi. Açık mutfak konsepti, geniş teraslar ve sonsuzluk havuzu ile modern yaşam alanı tasarımı.', '2024-01-15'),
('Bağ Evi Villa Dekorasyonu', 'Villa Tasarımı', 1, 'Alaçatı''da 300m² bağ evi konseptli villa iç mimarlık projesi. Rustik ve modern tasarımın birleşimi, özel tasarım mobilyalar.', '2024-02-20'),
('Şehir İçi Müstakil Villa', 'Villa Tasarımı', 1, 'İstanbul Zekeriyaköy''de 380m² müstakil villa tam dekorasyon projesi. Smart home sistemi ve lüks malzeme seçimleri.', '2023-12-10'),
('Teknoloji Şirketi Ofisi', 'Ofis Dekorasyonu', 2, 'Maslak''ta 600m² teknoloji şirketi ofis tasarımı. Açık çalışma alanları, toplantı odaları ve dinlenme bölümleri.', '2024-03-05'),
('Hukuk Bürosu İç Mimarlık', 'Ofis Dekorasyonu', 2, 'Nişantaşı''nda 250m² prestijli hukuk bürosu dekorasyonu. Klasik ve modern çizgilerin birleşimi.', '2023-11-25'),
('Loft Daire Dönüşümü', 'İç Mimarlık', 3, 'Karaköy''de 180m² loft daire tam dönüşüm projesi. Endüstriyel tarz, yüksek tavanlar ve geniş pencereler.', '2024-01-30'),
('Cafe & Restaurant Tasarımı', 'İç Mimarlık', 3, 'Bebek''te 200m² cafe & restaurant iç mekan projesi. Bohem tarz dekorasyon ve özel aydınlatma.', '2023-10-18'),
('Özel Tasarım Yatak Odası', 'Mobilya Üretimi', 4, 'Tam ölçü yatak odası takımı üretimi. Ceviz kaplama gardrop, şifonyer, başucu ve komodin.', '2024-02-14'),
('Mutfak Dolabı Projesi', 'Mobilya Üretimi', 4, 'Amerikan mutfak konsepti için özel tasarım dolap sistemi. Yüksek kalite MDF lake.', '2023-12-28');
