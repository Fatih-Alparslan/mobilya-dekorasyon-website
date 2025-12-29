const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'mobilyadekorasyon',
        multipleStatements: true
    });

    try {
        console.log('🔄 Starting category migration...\n');

        // Read and execute migration SQL
        const sql = fs.readFileSync(path.join(__dirname, 'category-migration.sql'), 'utf8');

        await connection.query(sql);

        console.log('✅ Migration completed successfully!\n');

        // Show results
        const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories');
        const [projects] = await connection.query('SELECT COUNT(*) as count FROM projects WHERE category_id IS NOT NULL');

        console.log(`📊 Results:`);
        console.log(`   - Categories created: ${categories[0].count}`);
        console.log(`   - Projects linked: ${projects[0].count}`);

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

runMigration();
