import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export interface Project {
  id: string;
  title: string;
  category: string;
  category_id?: number;
  description: string;
  imageUrls: string[];
  date: string;
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  email: string | null;
  created_at: Date;
}

export interface SiteSettings {
  id: number;
  logo_text: string;
  logo_data: Buffer | null;
  logo_mime_type: string | null;
  logo_file_size: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  map_lat: number | null;
  map_lng: number | null;
  updated_at: Date;
}

export interface ContactSubmission {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface AboutSection {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}


// MySQL bağlantı havuzu oluştur
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '8889'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'mobilyadekorasyon',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export pool for use in other modules
export { pool };

// ============ USER FUNCTIONS ============

export async function getUserByUsername(username: string): Promise<User | null> {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, 10);
}

// ============ PROJECT FUNCTIONS ============

export async function getProjects(): Promise<Project[]> {
  const [rows] = await pool.query(`
    SELECT 
      p.id, 
      p.title, 
      COALESCE(c.name, p.category, 'Kategorisiz') as category,
      p.category_id,
      p.description, 
      DATE_FORMAT(p.date, '%Y-%m-%d') as date,
      GROUP_CONCAT(
        CASE 
          WHEN pi.image_data IS NOT NULL THEN CONCAT('/api/images/', pi.id)
          WHEN pi.image_url IS NOT NULL THEN pi.image_url
          ELSE NULL
        END 
        ORDER BY pi.display_order SEPARATOR '|||'
      ) as images
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN project_images pi ON p.id = pi.project_id
    GROUP BY p.id, p.title, c.name, p.category, p.category_id, p.description, p.date
    ORDER BY p.created_at DESC
  `);

  return (rows as any[]).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    date: row.date,
    imageUrls: row.images ? row.images.split('|||') : [],
  }));
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const [rows] = await pool.query(
    `
    SELECT 
      p.id, 
      p.title, 
      COALESCE(c.name, p.category, 'Kategorisiz') as category,
      p.category_id,
      p.description, 
      DATE_FORMAT(p.date, '%Y-%m-%d') as date,
      GROUP_CONCAT(
        CASE 
          WHEN pi.image_data IS NOT NULL THEN CONCAT('/api/images/', pi.id)
          WHEN pi.image_url IS NOT NULL THEN pi.image_url
          ELSE NULL
        END 
        ORDER BY pi.display_order SEPARATOR '|||'
      ) as images
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN project_images pi ON p.id = pi.project_id
    WHERE p.id = ?
    GROUP BY p.id, p.title, c.name, p.category, p.category_id, p.description, p.date
  `,
    [id]
  );

  const project = (rows as any[])[0];
  if (!project) return undefined;

  return {
    id: project.id,
    title: project.title,
    category: project.category,
    category_id: project.category_id,
    description: project.description,
    date: project.date,
    imageUrls: project.images ? project.images.split('|||') : [],
  };
}

