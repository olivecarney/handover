'use client';

import { Image as ImageIcon, Upload } from 'lucide-react';
import Image from 'next/image';

interface FieldEditorProps {
    label: string;
    value: any;
    onChange: (value: any) => void;
    onOpenMediaLibrary: (onSelect: (url: string) => void) => void;
}

export default function FieldEditor({ label, value, onChange, onOpenMediaLibrary }: FieldEditorProps) {
    const isLongText = label.toLowerCase().includes('text') ||
        label.toLowerCase().includes('description') ||
        label.toLowerCase().includes('bio');

    // Simple heuristic for color: if value looks like a hex or rgb, or label has 'color'
    const isColor = label.toLowerCase().includes('color') ||
        (typeof value === 'string' && value.startsWith('#') && (value.length === 4 || value.length === 7));

    const isImage = label.toLowerCase().includes('image') ||
        label.toLowerCase().includes('logo') ||
        label.toLowerCase().includes('photo') ||
        label.toLowerCase().includes('icon');

    if (isImage) {
        return (
            <div className="flex items-center gap-4 rounded-lg border p-4 bg-muted/20">
                {value && (
                    <div className="relative w-24 h-24 rounded-md overflow-hidden border bg-background flex-shrink-0">
                        <Image src={value as string} alt="Preview" fill className="object-cover" />
                    </div>
                )}
                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => onOpenMediaLibrary((url) => onChange(url))}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        >
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Select from Library
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground break-all">{value}</p>
                </div>
            </div>
        );
    }

    if (isColor) {
        return (
            <div className="flex gap-2 items-center">
                <div className="relative flex-shrink-0">
                    <input
                        type="color"
                        value={value === 'transparent' ? '#ffffff' : value as string}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-10 w-10 p-0 border rounded cursor-pointer opacity-0 absolute inset-0 z-10"
                    />
                    <div
                        className="h-10 w-10 rounded border shadow-sm"
                        style={{ backgroundColor: value === 'transparent' ? 'white' : value as string }}
                    />
                </div>
                <input
                    type="text"
                    value={value as string}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="transparent or #hex"
                />
            </div>
        );
    }

    if (isLongText) {
        return (
            <textarea
                value={value as string}
                onChange={(e) => onChange(e.target.value)}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
        );
    }

    return (
        <input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
    );
}
