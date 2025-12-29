const bcrypt = require('bcrypt');

// Veritabanındaki hash
const hash = '$2b$10$rKjxH8F7vZ3qX9wY5nJ0/.vGxJZ8QHZ7qX9wY5nJ0/.vGxJZ8QHZ7q';

// Test edilecek şifreler
const passwords = ['admin123', 'admin', '123456', 'password'];

async function testPasswords() {
    console.log('Testing passwords against hash...\n');

    for (const password of passwords) {
        const isMatch = await bcrypt.compare(password, hash);
        console.log(`Password: "${password}" -> ${isMatch ? '✓ MATCH' : '✗ No match'}`);
    }

    // Yeni hash oluştur
    console.log('\n--- Creating new hash for "admin123" ---');
    const newHash = await bcrypt.hash('admin123', 10);
    console.log('New hash:', newHash);

    const verify = await bcrypt.compare('admin123', newHash);
    console.log('Verification:', verify ? '✓ Success' : '✗ Failed');
}

testPasswords().catch(console.error);
