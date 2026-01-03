import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        try {
            await pool.query(`
        ALTER TABLE contact_info
        ADD COLUMN map_embed_url TEXT
        `);
        } catch (e: any) {
            if (!e.message.includes("Duplicate column name")) {
                throw e;
            }
        }

        return NextResponse.json({ success: true, message: 'Migration successful' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
