'use client';

import { useState } from 'react';
import { ContentData } from '@/lib/content';
import Image from 'next/image';
import { toast } from 'sonner';
import { Save, Upload, Palette, LayoutTemplate, Type, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardClient({ initialContent }: { initialContent: ContentData }) {
    const [content, setContent] = useState<ContentData>(initialContent);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');

    const handleChange = (section: string, key: string, value: string) => {
        setContent((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        const promise = fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content),
        });

        toast.promise(promise, {
            loading: 'Saving changes...',
            success: 'Changes saved successfully!',
            error: 'Failed to save changes.',
        });

        try {
            await promise;
        } catch (err) {
            // Error handled by toast
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, key: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const promise = fetch('/api/upload', {
            method: 'POST',
            body: formData,
        }).then(res => res.json());

        toast.promise(promise, {
            loading: 'Uploading image...',
            success: (data) => {
                if (data.url) {
                    handleChange(section, key, data.url);
                    return 'Image uploaded!';
                }
                throw new Error('Upload failed');
            },
            error: 'Upload failed.',
        });
    };

    const tabs = [
        { id: 'hero', label: 'Hero Section', icon: LayoutTemplate },
        { id: 'about', label: 'About Section', icon: Type },
        { id: 'theme', label: 'Theme Settings', icon: Palette },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your website content and appearance.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Push Changes'}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Tabs Sidebar (Desktop) / Topbar (Mobile) */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                                        activeTab === tab.id
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "hover:bg-muted text-muted-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    {/* Hero Tab */}
                    {activeTab === 'hero' && (
                        <div className="rounded-xl border bg-card text-card-foreground shadow">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">Hero Section</h3>
                                <p className="text-sm text-muted-foreground">Customize the main entry point of your site.</p>
                            </div>
                            <div className="p-6 pt-0 space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Title</label>
                                    <input
                                        type="text"
                                        value={content.hero.title}
                                        onChange={(e) => handleChange('hero', 'title', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none">Subtitle</label>
                                    <input
                                        type="text"
                                        value={content.hero.subtitle}
                                        onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium leading-none">CTA Text</label>
                                        <input
                                            type="text"
                                            value={content.hero.cta_text}
                                            onChange={(e) => handleChange('hero', 'cta_text', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium leading-none">CTA Link</label>
                                        <input
                                            type="text"
                                            value={content.hero.cta_link}
                                            onChange={(e) => handleChange('hero', 'cta_link', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none">Background Color</label>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <input
                                                type="color"
                                                value={content.hero.background_color === 'transparent' ? '#ffffff' : content.hero.background_color}
                                                onChange={(e) => handleChange('hero', 'background_color', e.target.value)}
                                                className="h-10 w-10 p-0 border rounded cursor-pointer opacity-0 absolute inset-0"
                                            />
                                            <div
                                                className="h-10 w-10 rounded border shadow-sm"
                                                style={{ backgroundColor: content.hero.background_color === 'transparent' ? 'white' : content.hero.background_color }}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={content.hero.background_color}
                                            onChange={(e) => handleChange('hero', 'background_color', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="transparent or #hex"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none">Hero Image</label>
                                    <div className="flex items-center gap-4 rounded-lg border p-4 bg-muted/50">
                                        {content.hero.image && (
                                            <div className="relative w-24 h-24 rounded-md overflow-hidden border bg-background">
                                                <Image src={content.hero.image} alt="Preview" fill className="object-cover" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload New Image
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, 'hero', 'image')}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div className="rounded-xl border bg-card text-card-foreground shadow">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">About Section</h3>
                                <p className="text-sm text-muted-foreground">Tell your story.</p>
                            </div>
                            <div className="p-6 pt-0 space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none">Title</label>
                                    <input
                                        type="text"
                                        value={content.about.title}
                                        onChange={(e) => handleChange('about', 'title', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none">Text</label>
                                    <textarea
                                        value={content.about.text}
                                        onChange={(e) => handleChange('about', 'text', e.target.value)}
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none">Background Color</label>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <input
                                                type="color"
                                                value={content.about.background_color === 'transparent' ? '#ffffff' : content.about.background_color}
                                                onChange={(e) => handleChange('about', 'background_color', e.target.value)}
                                                className="h-10 w-10 p-0 border rounded cursor-pointer opacity-0 absolute inset-0"
                                            />
                                            <div
                                                className="h-10 w-10 rounded border shadow-sm"
                                                style={{ backgroundColor: content.about.background_color === 'transparent' ? 'white' : content.about.background_color }}
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={content.about.background_color}
                                            onChange={(e) => handleChange('about', 'background_color', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="transparent or #hex"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Theme Tab */}
                    {activeTab === 'theme' && (
                        <div className="rounded-xl border bg-card text-card-foreground shadow">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">Theme Colors</h3>
                                <p className="text-sm text-muted-foreground">Manage your brand colors.</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(content.theme).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            <label className="text-sm font-medium leading-none capitalize">{key.replace('_', ' ')}</label>
                                            <div className="flex gap-2">
                                                <div className="relative">
                                                    <input
                                                        type="color"
                                                        value={value as string}
                                                        onChange={(e) => handleChange('theme', key, e.target.value)}
                                                        className="h-10 w-10 p-0 border rounded cursor-pointer opacity-0 absolute inset-0"
                                                    />
                                                    <div
                                                        className="h-10 w-10 rounded border shadow-sm"
                                                        style={{ backgroundColor: value as string }}
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={value as string}
                                                    onChange={(e) => handleChange('theme', key, e.target.value)}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

