const mysql = require('mysql2/promise');

async function updateLogoText() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '8889'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'mobilyadekorasyon',
    });

    try {
        console.log('Updating logo text to "212 Huzur Mobilya"...');

        await connection.query(`
      INSERT INTO site_settings (id, logo_text) 
      VALUES (1, '212 Huzur Mobilya')
      ON DUPLICATE KEY UPDATE logo_text = '212 Huzur Mobilya'
    `);

        console.log('✓ Logo text updated successfully!');

        // Verify the update
        const [rows] = await connection.query('SELECT logo_text FROM site_settings WHERE id = 1');
        console.log('Current logo text:', rows[0]?.logo_text);

    } catch (error) {
        console.error('Error updating logo:', error);
    } finally {
        await connection.end();
    }
}

updateLogoText();
