const mysql = require('mysql2/promise');

async function fixCategoryColumn() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'mobilyadekorasyon'
    });

    try {
        console.log('🔄 Making category column nullable...');

        await connection.query('ALTER TABLE projects MODIFY COLUMN category VARCHAR(100) NULL');

        console.log('✅ Category column is now nullable!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

fixCategoryColumn();
