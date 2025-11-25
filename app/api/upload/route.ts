import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/content';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const requireAuth = process.env.REQUIRE_AUTH === 'true';

    if (requireAuth) {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get('auth');
        if (authCookie?.value !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const url = await uploadImage(file);

        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
