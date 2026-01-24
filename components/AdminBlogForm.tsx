"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type BlogPostData = {
    title: string;
    slug: string;
    date: string;
    author: string;
    excerpt: string;
    content: string;
    image?: string;
    seoTitle?: string;
    seoDescription?: string;
    tags?: string[];
};

export default function AdminBlogForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const [uploading, setUploading] = useState(false);
    const [tagInput, setTagInput] = useState(initialData?.tags?.join(', ') || '');

    const [formData, setFormData] = useState<BlogPostData>(initialData || {
        title: '',
        slug: '',
        date: new Date().toISOString().split('T')[0],
        author: 'Ryan',
        excerpt: '',
        content: '',
        image: '',
        seoTitle: '',
        seoDescription: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: data });
            if (!res.ok) throw new Error('Upload failed');
            const json = await res.json();
            setFormData(prev => ({ ...prev, image: json.url }));
        } catch (err) {
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const insertFormat = (tag: string) => {
        if (!contentRef.current) return;
        const start = contentRef.current.selectionStart;
        const end = contentRef.current.selectionEnd;
        const text = formData.content;
        const before = text.substring(0, start);
        const after = text.substring(end);
        const selection = text.substring(start, end);

        // Simple insertion logic
        let newText = '';
        if (tag === 'bold') newText = `${before}**${selection || 'bold text'}**${after}`;
        if (tag === 'italic') newText = `${before}_${selection || 'italic text'}_${after}`;
        if (tag === 'h2') newText = `${before}\n## ${selection || 'Heading 2'}\n${after}`;
        if (tag === 'h3') newText = `${before}\n### ${selection || 'Heading 3'}\n${after}`;
        if (tag === 'list') newText = `${before}\n- ${selection || 'List Item'}\n${after}`;
        if (tag === 'link') newText = `${before}[${selection || 'Link Text'}](url)${after}`;
        if (tag === 'quote') newText = `${before}\n> ${selection || 'Quote'}\n${after}`;

        setFormData(prev => ({ ...prev, content: newText }));

        // Bring focus back
        setTimeout(() => contentRef.current?.focus(), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = initialData ? `/api/blog/${initialData.id}` : '/api/blog';
            const method = initialData ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                tags: tagInput.split(',').map((t: string) => t.trim()).filter(Boolean)
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin/blog');
                router.refresh();
            } else {
                alert('Failed to save post');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving post');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#222', padding: '2rem', borderRadius: '8px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, textTransform: 'uppercase', color: 'var(--primary-color)' }}>{initialData ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
                <div style={{ padding: '0.5rem 1rem', backgroundColor: '#333', borderRadius: '4px', fontSize: '0.8rem', color: '#888' }}>
                    Dark Mode Editor
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem', alignItems: 'start' }}>

                {/* Main Content Column */}
                <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input required name="title" value={formData.title} onChange={handleChange} placeholder="Enter Article Title..." className="form-input" style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '1rem' }} />
                    </div>

                    <div style={{ marginBottom: '1.5rem', border: '1px solid #444', borderRadius: '4px', backgroundColor: '#333' }}>
                        {/* Editor Toolbar */}
                        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', borderBottom: '1px solid #444', backgroundColor: '#2a2a2a', flexWrap: 'wrap' }}>
                            <button type="button" onClick={() => insertFormat('h2')} className="toolbar-btn">H2</button>
                            <button type="button" onClick={() => insertFormat('h3')} className="toolbar-btn">H3</button>
                            <div style={{ width: '1px', backgroundColor: '#444', margin: '0 0.25rem' }}></div>
                            <button type="button" onClick={() => insertFormat('bold')} className="toolbar-btn" style={{ fontWeight: 'bold' }}>B</button>
                            <button type="button" onClick={() => insertFormat('italic')} className="toolbar-btn" style={{ fontStyle: 'italic' }}>I</button>
                            <div style={{ width: '1px', backgroundColor: '#444', margin: '0 0.25rem' }}></div>
                            <button type="button" onClick={() => insertFormat('list')} className="toolbar-btn">List</button>
                            <button type="button" onClick={() => insertFormat('quote')} className="toolbar-btn">Quote</button>
                            <div style={{ width: '1px', backgroundColor: '#444', margin: '0 0.25rem' }}></div>
                            <button type="button" onClick={() => insertFormat('link')} className="toolbar-btn">Link</button>
                        </div>

                        <textarea
                            ref={contentRef}
                            required
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="form-input"
                            style={{
                                minHeight: '600px',
                                fontFamily: 'monospace',
                                lineHeight: '1.6',
                                border: 'none',
                                resize: 'vertical',
                                padding: '1rem'
                            }}
                            placeholder="Write your article here... Markdown supported."
                        />
                    </div>
                </div>

                {/* Sidebar Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* PUBLISH ACTION */}
                    <div className="sidebar-card">
                        <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            {initialData ? 'UPDATE POST' : 'PUBLISH POST'}
                        </button>
                    </div>

                    {/* COVER IMAGE */}
                    <div className="sidebar-card">
                        <h3 className="sidebar-title">Cover Image</h3>
                        <div style={{ marginBottom: '1rem', border: '2px dashed #444', borderRadius: '4px', overflow: 'hidden', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor: '#222' }}>
                            {formData.image ? (
                                <Image src={formData.image} alt="Cover" fill style={{ objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: '#666' }}>No Image Selected</span>
                            )}
                            {uploading && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Uploading...</div>}
                        </div>
                        <input type="file" onChange={handleImageUpload} accept="image/*" className="form-input" style={{ fontSize: '0.8rem' }} />
                    </div>

                    {/* GENERAL SETTINGS */}
                    <div className="sidebar-card">
                        <h3 className="sidebar-title">Post Settings</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Slug</label>
                            <input name="slug" value={formData.slug} onChange={handleChange} placeholder="auto-generated" className="form-input" style={{ fontSize: '0.9rem' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Publish Date</label>
                            <input required type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Author</label>
                            <input required name="author" value={formData.author} onChange={handleChange} className="form-input" />
                        </div>
                    </div>

                    {/* SEO & METADATA */}
                    <div className="sidebar-card">
                        <h3 className="sidebar-title">SEO & Metadata</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Meta Title</label>
                            <input name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="Browser tab title..." className="form-input" />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Meta Description</label>
                            <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} placeholder="Search engine summary..." className="form-input" style={{ minHeight: '80px' }} />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="form-label">Tags (comma separated)</label>
                            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="News, Update, Service..." className="form-input" />
                        </div>
                    </div>

                    <div className="sidebar-card">
                        <h3 className="sidebar-title">Excerpt</h3>
                        <textarea required name="excerpt" value={formData.excerpt} onChange={handleChange} className="form-input" style={{ minHeight: '100px', fontSize: '0.9rem' }} placeholder="Short summary for preview cards..." />
                    </div>

                </div>
            </div>

            <style jsx global>{`
                .sidebar-card {
                    background-color: #1a1a1a;
                    padding: 1.5rem;
                    border-radius: 8px;
                    border: 1px solid #333;
                }
                .sidebar-title {
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem; 
                    border-bottom: 1px solid #333; 
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    color: #888;
                    letter-spacing: 1px;
                }
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #444;
                    background-color: #333;
                    color: #fff;
                    border-radius: 4px;
                    margin-top: 0.25rem;
                }
                .form-input:focus {
                    border-color: var(--primary-color);
                    outline: none;
                }
                .form-label {
                    display: block;
                    font-weight: bold;
                    font-size: 0.85rem;
                    color: #ccc;
                    margin-bottom: 0.25rem;
                }
                .toolbar-btn {
                    background-color: transparent;
                    border: none;
                    color: #ccc;
                    padding: 0.25rem 0.75rem;
                    cursor: pointer;
                    border-radius: 4px;
                    font-size: 0.9rem;
                }
                .toolbar-btn:hover {
                    background-color: #444;
                    color: #fff;
                }
            `}</style>
        </form>
    );
}
