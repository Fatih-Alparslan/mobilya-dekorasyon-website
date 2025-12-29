const mysql = require('mysql2/promise');

async function runServicesMigration() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'mobilyadekorasyon'
    });

    try {
        console.log('🔄 Running services migration...');

        const fs = require('fs');
        const sql = fs.readFileSync(__dirname + '/services-migration.sql', 'utf8');

        const statements = sql.split(';').filter(s => s.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }

        console.log('✅ Services migration completed!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

runServicesMigration();
