-- Veritabanını oluştur
CREATE DATABASE IF NOT EXISTS mobilyadekorasyon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Veritabanını seç
USE mobilyadekorasyon;

-- Projeler tablosu
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Proje resimleri tablosu
CREATE TABLE IF NOT EXISTS project_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mevcut JSON verilerini ekle
INSERT INTO projects (id, title, category, description, date) VALUES
('2', 'Ofis Renovasyonu2', 'Mağaza', 'Açık ofis konseptine uygun, çalışan verimliliğini artıran ergonomik tasarım.2', '2025-12-20'),
('3', 'Kafe İç Mimari', 'Ticari', 'Sıcak ve samimi bir atmosfer yaratan, endüstriyel tarzda kafe tasarımı.', '2023-12-10');

-- Proje resimlerini ekle
INSERT INTO project_images (project_id, image_url, display_order) VALUES
('2', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2301', 0),
('2', '/uploads/1767021905634-pxgogb.png', 1),
('2', '/uploads/1767021905643-whwvri.png', 2),
('2', '/uploads/1767022275803-22xrep.png', 3),
('3', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2547', 0);
