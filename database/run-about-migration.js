const mysql = require('mysql2/promise');

async function runAboutMigration() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'mobilyadekorasyon'
    });

    try {
        console.log('🔄 Running about sections migration...');

        const fs = require('fs');
        const sql = fs.readFileSync(__dirname + '/about-migration.sql', 'utf8');

        const statements = sql.split(';').filter(s => s.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }

        console.log('✅ About sections migration completed!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

runAboutMigration();
