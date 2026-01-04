const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// .env.local dosyasını manuel oku
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
            console.log('✅ Loaded .env.local');
        }
    } catch (e) {
        console.warn('⚠️ Could not load .env.local');
    }
}

async function runRolesMigration() {
    loadEnv();

    let connection;

    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '8889'), // MAMP default port
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'mobilyadekorasyon',
            multipleStatements: true
        });

        console.log('✅ Database connection established');

        // Read SQL file
        const sqlFile = path.join(__dirname, 'database/roles-schema.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Execute SQL
        console.log('🔄 Running roles migration...');
        await connection.query(sql);

        console.log('✅ Roles migration completed successfully!');

        // Update existing admin to super_admin
        console.log('\n🔄 Updating existing admin users to super_admin...');
        // Rolü null olan veya admin olan herkesi super_admin yap (ilk kurulum için)
        await connection.query(
            "UPDATE users SET role = 'super_admin' WHERE username = 'admin' OR role IS NULL"
        );
        console.log('✅ Admin users updated');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠️ Columns already exist, skipping...');
        } else {
            process.exit(1);
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('✅ Database connection closed');
        }
    }
}

runRolesMigration();
