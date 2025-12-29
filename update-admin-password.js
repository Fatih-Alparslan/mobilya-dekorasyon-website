const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function updateAdminPassword() {
    // Yeni şifre hash'i oluştur
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);

    console.log('Generated hash for password "admin123":', hash);

    // Veritabanına bağlan
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'mobilyadekorasyon'
    });

    try {
        // Admin kullanıcısının şifresini güncelle
        const [result] = await connection.query(
            'UPDATE users SET password_hash = ? WHERE username = ?',
            [hash, 'admin']
        );

        console.log('Update result:', result);

        // Doğrulama yap
        const [rows] = await connection.query(
            'SELECT username, password_hash FROM users WHERE username = ?',
            ['admin']
        );

        console.log('\nUpdated user:', rows[0]);

        // Hash'in çalıştığını doğrula
        const isValid = await bcrypt.compare(password, rows[0].password_hash);
        console.log('\nPassword verification:', isValid ? '✓ Success' : '✗ Failed');

    } finally {
        await connection.end();
    }
}

updateAdminPassword().catch(console.error);
