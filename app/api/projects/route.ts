import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/db';

export async function GET() {
    try {
        const projects = await getProjects();

        return NextResponse.json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error('Get projects error:', error);
        return NextResponse.json({
            success: false,
            message: 'Projeler yüklenemedi'
        }, { status: 500 });
    }
}
