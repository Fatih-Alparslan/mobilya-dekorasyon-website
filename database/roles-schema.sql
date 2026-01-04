-- Add role column to users table
ALTER TABLE users ADD COLUMN role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor' AFTER email;

-- Create permissions table for fine-grained control
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('super_admin', 'admin', 'editor') NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_role_permission (role, permission_name),
    FOREIGN KEY (permission_name) REFERENCES permissions(name) ON DELETE CASCADE
);

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
('manage_users', 'Kullanıcı ekleme, düzenleme, silme'),
('manage_projects', 'Proje ekleme, düzenleme, silme'),
('manage_categories', 'Kategori yönetimi'),
('manage_settings', 'Site ayarları yönetimi'),
('manage_content', 'İçerik düzenleme (hakkımızda, hizmetler)'),
('manage_contact', 'İletişim bilgileri yönetimi'),
('manage_social', 'Sosyal medya yönetimi'),
('view_analytics', 'İstatistikleri görüntüleme'),
('delete_projects', 'Proje silme yetkisi'),
('publish_projects', 'Proje yayınlama yetkisi')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Assign permissions to roles
-- Super Admin: All permissions
INSERT INTO role_permissions (role, permission_name) VALUES
('super_admin', 'manage_users'),
('super_admin', 'manage_projects'),
('super_admin', 'manage_categories'),
('super_admin', 'manage_settings'),
('super_admin', 'manage_content'),
('super_admin', 'manage_contact'),
('super_admin', 'manage_social'),
('super_admin', 'view_analytics'),
('super_admin', 'delete_projects'),
('super_admin', 'publish_projects')
ON DUPLICATE KEY UPDATE role=VALUES(role);

-- Admin: Most permissions except user management
INSERT INTO role_permissions (role, permission_name) VALUES
('admin', 'manage_projects'),
('admin', 'manage_categories'),
('admin', 'manage_content'),
('admin', 'manage_contact'),
('admin', 'manage_social'),
('admin', 'view_analytics'),
('admin', 'delete_projects'),
('admin', 'publish_projects')
ON DUPLICATE KEY UPDATE role=VALUES(role);

-- Editor: Basic content management
INSERT INTO role_permissions (role, permission_name) VALUES
('editor', 'manage_projects'),
('editor', 'manage_content'),
('editor', 'publish_projects')
ON DUPLICATE KEY UPDATE role=VALUES(role);
