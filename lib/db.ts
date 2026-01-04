import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export interface Project {
  id: string;
  title: string;
  title_en?: string;
  category: string;
  category_id?: number;
  category_slug?: string;
  description: string;
  description_en?: string;
  imageUrls: string[];
  date: string;
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  email: string | null;
  role?: 'super_admin' | 'admin' | 'editor';
  is_active?: boolean;
  last_login?: Date | null;
  created_by?: number | null;
  created_at: Date;
  updated_at?: Date;
}

export interface SiteSettings {
  id: number;
  logo_text: string;
  logo_data: Buffer | null;
  logo_mime_type: string | null;
  logo_file_size: number | null;
  selected_favicon: string;
  created_at: Date;
  updated_at: Date;
}

// ... (keep intermediate content)


export interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  address: string;
  working_hours: string;
  map_lat: number | null;
  map_lng: number | null;
  map_embed_url?: string;
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
  name_en?: string;
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
      p.title_en, 
      COALESCE(c.name, p.category, 'Kategorisiz') as category,
      c.slug,
      p.category_id,
      p.description,
      p.description_en, 
      DATE_FORMAT(p.date, '%Y-%m-%d') as date,
      GROUP_CONCAT(
        CASE 
          WHEN pi.image_data IS NOT NULL THEN CONCAT('/api/images/', pi.id)
          WHEN pi.image_url IS NOT NULL THEN pi.image_url
          ELSE NULL
        END 
        ORDER BY pi.is_featured DESC, pi.display_order SEPARATOR '|||'
      ) as images
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN project_images pi ON p.id = pi.project_id 
      AND (pi.image_data IS NOT NULL OR pi.image_url IS NOT NULL)
    GROUP BY p.id, p.title, p.title_en, c.name, c.slug, p.category, p.category_id, p.description, p.description_en, p.date
    ORDER BY p.created_at DESC
  `) as any;

  return (rows as any[]).map((row) => ({
    id: row.id,
    title: row.title,
    title_en: row.title_en,
    category: row.category,
    category_slug: row.slug,
    description: row.description,
    description_en: row.description_en,
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
      p.title_en, 
      COALESCE(c.name, p.category, 'Kategorisiz') as category,
      c.slug,
      p.category_id,
      p.description,
      p.description_en, 
      DATE_FORMAT(p.date, '%Y-%m-%d') as date,
      GROUP_CONCAT(
        CASE 
          WHEN pi.image_data IS NOT NULL THEN CONCAT('/api/images/', pi.id)
          WHEN pi.image_url IS NOT NULL THEN pi.image_url
          ELSE NULL
        END 
        ORDER BY pi.is_featured DESC, pi.display_order SEPARATOR '|||'
      ) as images
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN project_images pi ON p.id = pi.project_id 
      AND (pi.image_data IS NOT NULL OR pi.image_url IS NOT NULL)
    WHERE p.id = ?
    GROUP BY p.id, p.title, p.title_en, c.name, c.slug, p.category, p.category_id, p.description, p.description_en, p.date
  `,
    [id]
  );

  const project = (rows as any[])[0];
  if (!project) return undefined;

  return {
    id: project.id,
    title: project.title,
    title_en: project.title_en,
    category: project.category,
    category_slug: project.slug,
    category_id: project.category_id,
    description: project.description,
    description_en: project.description_en,
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
      'INSERT INTO projects (title, title_en, category_id, description, description_en, date) VALUES (?, ?, ?, ?, ?, ?)',
      [project.title, project.title_en || null, project.category_id, project.description, project.description_en || null, project.date]
    );

    const newId = (result as any).insertId;

    // Resimleri ekle (imageUrls artık BLOB data veya URL olabilir)
    if (project.imageUrls && project.imageUrls.length > 0) {
      for (let i = 0; i < project.imageUrls.length; i++) {
        const imageData = project.imageUrls[i];
        const isFeatured = i === 0; // First image is featured (frontend already reordered)

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
                'INSERT INTO project_images (project_id, image_data, mime_type, file_size, display_order, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
                [newId, buffer, mimeType, buffer.length, i, isFeatured]
              );
            }
          } else {
            // Normal URL ise, image_url olarak kaydet
            await connection.query(
              'INSERT INTO project_images (project_id, image_url, display_order, is_featured) VALUES (?, ?, ?, ?)',
              [newId, imageData, i, isFeatured]
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
    if (updates.title_en !== undefined) {
      updateFields.push('title_en = ?');
      updateValues.push(updates.title_en);
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
    if (updates.description_en !== undefined) {
      updateFields.push('description_en = ?');
      updateValues.push(updates.description_en);
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

    // Eğer imageUrls güncellenmişse, akıllı güncelleme yap (ID'leri koru)
    if (updates.imageUrls !== undefined) {
      const keptIds: number[] = [];
      const newOrders = new Map<number, number>();
      const itemsToInsert: { data: string, order: number }[] = [];

      updates.imageUrls.forEach((img, idx) => {
        if (img.startsWith('/api/images/')) {
          const idStr = img.replace('/api/images/', '');
          const imgId = parseInt(idStr);
          if (!isNaN(imgId)) {
            keptIds.push(imgId);
            newOrders.set(imgId, idx);
          }
        } else {
          itemsToInsert.push({ data: img, order: idx });
        }
      });

      // 1. Silinen resimleri kaldır (keptIds listesinde olmayanları)
      if (keptIds.length > 0) {
        await connection.query(
          `DELETE FROM project_images WHERE project_id = ? AND id NOT IN (${keptIds.join(',')})`,
          [id]
        );
      } else {
        // Hiçbir eski resim tutulmuyorsa, hepsini sil
        await connection.query('DELETE FROM project_images WHERE project_id = ?', [id]);
      }

      // 2. Tutulan resimlerin sırasını güncelle
      for (const [imgId, order] of newOrders.entries()) {
        await connection.query(
          'UPDATE project_images SET display_order = ? WHERE id = ?',
          [order, imgId]
        );
      }

      // 3. Yeni resimleri ekle (veya external URL'leri yeniden oluştur)
      for (const item of itemsToInsert) {
        const imageData = item.data;
        const i = item.order;

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

export async function updateFavicon(favicon: string): Promise<void> {
  await pool.query(
    `INSERT INTO site_settings (id, selected_favicon) 
       VALUES (1, ?)
       ON DUPLICATE KEY UPDATE selected_favicon = VALUES(selected_favicon)`,
    [favicon]
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
  if (data.map_embed_url !== undefined) {
    fields.push('map_embed_url = ?');
    values.push(data.map_embed_url);
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

export async function addCategory(data: { name: string; name_en?: string; slug: string; description?: string }): Promise<number> {
  const [result] = await pool.query(
    'INSERT INTO categories (name, name_en, slug, description) VALUES (?, ?, ?, ?)',
    [data.name, data.name_en || null, data.slug, data.description || null]
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
  if (data.name_en !== undefined) {
    fields.push('name_en = ?');
    values.push(data.name_en);
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
      AND (pi.image_data IS NOT NULL OR pi.image_url IS NOT NULL)
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

// ============ FEATURED IMAGE FUNCTIONS ============

export async function setFeaturedImage(projectId: string, imageUrl: string): Promise<boolean> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // First, unset all featured images for this project
    await connection.query(
      'UPDATE project_images SET is_featured = FALSE WHERE project_id = ?',
      [parseInt(projectId)]
    );

    // Then, set the specified image as featured
    // Handle both BLOB images (/api/images/ID) and URL images
    let result;

    if (imageUrl.startsWith('/api/images/')) {
      // Extract the image ID from /api/images/ID format
      const imageId = imageUrl.replace('/api/images/', '');
      result = await connection.query(
        'UPDATE project_images SET is_featured = TRUE WHERE project_id = ? AND id = ?',
        [parseInt(projectId), parseInt(imageId)]
      );
    } else {
      // For external URLs, match by image_url field
      result = await connection.query(
        'UPDATE project_images SET is_featured = TRUE WHERE project_id = ? AND image_url = ?',
        [parseInt(projectId), imageUrl]
      );
    }

    await connection.commit();
    const success = (result[0] as any).affectedRows > 0;
    return success;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ============ SOCIAL MEDIA FUNCTIONS ============

export interface SocialMediaAccount {
  id: number;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  display_order: number;
  created_at: Date;
}

export async function getSocialMediaAccounts(onlyActive = false): Promise<SocialMediaAccount[]> {
  const query = onlyActive
    ? 'SELECT * FROM social_media_accounts WHERE is_active = TRUE ORDER BY display_order ASC'
    : 'SELECT * FROM social_media_accounts ORDER BY display_order ASC';
  const [rows] = await pool.query(query);
  return rows as SocialMediaAccount[];
}

export async function addSocialMediaAccount(data: { platform: string; url: string; icon: string; display_order?: number; is_active?: boolean }): Promise<number> {
  const [result] = await pool.query(
    'INSERT INTO social_media_accounts (platform, url, icon, display_order, is_active) VALUES (?, ?, ?, ?, ?)',
    [data.platform, data.url, data.icon, data.display_order || 0, data.is_active !== undefined ? data.is_active : true]
  );
  return (result as any).insertId;
}

export async function updateSocialMediaAccount(id: number, data: Partial<SocialMediaAccount>): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.platform !== undefined) { fields.push('platform = ?'); values.push(data.platform); }
  if (data.url !== undefined) { fields.push('url = ?'); values.push(data.url); }
  if (data.icon !== undefined) { fields.push('icon = ?'); values.push(data.icon); }
  if (data.is_active !== undefined) { fields.push('is_active = ?'); values.push(data.is_active); }
  if (data.display_order !== undefined) { fields.push('display_order = ?'); values.push(data.display_order); }

  if (fields.length > 0) {
    values.push(id);
    await pool.query(`UPDATE social_media_accounts SET ${fields.join(', ')} WHERE id = ?`, values);
  }
}

export async function deleteSocialMediaAccount(id: number): Promise<void> {
  await pool.query('DELETE FROM social_media_accounts WHERE id = ?', [id]);
}

// ============ SECURITY & AUDIT LOG FUNCTIONS ============

export interface AuditLogEntry {
  id: number;
  user_id: number | null;
  username: string;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  details: string | null;
  success: boolean;
  created_at: Date;
}

export interface AdminSession {
  id: number;
  user_id: number;
  session_token_hash: string;
  ip_address: string | null;
  user_agent: string | null;
  expires_at: Date;
  created_at: Date;
  last_activity: Date;
}

export interface AdminSettings {
  id: number;
  session_timeout_hours: number;
  max_login_attempts: number;
  lockout_duration_minutes: number;
  require_https: boolean;
  ip_whitelist: string | null;
  two_factor_enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Log an admin action to the audit log
 */
export async function logAuditEntry(data: {
  user_id?: number;
  username: string;
  action: string;
  ip_address?: string;
  user_agent?: string;
  details?: string;
  success?: boolean;
}): Promise<number> {
  const [result] = await pool.query(
    `INSERT INTO admin_audit_log 
     (user_id, username, action, ip_address, user_agent, details, success) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.user_id || null,
      data.username,
      data.action,
      data.ip_address || null,
      data.user_agent || null,
      data.details || null,
      data.success !== undefined ? data.success : true,
    ]
  );
  return (result as any).insertId;
}

/**
 * Get audit log entries with optional filtering
 */
export async function getAuditLog(options?: {
  limit?: number;
  offset?: number;
  userId?: number;
  action?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<AuditLogEntry[]> {
  let query = 'SELECT * FROM admin_audit_log WHERE 1=1';
  const params: any[] = [];

  if (options?.userId) {
    query += ' AND user_id = ?';
    params.push(options.userId);
  }

  if (options?.action) {
    query += ' AND action = ?';
    params.push(options.action);
  }

  if (options?.startDate) {
    query += ' AND created_at >= ?';
    params.push(options.startDate);
  }

  if (options?.endDate) {
    query += ' AND created_at <= ?';
    params.push(options.endDate);
  }

  query += ' ORDER BY created_at DESC';

  if (options?.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
    if (options?.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }
  }

  const [rows] = await pool.query(query, params);
  return rows as AuditLogEntry[];
}

/**
 * Create a new admin session
 */
export async function createAdminSession(data: {
  user_id: number;
  session_token_hash: string;
  ip_address?: string;
  user_agent?: string;
  expires_at: Date;
}): Promise<number> {
  const [result] = await pool.query(
    `INSERT INTO admin_sessions 
     (user_id, session_token_hash, ip_address, user_agent, expires_at) 
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.user_id,
      data.session_token_hash,
      data.ip_address || null,
      data.user_agent || null,
      data.expires_at,
    ]
  );
  return (result as any).insertId;
}

/**
 * Get session by token hash
 */
export async function getSessionByToken(tokenHash: string): Promise<AdminSession | null> {
  const [rows] = await pool.query(
    'SELECT * FROM admin_sessions WHERE session_token_hash = ? AND expires_at > NOW()',
    [tokenHash]
  );
  const sessions = rows as AdminSession[];
  return sessions.length > 0 ? sessions[0] : null;
}

/**
 * Update session last activity
 */
export async function updateSessionActivity(sessionId: number): Promise<void> {
  await pool.query(
    'UPDATE admin_sessions SET last_activity = NOW() WHERE id = ?',
    [sessionId]
  );
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(tokenHash: string): Promise<boolean> {
  const [result] = await pool.query(
    'DELETE FROM admin_sessions WHERE session_token_hash = ?',
    [tokenHash]
  );
  return (result as any).affectedRows > 0;
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: number): Promise<number> {
  const [result] = await pool.query(
    'DELETE FROM admin_sessions WHERE user_id = ?',
    [userId]
  );
  return (result as any).affectedRows;
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const [result] = await pool.query(
    'DELETE FROM admin_sessions WHERE expires_at < NOW()'
  );
  return (result as any).affectedRows;
}

/**
 * Get admin security settings
 */
export async function getAdminSettings(): Promise<AdminSettings | null> {
  const [rows] = await pool.query('SELECT * FROM admin_settings WHERE id = 1');
  const settings = rows as AdminSettings[];
  return settings.length > 0 ? settings[0] : null;
}

/**
 * Update admin security settings
 */
export async function updateAdminSettings(data: Partial<AdminSettings>): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.session_timeout_hours !== undefined) {
    fields.push('session_timeout_hours = ?');
    values.push(data.session_timeout_hours);
  }
  if (data.max_login_attempts !== undefined) {
    fields.push('max_login_attempts = ?');
    values.push(data.max_login_attempts);
  }
  if (data.lockout_duration_minutes !== undefined) {
    fields.push('lockout_duration_minutes = ?');
    values.push(data.lockout_duration_minutes);
  }
  if (data.require_https !== undefined) {
    fields.push('require_https = ?');
    values.push(data.require_https);
  }
  if (data.ip_whitelist !== undefined) {
    fields.push('ip_whitelist = ?');
    values.push(data.ip_whitelist);
  }
  if (data.two_factor_enabled !== undefined) {
    fields.push('two_factor_enabled = ?');
    values.push(data.two_factor_enabled);
  }

  if (fields.length > 0) {
    await pool.query(
      `UPDATE admin_settings SET ${fields.join(', ')} WHERE id = 1`,
      values
    );
  }
}

// ============ USER MANAGEMENT FUNCTIONS ============

export interface PasswordResetToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}

/**
 * Get all users
 */
/**
 * Get all users
 */
export async function getAllUsers(): Promise<User[]> {
  const [rows] = await pool.query(
    'SELECT id, username, email, role, is_active, last_login, created_at, updated_at FROM users ORDER BY created_at DESC'
  );
  return rows as User[];
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
  const [rows] = await pool.query(
    'SELECT id, username, email, role, is_active, last_login, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
}

/**
 * Create a new user
 */
export async function createUser(userData: {
  username: string;
  email: string;
  password?: string;
  role?: 'super_admin' | 'admin' | 'editor';
}): Promise<number> {
  const connection = await pool.getConnection();

  try {
    // Hash password if provided
    let passwordHash = '';
    if (userData.password) {
      // Assuming bcrypt is imported or available in scope
      const bcrypt = require('bcrypt');
      passwordHash = await bcrypt.hash(userData.password, 10);
    }

    const [result] = await connection.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [userData.username, userData.email, passwordHash, userData.role || 'editor']
    );

    return (result as any).insertId;
  } finally {
    connection.release();
  }
}

/**
 * Update user
 */
export async function updateUser(
  id: number,
  data: { username?: string; email?: string; is_active?: boolean; role?: string }
): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.username !== undefined) {
    fields.push('username = ?');
    values.push(data.username);
  }
  if (data.email !== undefined) {
    fields.push('email = ?');
    values.push(data.email);
  }
  if (data.is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(data.is_active);
  }
  if (data.role !== undefined) {
    fields.push('role = ?');
    values.push(data.role);
  }

  if (fields.length === 0) return false;

  values.push(id);

  const [result] = await pool.query(
    `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );

  return (result as any).affectedRows > 0;
}

/**
 * Update user password
 */
export async function updateUserPassword(userId: number, newPassword: string): Promise<boolean> {
  const passwordHash = await hashPassword(newPassword);

  const [result] = await pool.query(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [passwordHash, userId]
  );

  return (result as any).affectedRows > 0;
}

/**
 * Delete user
 */
export async function deleteUser(id: number): Promise<boolean> {
  const [result] = await pool.query(
    'DELETE FROM users WHERE id = ?',
    [id]
  );

  return (result as any).affectedRows > 0;
}

/**
 * Update last login time
 */
export async function updateLastLogin(userId: number): Promise<void> {
  await pool.query(
    'UPDATE users SET last_login = NOW() WHERE id = ?',
    [userId]
  );
}

/**
 * Create password reset token
 */
export async function createPasswordResetToken(userId: number): Promise<string> {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await pool.query(
    'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );

  return token;
}

/**
 * Get password reset token
 */
export async function getPasswordResetToken(token: string): Promise<PasswordResetToken | null> {
  const [rows] = await pool.query(
    'SELECT * FROM password_reset_tokens WHERE token = ? AND used = FALSE AND expires_at > NOW()',
    [token]
  );

  const tokens = rows as PasswordResetToken[];
  return tokens.length > 0 ? tokens[0] : null;
}

/**
 * Mark password reset token as used
 */
export async function markTokenAsUsed(token: string): Promise<void> {
  await pool.query(
    'UPDATE password_reset_tokens SET used = TRUE WHERE token = ?',
    [token]
  );
}

/**
 * Delete expired password reset tokens
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const [result] = await pool.query(
    'DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = TRUE'
  );

  return (result as any).affectedRows;
}
