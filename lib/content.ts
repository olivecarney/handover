import fs from 'fs/promises';
import path from 'path';

const contentPath = path.join(process.cwd(), 'content.json');

export interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    image: string;
  };
  about: {
    title: string;
    text: string;
  };
  theme: {
    primary_color: string;
    secondary_color: string;
    background_color: string;
    text_color: string;
  };
  [key: string]: any; // Allow extensibility
}

export async function getContent(): Promise<ContentData> {
  try {
    const data = await fs.readFile(contentPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading content.json:', error);
    // Return default/empty structure if file missing (or throw)
    throw new Error('Failed to load content');
  }
}

export async function updateContent(newContent: ContentData): Promise<void> {
  try {
    await fs.writeFile(contentPath, JSON.stringify(newContent, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing content.json:', error);
    throw new Error('Failed to save content');
  }
}
