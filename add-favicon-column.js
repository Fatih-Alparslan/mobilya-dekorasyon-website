const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Basic .env parser
function loadEnv() {
    try {
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join('=').trim().replace(/"/g, '');
                    if (key && value) {
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (e) {
        console.error('Error loading .env:', e);
    }
}

loadEnv();

async function run() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '8889'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'mobilyadekorasyon',
    });

    try {
        console.log('Adding selected_favicon column to site_settings table...');
        await connection.query(`
            ALTER TABLE site_settings 
            ADD COLUMN selected_favicon VARCHAR(255) DEFAULT 'default'
        `);
        console.log('Column added successfully.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error('Error adding column:', error);
        }
    } finally {
        await connection.end();
    }
}

run();
