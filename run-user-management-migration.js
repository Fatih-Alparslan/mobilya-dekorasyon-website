const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runUserManagementMigration() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '8889'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'mobilyadekorasyon',
        multipleStatements: true,
    });

    try {
        console.log('👥 Running user management migration...');

        // Create password reset tokens table
        const sql = fs.readFileSync(
            path.join(__dirname, 'database', 'user-management-schema.sql'),
            'utf8'
        );
        await connection.query(sql);

        // Add columns to users table one by one
        const columnsToAdd = [
            { name: 'is_active', sql: 'is_active BOOLEAN DEFAULT TRUE' },
            { name: 'last_login', sql: 'last_login TIMESTAMP NULL' },
            { name: 'created_by', sql: 'created_by INT NULL' }
        ];

        for (const col of columnsToAdd) {
            const [exists] = await connection.query(
                `SHOW COLUMNS FROM users LIKE '${col.name}'`
            );

            if (exists.length === 0) {
                console.log(`Adding column ${col.name}...`);
                await connection.query(`ALTER TABLE users ADD COLUMN ${col.sql}`);
            } else {
                console.log(`Column ${col.name} already exists.`);
            }
        }

        console.log('✅ User management tables updated successfully!');
        console.log('   - password_reset_tokens table created');
        console.log('   - users table enhanced');
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

runUserManagementMigration()
    .then(() => {
        console.log('\n✨ User management migration completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 User management migration failed');
        process.exit(1);
    });
