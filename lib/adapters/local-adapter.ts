import { StorageAdapter } from '../storage.types';
import { ContentData } from '../content';
import fs from 'fs/promises';
import path from 'path';

export class LocalAdapter implements StorageAdapter {
    private contentPath: string;
    private uploadDir: string;

    constructor() {
        this.contentPath = path.join(process.cwd(), 'content.json');
        this.uploadDir = path.join(process.cwd(), 'public/uploads');
    }

    async getContent(): Promise<ContentData> {
        try {
            const data = await fs.readFile(this.contentPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading content.json:', error);
            throw new Error('Failed to load content');
        }
    }

    async updateContent(newContent: ContentData): Promise<void> {
        try {
            await fs.writeFile(this.contentPath, JSON.stringify(newContent, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error writing content.json:', error);
            throw new Error('Failed to save content');
        }
    }

    async uploadImage(file: File): Promise<string> {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            throw new Error('Invalid file type. Only images are allowed.');
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File too large. Max 5MB.');
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure upload directory exists
        await fs.mkdir(this.uploadDir, { recursive: true });

        // Sanitize filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${safeName}`;
        const filepath = path.join(this.uploadDir, filename);

        await fs.writeFile(filepath, buffer);

        return `/uploads/${filename}`;
    }
}
