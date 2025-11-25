'use client';

import { useState } from 'react';
import { ContentData } from '@/lib/content';
import Image from 'next/image';
import { toast } from 'sonner';
import { Save, Upload, ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardClient({ initialContent }: { initialContent: ContentData }) {
    const [content, setContent] = useState<ContentData>(initialContent);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('hero');
    const [expandedPortfolio, setExpandedPortfolio] = useState<number | null>(null);
    const [expandedTestimonials, setExpandedTestimonials] = useState<number | null>(null);

    const handleChange = (section: string, key: string, value: string) => {
        setContent((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const handleArrayChange = (section: 'portfolio' | 'testimonials', index: number, key: string, value: string) => {
        setContent((prev) => {
            const newArray = [...(prev[section] || [])];
            newArray[index] = { ...newArray[index], [key]: value };
            return { ...prev, [section]: newArray };
        });
    };

    const handleArrayAdd = (section: 'portfolio' | 'testimonials', newItem: any) => {
        setContent((prev) => ({
            ...prev,
            [section]: [...(prev[section] || []), newItem],
        }));
    };

    const handleArrayRemove = (section: 'portfolio' | 'testimonials', index: number) => {
        setContent((prev) => ({
            ...prev,
            [section]: (prev[section] || []).filter((_, i) => i !== index),
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

    // Dynamic tabs based on content keys
    const tabs = Object.keys(content).map(key => ({
        id: key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
    }));

    const renderGenericEditor = (section: string, data: any) => {
        if (typeof data !== 'object' || data === null) return null;

        return (
            <div className="grid gap-4">
                {Object.entries(data).map(([key, value]) => {
                    const isLongText = key.includes('text') || key.includes('description') || key.includes('bio');
                    const isColor = key.includes('color');
                    const isImage = key.includes('image');

                    return (
                        <div key={key} className="grid gap-2">
                            <label className="text-sm font-medium leading-none capitalize">{key.replace('_', ' ')}</label>

                            {isImage ? (
                                <div className="flex items-center gap-4 rounded-lg border p-4 bg-muted/50">
                                    {value && (
                                        <div className="relative w-24 h-24 rounded-md overflow-hidden border bg-background">
                                            <Image src={value as string} alt="Preview" fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <label className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload Image
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, section, key)}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            ) : isColor ? (
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={value === 'transparent' ? '#ffffff' : value as string}
                                            onChange={(e) => handleChange(section, key, e.target.value)}
                                            className="h-10 w-10 p-0 border rounded cursor-pointer opacity-0 absolute inset-0"
                                        />
                                        <div
                                            className="h-10 w-10 rounded border shadow-sm"
                                            style={{ backgroundColor: value === 'transparent' ? 'white' : value as string }}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={value as string}
                                        onChange={(e) => handleChange(section, key, e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        placeholder="transparent or #hex"
                                    />
                                </div>
                            ) : isLongText ? (
                                <textarea
                                    value={value as string}
                                    onChange={(e) => handleChange(section, key, e.target.value)}
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={value as string}
                                    onChange={(e) => handleChange(section, key, e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

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
                        {tabs.map((tab) => (
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
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="text-2xl font-semibold leading-none tracking-tight capitalize">{activeTab.replace('_', ' ')}</h3>
                            <p className="text-sm text-muted-foreground">Manage {activeTab.replace('_', ' ')} settings.</p>
                        </div>
                        <div className="p-6 pt-0">
                            {/* Array Types (Portfolio, Testimonials) */}
                            {Array.isArray(content[activeTab]) ? (
                                <div className="space-y-4">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleArrayAdd(activeTab as 'portfolio' | 'testimonials', { id: Date.now().toString() })}
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-3"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Item
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {content[activeTab].map((item: any, index: number) => (
                                            <div key={item.id || index} className="border rounded-lg overflow-hidden">
                                                <div
                                                    className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                                                    onClick={() => {
                                                        if (activeTab === 'portfolio') setExpandedPortfolio(expandedPortfolio === index ? null : index);
                                                        if (activeTab === 'testimonials') setExpandedTestimonials(expandedTestimonials === index ? null : index);
                                                    }}
                                                >
                                                    <span className="font-medium">{item.title || item.author || 'Untitled'}</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleArrayRemove(activeTab as 'portfolio' | 'testimonials', index);
                                                            }}
                                                            className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                        {(activeTab === 'portfolio' ? expandedPortfolio : expandedTestimonials) === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                    </div>
                                                </div>
                                                {(activeTab === 'portfolio' ? expandedPortfolio : expandedTestimonials) === index && (
                                                    <div className="p-4 border-t space-y-4 bg-card">
                                                        {Object.entries(item).map(([key, value]) => {
                                                            if (key === 'id') return null;
                                                            return (
                                                                <div key={key} className="grid gap-2">
                                                                    <label className="text-sm font-medium leading-none capitalize">{key}</label>
                                                                    <input
                                                                        type="text"
                                                                        value={value as string}
                                                                        onChange={(e) => handleArrayChange(activeTab as 'portfolio' | 'testimonials', index, key, e.target.value)}
                                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : typeof content[activeTab] === 'object' ? (
                                renderGenericEditor(activeTab, content[activeTab])
                            ) : (
                                // Simple String/Number values (e.g. brand_name)
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none capitalize">{activeTab.replace('_', ' ')}</label>
                                    <input
                                        type="text"
                                        value={content[activeTab] as string}
                                        onChange={(e) => {
                                            setContent(prev => ({ ...prev, [activeTab]: e.target.value }));
                                        }}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

