-- Kategori Yönetim Sistemi - Database Migration

-- 1. Categories tablosu oluştur
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Mevcut kategorileri categories tablosuna aktar
INSERT INTO categories (name, slug, display_order)
SELECT DISTINCT 
  category as name,
  LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(category, ' ', '-'), 'ı', 'i'), 'ğ', 'g'), 'ü', 'u'), 'ş', 's')) as slug,
  0 as display_order
FROM projects
WHERE category IS NOT NULL AND category != ''
ORDER BY category;

-- 3. Projects tablosuna category_id kolonu ekle
ALTER TABLE projects ADD COLUMN category_id INT NULL AFTER category;

-- 4. Mevcut category değerlerini category_id'ye map et
UPDATE projects p
INNER JOIN categories c ON p.category = c.name
SET p.category_id = c.id;

-- 5. Foreign key constraint ekle
ALTER TABLE projects
ADD CONSTRAINT fk_project_category
FOREIGN KEY (category_id) REFERENCES categories(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- 6. Eski category kolonunu sil (opsiyonel - yedek olarak tutabilirsiniz)
-- ALTER TABLE projects DROP COLUMN category;

-- Kontrol sorguları
SELECT 'Categories created:' as info, COUNT(*) as count FROM categories;
SELECT 'Projects with category_id:' as info, COUNT(*) as count FROM projects WHERE category_id IS NOT NULL;
