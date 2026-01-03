
import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS social_media_accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        platform VARCHAR(50) NOT NULL,
        url VARCHAR(255) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Insert some default data if empty
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM social_media_accounts') as any[];
        if (rows[0].count === 0) {
            await pool.query(`
            INSERT INTO social_media_accounts (platform, url, icon, display_order) VALUES 
            ('Instagram', 'https://instagram.com', 'Instagram', 1),
            ('WhatsApp', 'https://wa.me/905555555555', 'MessageCircle', 2)
        `);
        }

        return NextResponse.json({ success: true, message: 'Social Media table created' });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
