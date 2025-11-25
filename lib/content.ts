import { StorageAdapter } from './storage.types';
import { LocalAdapter } from './adapters/local-adapter';

export interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    image: string;
    background_color: string;
  };
  about: {
    title: string;
    text: string;
    background_color: string;
  };
  portfolio: {
    id: string;
    title: string;
    category: string;
    image: string;
  }[];
  theme: {
    primary_color: string;
    secondary_color: string;
    background_color: string;
    text_color: string;
  };
  brand_name: string;
  testimonials: {
    id: string;
    quote: string;
    author: string;
    role: string;
  }[];
  [key: string]: any; // Allow extensibility
}

// Factory to get the correct adapter
function getAdapter(): StorageAdapter {
  const adapterType = process.env.STORAGE_ADAPTER || 'local';

  switch (adapterType) {
    case 'local':
      return new LocalAdapter();
    // Future adapters (e.g., 's3', 'vercel-blob') go here
    default:
      console.warn(`Unknown adapter '${adapterType}', falling back to local.`);
      return new LocalAdapter();
  }
}

const adapter = getAdapter();

export async function getContent(): Promise<ContentData> {
  return adapter.getContent();
}

export async function updateContent(newContent: ContentData): Promise<void> {
  return adapter.updateContent(newContent);
}

export async function uploadImage(file: File): Promise<string> {
  return adapter.uploadImage(file);
}
