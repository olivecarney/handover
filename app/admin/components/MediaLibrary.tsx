'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Check, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface MediaLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

interface MediaFile {
    name: string;
    path: string;
}

export default function MediaLibrary({ isOpen, onClose, onSelect }: MediaLibraryProps) {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
        }
    }, [isOpen]);

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/media');
            const data = await res.json();
            if (Array.isArray(data)) {
                setMedia(data);
            }
        } catch (error) {
            toast.error('Failed to load media');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.url) {
                toast.success('Image uploaded');
                fetchMedia(); // Refresh list
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl h-[80vh] bg-background rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        Media Library
                    </h3>
                    <div className="flex items-center gap-2">
                        <label className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <Upload className="w-4 h-4 mr-2" />
                            {uploading ? 'Uploading...' : 'Upload New'}
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                        </label>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">Loading media...</div>
                    ) : media.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                            <ImageIcon className="w-16 h-16 opacity-20" />
                            <p>No images found. Upload one to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {media.map((file) => (
                                <div
                                    key={file.path}
                                    className="group relative aspect-square bg-muted rounded-lg border overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all"
                                    onClick={() => onSelect(file.path)}
                                >
                                    <Image
                                        src={file.path}
                                        alt={file.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute bottom-0 left-0 right-0 p-2 text-xs bg-black/60 text-white truncate">
                                        {file.name}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                                            Select
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
