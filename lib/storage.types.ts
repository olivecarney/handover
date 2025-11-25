import { ContentData } from './content';

export interface StorageAdapter {
    getContent(): Promise<ContentData>;
    updateContent(data: ContentData): Promise<void>;
    uploadImage(file: File): Promise<string>;
}
