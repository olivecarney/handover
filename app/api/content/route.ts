import { NextResponse } from 'next/server';
import { getContent, updateContent } from '@/lib/content';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const data = await getContent();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const requireAuth = process.env.REQUIRE_AUTH === 'true';

    if (requireAuth) {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get('auth');
        // In a real app, use a secure session token. 
        // Here we compare against the env var for simplicity as per requirements.
        if (authCookie?.value !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        const body = await request.json();
        await updateContent(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }
}
