const mysql = require('mysql2/promise');

async function removeLogoImage() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '8889'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'mobilyadekorasyon',
    });

    try {
        console.log('Removing logo image from database...');

        await connection.query(`
      UPDATE site_settings 
      SET logo_data = NULL, logo_mime_type = NULL, logo_file_size = NULL 
      WHERE id = 1
    `);

        console.log('✓ Logo image removed successfully!');
        console.log('✓ Text-based logo "212 Huzur Mobilya" will now be displayed');

    } catch (error) {
        console.error('Error removing logo image:', error);
    } finally {
        await connection.end();
    }
}

removeLogoImage();
