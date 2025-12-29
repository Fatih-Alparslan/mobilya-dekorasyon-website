// Dosyayı base64 data URL olarak döndür (veritabanında BLOB olarak saklanacak)
export async function fileToDataURL(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';

    return `data:${mimeType};base64,${base64}`;
}

// Eski fonksiyon - artık kullanılmayacak ama backward compatibility için bırakıyoruz
export async function saveFile(file: File): Promise<string> {
    // Artık dosyayı diske kaydetmek yerine data URL döndürüyoruz
    return fileToDataURL(file);
}
