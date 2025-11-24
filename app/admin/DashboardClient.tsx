'use client';

import { useState } from 'react';
import { ContentData } from '@/lib/content';
import Image from 'next/image';

export default function DashboardClient({ initialContent }: { initialContent: ContentData }) {
    const [content, setContent] = useState<ContentData>(initialContent);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

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
        setMessage('');
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content),
            });
            if (res.ok) {
                setMessage('Saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Failed to save.');
            }
        } catch (err) {
            setMessage('Error saving content.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, key: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                handleChange(section, key, data.url);
            }
        } catch (err) {
            alert('Upload failed');
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Handover Admin</h1>
                <div className="flex items-center gap-4">
                    {message && <span className={message.includes('Failed') ? 'text-red-500' : 'text-green-500'}>{message}</span>}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Push Changes'}
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Hero Section */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Hero Section</h2>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={content.hero.title}
                                onChange={(e) => handleChange('hero', 'title', e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Subtitle</label>
                            <input
                                type="text"
                                value={content.hero.subtitle}
                                onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">CTA Text</label>
                                <input
                                    type="text"
                                    value={content.hero.cta_text}
                                    onChange={(e) => handleChange('hero', 'cta_text', e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">CTA Link</label>
                                <input
                                    type="text"
                                    value={content.hero.cta_link}
                                    onChange={(e) => handleChange('hero', 'cta_link', e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Hero Image</label>
                            <div className="flex items-center gap-4">
                                {content.hero.image && (
                                    <div className="relative w-20 h-20 border rounded overflow-hidden">
                                        <Image src={content.hero.image} alt="Preview" fill className="object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'hero', 'image')}
                                    className="text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">About Section</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={content.about.title}
                            onChange={(e) => handleChange('about', 'title', e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <label className="block text-sm font-medium mb-1">Text</label>
                        <textarea
                            value={content.about.text}
                            onChange={(e) => handleChange('about', 'text', e.target.value)}
                            className="w-full p-2 border rounded h-32"
                        />
                    </div>
                </section>

                {/* Theme Section */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Theme Colors</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(content.theme).map(([key, value]) => (
                            <div key={key}>
                                <label className="block text-sm font-medium mb-1 capitalize">{key.replace('_', ' ')}</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={value as string}
                                        onChange={(e) => handleChange('theme', key, e.target.value)}
                                        className="h-10 w-10 p-0 border rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={value as string}
                                        onChange={(e) => handleChange('theme', key, e.target.value)}
                                        className="w-full p-2 border rounded text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
