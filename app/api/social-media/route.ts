
import { NextResponse } from 'next/server';
import { getSocialMediaAccounts } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const showAll = searchParams.get('all') === 'true';

        // getSocialMediaAccounts(onlyActive): if showAll is true, onlyActive should be false.
        const accounts = await getSocialMediaAccounts(!showAll);
        return NextResponse.json({ success: true, data: accounts });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
