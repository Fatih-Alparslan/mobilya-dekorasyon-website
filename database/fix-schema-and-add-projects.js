const mysql = require('mysql2/promise');

async function fixDatabaseSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'mobilyadekorasyon'
    });

    try {
        console.log('🔄 Fixing database schema...\n');

        // 1. Foreign key'i geçici olarak kaldır
        console.log('1️⃣ Removing foreign key constraint...');
        await connection.query('ALTER TABLE project_images DROP FOREIGN KEY project_images_ibfk_1');

        // 2. Tabloları yeniden oluştur
        console.log('2️⃣ Recreating tables...');
        await connection.query('DROP TABLE IF EXISTS project_images');
        await connection.query('DROP TABLE IF EXISTS projects');

        // Projects tablosu - INT AUTO_INCREMENT ile
        await connection.query(`
            CREATE TABLE projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                category_id INT,
                description TEXT,
                date VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `);

        // Project images tablosu
        await connection.query(`
            CREATE TABLE project_images (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                image_url VARCHAR(500) NOT NULL,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        `);

        console.log('3️⃣ Tables recreated successfully!\n');

        // 3. Gerçekçi projeleri ekle (Doğru kategori ID'leri: 9=Villa, 10=Ofis, 11=Mağaza, 12=Restoran, 13=Konut)
        console.log('4️⃣ Adding realistic projects...');

        const projects = [
            ['Modern Deniz Manzaralı Villa', 'Villa', 9, 'Bodrum\'da deniz manzaralı 450m² lüks villa projesi. Açık mutfak konsepti, geniş teraslar ve sonsuzluk havuzu ile modern yaşam alanı tasarımı.', '2024-01-15'],
            ['Bağ Evi Villa Dekorasyonu', 'Villa', 9, 'Alaçatı\'da 300m² bağ evi konseptli villa iç mimarlık projesi. Rustik ve modern tasarımın birleşimi, özel tasarım mobilyalar.', '2024-02-20'],
            ['Şehir İçi Müstakil Villa', 'Villa', 9, 'İstanbul Zekeriyaköy\'de 380m² müstakil villa tam dekorasyon projesi. Smart home sistemi ve lüks malzeme seçimleri.', '2023-12-10'],
            ['Teknoloji Şirketi Ofisi', 'Ofis', 10, 'Maslak\'ta 600m² teknoloji şirketi ofis tasarımı. Açık çalışma alanları, toplantı odaları ve dinlenme bölümleri.', '2024-03-05'],
            ['Hukuk Bürosu Dekorasyonu', 'Ofis', 10, 'Nişantaşı\'nda 250m² prestijli hukuk bürosu dekorasyonu. Klasik ve modern çizgilerin birleşimi.', '2023-11-25'],
            ['Loft Daire Dönüşümü', 'Konut', 13, 'Karaköy\'de 180m² loft daire tam dönüşüm projesi. Endüstriyel tarz, yüksek tavanlar ve geniş pencereler.', '2024-01-30'],
            ['Cafe & Restaurant Tasarımı', 'Restoran', 12, 'Bebek\'te 200m² cafe & restaurant iç mekan projesi. Bohem tarz dekorasyon ve özel aydınlatma.', '2023-10-18'],
            ['Butik Mağaza Dekorasyonu', 'Mağaza', 11, 'Nişantaşı\'nda 120m² butik mağaza iç mimarlık projesi. Lüks vitrin düzenlemesi ve modern tasarım.', '2024-02-14'],
            ['Modern Konut Projesi', 'Konut', 13, '150m² modern daire tam dekorasyon projesi. Açık mutfak, geniş salon ve özel tasarım mobilyalar.', '2023-12-28']
        ];

        for (const project of projects) {
            await connection.query(
                'INSERT INTO projects (title, category, category_id, description, date) VALUES (?, ?, ?, ?, ?)',
                project
            );
        }

        // 4. Örnek resimler ekle
        console.log('5️⃣ Adding project images...');

        const images = [
            [1, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 1],
            [1, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 2],
            [2, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 1],
            [2, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 2],
            [3, 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800', 1],
            [3, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', 2],
            [4, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 1],
            [4, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', 2],
            [5, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', 1],
            [5, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 2],
            [6, 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800', 1],
            [6, 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800', 2],
            [7, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 1],
            [7, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 2],
            [8, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', 1],
            [8, 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', 2],
            [9, 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800', 1],
            [9, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 2]
        ];

        for (const image of images) {
            await connection.query(
                'INSERT INTO project_images (project_id, image_url, display_order) VALUES (?, ?, ?)',
                image
            );
        }

        console.log('\n✅ Database schema fixed successfully!');
        console.log('📊 Added 9 realistic projects with images');
        console.log('🎉 Ready to use!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

fixDatabaseSchema();
