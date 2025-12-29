const mysql = require('mysql2/promise');

async function updateProjects() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'mobilyadekorasyon'
    });

    try {
        console.log('🔄 Updating projects with realistic data...');

        const fs = require('fs');
        const sql = fs.readFileSync(__dirname + '/update-projects-realistic.sql', 'utf8');

        const statements = sql.split(';').filter(s => s.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }

        console.log('✅ Projects updated successfully!');
        console.log('📊 9 realistic projects added');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
}

updateProjects();
