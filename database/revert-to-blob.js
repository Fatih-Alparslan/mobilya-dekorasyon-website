const mysql = require('mysql2/promise');

async function revertToBlob() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'mobilyadekorasyon'
    });

    try {
        console.log('🔄 Reverting to original BLOB schema...\n');

        // 1. Drop tables
        console.log('1️⃣ Dropping tables...');
        await connection.query('DROP TABLE IF EXISTS project_images');
        await connection.query('DROP TABLE IF EXISTS projects');

        // 2. Create projects table with VARCHAR id (original)
        console.log('2️⃣ Creating projects table (VARCHAR id)...');
        await connection.query(`
            CREATE TABLE projects (
                id VARCHAR(255) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                category_id INT,
                description TEXT,
                date VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `);

        // 3. Create project_images with BLOB
        console.log('3️⃣ Creating project_images table (BLOB storage)...');
        await connection.query(`
            CREATE TABLE project_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id VARCHAR(255) NOT NULL,
                image_data LONGBLOB,
                image_url VARCHAR(500),
                mime_type VARCHAR(100),
                file_size INT,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        `);

        console.log('\n✅ Schema reverted to original BLOB structure!');
        console.log('📝 Note: You can now add projects via admin panel');
        console.log('🎉 Ready to use!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

revertToBlob();
