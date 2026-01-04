const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runSecurityMigration() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '8889'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'mobilyadekorasyon',
        multipleStatements: true,
    });

    try {
        console.log('🔐 Running security migration...');

        const sql = fs.readFileSync(
            path.join(__dirname, 'database', 'security-schema.sql'),
            'utf8'
        );

        await connection.query(sql);

        console.log('✅ Security tables created successfully!');
        console.log('   - admin_audit_log');
        console.log('   - admin_sessions');
        console.log('   - admin_settings');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

runSecurityMigration()
    .then(() => {
        console.log('\n✨ Security migration completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Security migration failed:', error);
        process.exit(1);
    });