export async function addProject(project: Omit<Project, 'id'>): Promise<Project> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Projeyi ekle (ID otomatik oluşturulacak)
    const [result] = await connection.query(
      'INSERT INTO projects (title, category_id, description, date) VALUES (?, ?, ?, ?)',
      [project.title, project.category_id, project.description, project.date]
    );

    const newId = (result as any).insertId;

    // Resimleri ekle (imageUrls artık BLOB data veya URL olabilir)
    if (project.imageUrls && project.imageUrls.length > 0) {
      for (let i = 0; i < project.imageUrls.length; i++) {
        const imageData = project.imageUrls[i];

        try {
          // Eğer data URL ise (base64), BLOB olarak kaydet
          if (imageData.startsWith('data:')) {
            const matches = imageData.match(/^data:(.+);base64,(.+)$/);
            if (matches) {
              const mimeType = matches[1];
              const base64Data = matches[2];
              const buffer = Buffer.from(base64Data, 'base64');

              console.log(`Uploading image ${i + 1}: ${mimeType}, size: ${buffer.length} bytes`);

              await connection.query(
                'INSERT INTO project_images (project_id, image_data, mime_type, file_size, display_order) VALUES (?, ?, ?, ?, ?)',
                [newId, buffer, mimeType, buffer.length, i]
              );
            }
          } else {
            // Normal URL ise, image_url olarak kaydet
            await connection.query(
              'INSERT INTO project_images (project_id, image_url, display_order) VALUES (?, ?, ?)',
              [newId, imageData, i]
            );
          }
        } catch (imgError) {
          console.error(`Error uploading image ${i + 1}:`, imgError);
          throw imgError;
        }
      }
    }

    await connection.commit();

    return {
      id: newId.toString(),
      ...project,
    };
  } catch (error) {
    console.error('Error in addProject:', error);
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error('Error during rollback:', rollbackError);
    }
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Projeyi güncelle
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (updates.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(updates.title);
    }
    if (updates.category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(updates.category);
    }
    if (updates.category_id !== undefined) {
      updateFields.push('category_id = ?');
      updateValues.push(updates.category_id);
    }
    if (updates.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(updates.description);
    }
    if (updates.date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(updates.date);
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      await connection.query(
        `UPDATE projects SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Eğer imageUrls güncellenmişse, eski resimleri sil ve yenilerini ekle
    if (updates.imageUrls !== undefined) {
      await connection.query('DELETE FROM project_images WHERE project_id = ?', [id]);

      if (updates.imageUrls.length > 0) {
        for (let i = 0; i < updates.imageUrls.length; i++) {
          const imageData = updates.imageUrls[i];

          if (imageData.startsWith('data:')) {
            const matches = imageData.match(/^data:(.+);base64,(.+)$/);
            if (matches) {
              const mimeType = matches[1];
              const base64Data = matches[2];
              const buffer = Buffer.from(base64Data, 'base64');

              await connection.query(
                'INSERT INTO project_images (project_id, image_data, mime_type, file_size, display_order) VALUES (?, ?, ?, ?, ?)',
                [id, buffer, mimeType, buffer.length, i]
              );
            }
          } else {
            await connection.query(
              'INSERT INTO project_images (project_id, image_url, display_order) VALUES (?, ?, ?)',
              [id, imageData, i]
            );
          }
        }
      }
    }

    await connection.commit();

    // Güncellenmiş projeyi getir
    const updated = await getProjectById(id);
    return updated || null;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
}

// ============ IMAGE FUNCTIONS ============

export async function getImageById(imageId: number): Promise<{ data: Buffer; mimeType: string } | null> {
  const [rows] = await pool.query(
    'SELECT image_data, mime_type FROM project_images WHERE id = ? AND image_data IS NOT NULL',
    [imageId]
  );

  const images = rows as any[];
  if (images.length === 0) return null;

  return {
    data: images[0].image_data,
    mimeType: images[0].mime_type,
  };
}

// ============ SITE SETTINGS / LOGO FUNCTIONS ============

export async function getLogoSettings(): Promise<SiteSettings | null> {
  const [rows] = await pool.query('SELECT * FROM site_settings LIMIT 1');
  const settings = rows as SiteSettings[];
  return settings.length > 0 ? settings[0] : null;
}

export async function updateLogo(logoData: string): Promise<void> {
  // Parse base64 data URL
  const matches = logoData.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid data URL format');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  // Update or insert logo
  await pool.query(
    `INSERT INTO site_settings (id, logo_data, logo_mime_type, logo_file_size) 
     VALUES (1, ?, ?, ?)
     ON DUPLICATE KEY UPDATE 
       logo_data = VALUES(logo_data),
       logo_mime_type = VALUES(logo_mime_type),
       logo_file_size = VALUES(logo_file_size)`,
    [buffer, mimeType, buffer.length]
  );
}

export async function updateLogoText(logoText: string): Promise<void> {
  await pool.query(
    `INSERT INTO site_settings (id, logo_text) 
     VALUES (1, ?)
     ON DUPLICATE KEY UPDATE logo_text = VALUES(logo_text)`,
    [logoText]
  );
}

export async function deleteLogo(): Promise<void> {
  await pool.query(
    `UPDATE site_settings 
     SET logo_data = NULL, logo_mime_type = NULL, logo_file_size = NULL 
     WHERE id = 1`
  );
}

export async function getLogoImage(): Promise<{ data: Buffer; mimeType: string } | null> {
  const [rows] = await pool.query(
    'SELECT logo_data, logo_mime_type FROM site_settings WHERE id = 1 AND logo_data IS NOT NULL'
  );

  const settings = rows as any[];
  if (settings.length === 0 || !settings[0].logo_data) return null;

  return {
    data: settings[0].logo_data,
    mimeType: settings[0].logo_mime_type,
  };
}

// ============ CONTACT FUNCTIONS ============

export async function getContactInfo(): Promise<ContactInfo | null> {
  const [rows] = await pool.query('SELECT * FROM contact_info WHERE id = 1');
  const info = rows as ContactInfo[];
  return info.length > 0 ? info[0] : null;
}

export async function updateContactInfo(data: Partial<ContactInfo>): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.phone !== undefined) {
    fields.push('phone = ?');
    values.push(data.phone);
  }
  if (data.email !== undefined) {
    fields.push('email = ?');
    values.push(data.email);
  }
  if (data.address !== undefined) {
    fields.push('address = ?');
    values.push(data.address);
  }
  if (data.working_hours !== undefined) {
    fields.push('working_hours = ?');
    values.push(data.working_hours);
  }
  if (data.map_lat !== undefined) {
    fields.push('map_lat = ?');
    values.push(data.map_lat);
  }
  if (data.map_lng !== undefined) {
    fields.push('map_lng = ?');
    values.push(data.map_lng);
  }

  if (fields.length > 0) {
    await pool.query(
      `UPDATE contact_info SET ${fields.join(', ')} WHERE id = 1`,
      values
    );
  }
}

export async function submitContactForm(data: {
  name: string;
  phone: string;
  email: string;
  message: string;
}): Promise<number> {
  const [result] = await pool.query(
    'INSERT INTO contact_submissions (name, phone, email, message) VALUES (?, ?, ?, ?)',
    [data.name, data.phone, data.email, data.message]
  );
  return (result as any).insertId;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const [rows] = await pool.query(
    'SELECT * FROM contact_submissions ORDER BY created_at DESC'
  );
  return rows as ContactSubmission[];
}

export async function markSubmissionAsRead(id: number, is_read: boolean): Promise<void> {
  await pool.query(
    'UPDATE contact_submissions SET is_read = ? WHERE id = ?',
    [is_read, id]
  );
}

export async function deleteSubmission(id: number): Promise<boolean> {
  console.log('Attempting to delete submission with ID:', id, 'Type:', typeof id);

  const [result] = await pool.query(
    'DELETE FROM contact_submissions WHERE id = ?',
    [id]
  );

  const affectedRows = (result as any).affectedRows;
  console.log('Delete result - Affected rows:', affectedRows);

  return affectedRows > 0;
}

export async function getUnreadSubmissionsCount(): Promise<number> {
  const [rows] = await pool.query(
    'SELECT COUNT(*) as count FROM contact_submissions WHERE is_read = FALSE'
  );
  return (rows as any[])[0].count;
}


// ============ CATEGORY FUNCTIONS ============

export async function getCategories(): Promise<Category[]> {
  const [rows] = await pool.query(
    'SELECT * FROM categories ORDER BY display_order ASC, name ASC'
  );
  return rows as Category[];
}

export async function getCategoryById(id: number): Promise<Category | undefined> {
  const [rows] = await pool.query(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );
  const categories = rows as Category[];
  return categories.length > 0 ? categories[0] : undefined;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const [rows] = await pool.query(
    'SELECT * FROM categories WHERE slug = ?',
    [slug]
  );
  const categories = rows as Category[];
  return categories.length > 0 ? categories[0] : undefined;
}

export async function addCategory(data: { name: string; slug: string; description?: string }): Promise<number> {
  const [result] = await pool.query(
    'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
    [data.name, data.slug, data.description || null]
  );
  return (result as any).insertId;
}

export async function updateCategory(id: number, data: Partial<Category>): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.slug !== undefined) {
    fields.push('slug = ?');
    values.push(data.slug);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.display_order !== undefined) {
    fields.push('display_order = ?');
    values.push(data.display_order);
  }

  if (fields.length > 0) {
    values.push(id);
    await pool.query(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
}

export async function deleteCategory(id: number): Promise<boolean> {
  const [result] = await pool.query(
    'DELETE FROM categories WHERE id = ?',
    [id]
  );
  return (result as any).affectedRows > 0;
}

export async function getProjectsByCategory(categoryId: number): Promise<Project[]> {
  const [rows] = await pool.query(
    `
    SELECT 
      p.id,
      p.title,
      p.category,
      p.category_id,
      p.description,
      p.date,
      GROUP_CONCAT(
        CASE 
          WHEN pi.image_data IS NOT NULL THEN CONCAT('/api/images/', pi.id)
          ELSE pi.image_url 
        END 
        ORDER BY pi.display_order SEPARATOR '|||'
      ) as images
    FROM projects p
    LEFT JOIN project_images pi ON p.id = pi.project_id
    WHERE p.category_id = ?
    GROUP BY p.id, p.title, p.category, p.category_id, p.description, p.date
    ORDER BY p.date DESC
  `,
    [categoryId]
  );

  return (rows as any[]).map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    date: row.date,
    imageUrls: row.images ? row.images.split('|||') : [],
  }));
}
// ==================== ABOUT SECTIONS ====================

// Aktif hakkımızda bölümlerini getir (public)
export async function getAboutSections(): Promise<AboutSection[]> {
  const [rows] = await pool.query(
    'SELECT * FROM about_sections WHERE is_active = TRUE ORDER BY display_order ASC'
  );
  return rows as AboutSection[];
}

// Tüm hakkımızda bölümlerini getir (admin)
export async function getAllAboutSections(): Promise<AboutSection[]> {
  const [rows] = await pool.query(
    'SELECT * FROM about_sections ORDER BY display_order ASC'
  );
  return rows as AboutSection[];
}

// ID'ye göre hakkımızda bölümü getir
export async function getAboutSectionById(id: number): Promise<AboutSection | undefined> {
  const [rows] = await pool.query(
    'SELECT * FROM about_sections WHERE id = ?',
    [id]
  );
  const sections = rows as AboutSection[];
  return sections.length > 0 ? sections[0] : undefined;
}

// Yeni hakkımızda bölümü ekle
export async function addAboutSection(data: Omit<AboutSection, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const [result] = await pool.query(
    'INSERT INTO about_sections (title, content, image_url, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
    [data.title, data.content, data.image_url || null, data.display_order, data.is_active]
  );
  return (result as any).insertId;
}

// Hakkımızda bölümünü güncelle
export async function updateAboutSection(
  id: number,
  data: Partial<Omit<AboutSection, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  const updateFields: string[] = [];
  const updateValues: any[] = [];

  if (data.title !== undefined) {
    updateFields.push('title = ?');
    updateValues.push(data.title);
  }
  if (data.content !== undefined) {
    updateFields.push('content = ?');
    updateValues.push(data.content);
  }
  if (data.image_url !== undefined) {
    updateFields.push('image_url = ?');
    updateValues.push(data.image_url);
  }
  if (data.display_order !== undefined) {
    updateFields.push('display_order = ?');
    updateValues.push(data.display_order);
  }
  if (data.is_active !== undefined) {
    updateFields.push('is_active = ?');
    updateValues.push(data.is_active);
  }

  if (updateFields.length === 0) return false;

  updateValues.push(id);
  await pool.query(
    `UPDATE about_sections SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
  );
  return true;
}

