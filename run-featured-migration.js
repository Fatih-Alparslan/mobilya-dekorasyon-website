const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    let connection;

    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '8889'),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'mobilyadekorasyon',
            multipleStatements: true
        });

        console.log('Connected to database');

        // Read migration file
        const migrationPath = path.join(__dirname, 'database', 'add-featured-image.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Running migration...');

        // Execute migration
        const [results] = await connection.query(sql);

        console.log('✓ Migration completed successfully!');

        // Verify the changes
        const [rows] = await connection.query(`
      SELECT 
        pi.project_id,
        COUNT(*) as total_images,
        SUM(CASE WHEN is_featured = TRUE THEN 1 ELSE 0 END) as featured_count
      FROM project_images pi
      GROUP BY pi.project_id
    `);

        console.log('\nVerification:');
        console.log('Projects with images:', rows.length);
        rows.forEach(row => {
            console.log(`  Project ${row.project_id}: ${row.total_images} images, ${row.featured_count} featured`);
        });

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\nDatabase connection closed');
        }
    }
}

runMigration();
