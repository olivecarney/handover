import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    try {
        if (!fs.existsSync(uploadsDir)) {
            return NextResponse.json([]);
        }

        const files = fs.readdirSync(uploadsDir).filter(file => {
            return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file);
        });

        const fileData = files.map(file => ({
            name: file,
            path: `/uploads/${file}`,
        }));

        return NextResponse.json(fileData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to list media' }, { status: 500 });
    }
}