// Hakkımızda bölümünü sil
export async function deleteAboutSection(id: number): Promise<boolean> {
  const [result] = await pool.query(
    'DELETE FROM about_sections WHERE id = ?',
    [id]
  );
  return (result as any).affectedRows > 0;
}

// ==================== SERVICES ====================

// Aktif hizmetleri getir (public)
export async function getServices(): Promise<Service[]> {
  const [rows] = await pool.query(
    'SELECT * FROM services WHERE is_active = TRUE ORDER BY display_order ASC'
  );
  return rows as Service[];
}

// Tüm hizmetleri getir (admin)
export async function getAllServices(): Promise<Service[]> {
  const [rows] = await pool.query(
    'SELECT * FROM services ORDER BY display_order ASC'
  );
  return rows as Service[];
}

// ID'ye göre hizmet getir
export async function getServiceById(id: number): Promise<Service | undefined> {
  const [rows] = await pool.query(
    'SELECT * FROM services WHERE id = ?',
    [id]
  );
  const services = rows as Service[];
  return services.length > 0 ? services[0] : undefined;
}

// Yeni hizmet ekle
export async function addService(data: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
  const [result] = await pool.query(
    'INSERT INTO services (title, description, icon, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
    [data.title, data.description, data.icon, data.display_order, data.is_active]
  );
  return (result as any).insertId;
}

// Hizmet güncelle
export async function updateService(
  id: number,
  data: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  const updateFields: string[] = [];
  const updateValues: any[] = [];

  if (data.title !== undefined) {
    updateFields.push('title = ?');
    updateValues.push(data.title);
  }
  if (data.description !== undefined) {
    updateFields.push('description = ?');
    updateValues.push(data.description);
  }
  if (data.icon !== undefined) {
    updateFields.push('icon = ?');
    updateValues.push(data.icon);
  }
  if (data.display_order !== undefined) {
    updateFields.push('display_order = ?');
    updateValues.push(data.display_order);
  }
  if (data.is_active !== undefined) {
    updateFields.push('is_active = ?');
    updateValues.push(data.is_active);
  }

  if (updateFields.length === 0) return false;

  updateValues.push(id);
  await pool.query(
    `UPDATE services SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
  );
  return true;
}

// Hizmet sil
export async function deleteService(id: number): Promise<boolean> {
  const [result] = await pool.query(
    'DELETE FROM services WHERE id = ?',
    [id]
  );
  return (result as any).affectedRows > 0;
}
