const mysql = require('mysql2/promise');
const fs = require('fs');

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
        const sql = fs.readFileSync('database/schema-update.sql', 'utf8');
        console.log('Running migration...\n');
        console.log(sql);
        console.log('\n---\n');

        await connection.query(sql);

        console.log('✓ Migration completed successfully!');

        // Verify the table was created
        const [rows] = await connection.query('DESCRIBE site_settings');
        console.log('\nTable structure:');
        console.table(rows);

        // Check if default row exists
        const [settings] = await connection.query('SELECT * FROM site_settings');
        console.log('\nDefault settings:');
        console.table(settings);

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

runMigration().catch(console.error);
