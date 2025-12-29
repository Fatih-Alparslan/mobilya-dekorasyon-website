const mysql = require('mysql2/promise');
const fs = require('fs');

async function runContactMigration() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'mobilyadekorasyon',
        multipleStatements: true
    });

    try {
        const sql = fs.readFileSync('database/contact-schema.sql', 'utf8');
        console.log('Running contact migration...\n');

        await connection.query(sql);

        console.log('✓ Migration completed successfully!\n');

        // Verify contact_info table
        const [infoRows] = await connection.query('DESCRIBE contact_info');
        console.log('contact_info table structure:');
        console.table(infoRows);

        // Verify contact_submissions table
        const [submissionsRows] = await connection.query('DESCRIBE contact_submissions');
        console.log('\ncontact_submissions table structure:');
        console.table(submissionsRows);

        // Check default data
        const [data] = await connection.query('SELECT * FROM contact_info');
        console.log('\nDefault contact info:');
        console.table(data);

    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

runContactMigration().catch(console.error);
