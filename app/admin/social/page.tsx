'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ── Types ────────────────────────────────────────────────
type Platform = 'facebook' | 'instagram' | 'google' | 'youtube';

type SocialPost = {
    id: number;
    type: 'vehicle' | 'blog' | 'custom';
    sourceId: number | null;
    title: string;
    content: string;
    image: string | null;
    platforms: Platform[];
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    scheduledAt: string | null;
    publishedAt: string | null;
    publishedIds: Record<string, string>;
    error: string | null;
    createdAt: string;
};

type SocialSettings = {
    autoPostVehicles: boolean;
    autoPostBlog: boolean;
    defaultPlatforms: Platform[];
    defaultVehicleTemplate: string;
    defaultBlogTemplate: string;
};

type ConnectionStatus = {
    facebook: { connected: boolean; pageName: string };
    instagram: { connected: boolean; username: string };
    youtube: { connected: boolean; channelName: string };
    google: { connected: boolean; email: string };
};

// ── Platform config ──────────────────────────────────────
const PLATFORM_META: Record<Platform, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
    facebook: {
        label: 'Facebook', color: '#1877f2', bg: 'rgba(24,119,242,0.12)', border: 'rgba(24,119,242,0.3)',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    },
    instagram: {
        label: 'Instagram', color: '#e1306c', bg: 'rgba(225,48,108,0.12)', border: 'rgba(225,48,108,0.3)',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
    },
    google: {
        label: 'Google Business', color: '#34a853', bg: 'rgba(52,168,83,0.12)', border: 'rgba(52,168,83,0.3)',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
    },
    youtube: {
        label: 'YouTube', color: '#ff0000', bg: 'rgba(255,0,0,0.1)', border: 'rgba(255,0,0,0.25)',
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    },
};

const STATUS_META = {
    draft:     { label: 'Draft',     color: '#888',    bg: 'rgba(136,136,136,0.12)', border: 'rgba(136,136,136,0.25)' },
    scheduled: { label: 'Scheduled', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
    published: { label: 'Published', color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)' },
    failed:    { label: 'Failed',    color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)'  },
};

// ── Sub-components ───────────────────────────────────────
function PlatformBadge({ platform }: { platform: Platform }) {
    const m = PLATFORM_META[platform];
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px', color: m.color, background: m.bg, border: `1px solid ${m.border}` }}>
            {m.icon}{m.label}
        </span>
    );
}

function StatusBadge({ status }: { status: SocialPost['status'] }) {
    const m = STATUS_META[status];
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: m.color, background: m.bg, border: `1px solid ${m.border}` }}>
            {m.label}
        </span>
    );
}

function PlatformCard({ platform, connected, detail, isAdmin = true }: { platform: Platform; connected: boolean; detail: string; isAdmin?: boolean }) {
    const m = PLATFORM_META[platform];
    return (
        <div style={{
            background: connected ? 'rgba(255,255,255,0.02)' : '#0f0f0f',
            border: `1px solid ${connected ? m.border : '#1a1a1a'}`,
            borderRadius: '12px', padding: '1rem 1.1rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            flex: '1 1 200px', minWidth: 0,
            boxShadow: connected ? `0 0 0 1px ${m.border}20, inset 0 1px 0 rgba(255,255,255,0.03)` : 'none',
            transition: 'border-color 0.2s',
        }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: connected ? m.bg : '#171717',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: connected ? m.color : '#333', flexShrink: 0,
                border: `1px solid ${connected ? m.border : '#222'}`,
            }}>
                {m.icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '0.73rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.9px', color: connected ? '#ddd' : '#444' }}>{m.label}</div>
                <div style={{ fontSize: '0.76rem', color: connected ? '#777' : '#333', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {connected ? detail || 'Connected' : 'Not connected'}
                </div>
            </div>
            <div style={{ flexShrink: 0 }}>
                {connected
                    ? <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'block', boxShadow: '0 0 8px rgba(16,185,129,0.7)' }} />
                        <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '700', letterSpacing: '0.5px' }}>LIVE</span>
                      </div>
                    : isAdmin
                        ? <Link href="/admin/settings" style={{ fontSize: '0.65rem', color: '#0f71b1', textDecoration: 'none', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', border: '1px solid rgba(15,113,177,0.3)', borderRadius: '5px', padding: '3px 9px', whiteSpace: 'nowrap', background: 'rgba(15,113,177,0.08)' }}>Connect</Link>
                        : <span style={{ fontSize: '0.65rem', color: '#444', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', border: '1px solid #252525', borderRadius: '5px', padding: '3px 9px', whiteSpace: 'nowrap' }}>Admin only</span>
                }
            </div>
        </div>
    );
}

// ── Compose Drawer ───────────────────────────────────────
function ComposeDrawer({
    onClose, onSubmit, vehicles, blogPosts, settings, connectedPlatforms,
}: {
    onClose: () => void;
    onSubmit: (post: Partial<SocialPost>) => Promise<void>;
    vehicles: { id: number; year: number; make: string; model: string; price: number; mileage: number; description: string; image: string }[];
    blogPosts: { id: number; title: string; slug: string; excerpt: string }[];
    settings: SocialSettings;
    connectedPlatforms: Platform[];
}) {
    const [type, setType] = useState<'vehicle' | 'blog' | 'custom'>('vehicle');
    const [sourceId, setSourceId] = useState<string>('');
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [platforms, setPlatforms] = useState<Platform[]>(settings.defaultPlatforms.filter(p => connectedPlatforms.includes(p)) as Platform[]);
    const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now');
    const [scheduledAt, setScheduledAt] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const BASE_URL = 'https://ryansautosolution.com';

    // Auto-fill content when vehicle/blog selected
    useEffect(() => {
        if (type === 'vehicle' && sourceId) {
            const v = vehicles.find(v => v.id.toString() === sourceId);
            if (v) {
                setTitle(`${v.year} ${v.make} ${v.model}`);
                setImage(v.image || null);
                const filled = settings.defaultVehicleTemplate
                    .replace('{{year}}', v.year.toString())
                    .replace('{{make}}', v.make)
                    .replace('{{model}}', v.model)
                    .replace('{{price}}', v.price.toLocaleString())
                    .replace('{{mileage}}', v.mileage.toLocaleString())
                    .replace('{{description}}', v.description?.slice(0, 100) || '')
                    .replace('{{url}}', `${BASE_URL}/inventory/${v.id}`);
                setContent(filled);
            }
        } else if (type === 'blog' && sourceId) {
            const b = blogPosts.find(b => b.id.toString() === sourceId);
            if (b) {
                setTitle(b.title);
                setImage(null);
                const filled = settings.defaultBlogTemplate
                    .replace('{{title}}', b.title)
                    .replace('{{excerpt}}', b.excerpt?.slice(0, 120) || '')
                    .replace('{{url}}', `${BASE_URL}/blog/${b.slug}`);
                setContent(filled);
            }
        } else if (type === 'custom') {
            setContent('');
            setTitle('');
            setImage(null);
        }
    }, [type, sourceId]);

    const togglePlatform = (p: Platform) => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

    const handleSubmit = async (publishNow: boolean) => {
        if (!content.trim()) return;
        setSubmitting(true);
        try {
            await onSubmit({
                type,
                sourceId: sourceId ? Number(sourceId) : null,
                title,
                content,
                image,
                platforms,
                scheduledAt: (!publishNow && scheduleMode === 'later' && scheduledAt) ? new Date(scheduledAt).toISOString() : null,
            });
            if (publishNow) {
                // after saving, trigger publish — handled by parent
            }
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9998, backdropFilter: 'blur(4px)' }} />
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(540px, 100vw)', background: '#0e0e0e', borderLeft: '1px solid #1e1e1e', zIndex: 9999, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#0e0e0e', zIndex: 1 }}>
                    <div>
                        <div style={{ fontSize: '1rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Compose Post</div>
                        <div style={{ fontSize: '0.72rem', color: '#444', marginTop: '2px' }}>Create and schedule a social media post</div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: '0.4rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Content Type */}
                    <div>
                        <label style={labelStyle}>Content Type</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {(['vehicle', 'blog', 'custom'] as const).map(t => {
                                const icons = {
                                    vehicle: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l3-4h8l3 4h1a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><circle cx="7.5" cy="17" r="2.5"/><circle cx="16.5" cy="17" r="2.5"/></svg>,
                                    blog: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
                                    custom: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
                                };
                                return (
                                    <button key={t} onClick={() => { setType(t); setSourceId(''); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.6rem', borderRadius: '8px', border: `1px solid ${type === t ? '#0f71b1' : '#222'}`, background: type === t ? 'rgba(15,113,177,0.2)' : '#151515', color: type === t ? '#5bb8f5' : '#555', fontWeight: '800', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.15s', boxShadow: type === t ? '0 0 0 1px rgba(15,113,177,0.3)' : 'none' }}>
                                        {icons[t]}{t}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Source selector */}
                    {type === 'vehicle' && (
                        <div>
                            <label style={labelStyle}>Select Vehicle</label>
                            <select value={sourceId} onChange={e => setSourceId(e.target.value)} style={inputStyle}>
                                <option value="">— Choose a vehicle —</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} · ${v.price.toLocaleString()}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {type === 'blog' && (
                        <div>
                            <label style={labelStyle}>Select Blog Post</label>
                            <select value={sourceId} onChange={e => setSourceId(e.target.value)} style={inputStyle}>
                                <option value="">— Choose a post —</option>
                                {blogPosts.map(b => (
                                    <option key={b.id} value={b.id}>{b.title}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {type === 'custom' && (
                        <div>
                            <label style={labelStyle}>Post Title (internal label)</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Spring Sale Announcement" style={inputStyle} />
                        </div>
                    )}

                    {/* Image preview if vehicle */}
                    {image && (
                        <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a2a', maxHeight: '180px', position: 'relative' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image} alt="Preview" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                            <button onClick={() => setImage(null)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px' }}>×</button>
                        </div>
                    )}

                    {/* Content */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ ...labelStyle, marginBottom: 0 }}>Post Content</label>
                            <span style={{ fontSize: '0.7rem', color: content.length > 2000 ? '#ef4444' : '#555' }}>{content.length} / 2200</span>
                        </div>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={9}
                            placeholder="Write your post here..."
                            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                        />
                    </div>

                    {/* Platforms */}
                    <div>
                        <label style={labelStyle}>Publish To</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {(Object.keys(PLATFORM_META) as Platform[]).map(p => {
                                const connected = connectedPlatforms.includes(p);
                                const selected = platforms.includes(p);
                                const m = PLATFORM_META[p];
                                return (
                                    <button
                                        key={p}
                                        onClick={() => connected && togglePlatform(p)}
                                        disabled={!connected}
                                        title={!connected ? `${m.label} not connected` : undefined}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '0.45rem 0.9rem', borderRadius: '6px', cursor: connected ? 'pointer' : 'not-allowed',
                                            border: `1px solid ${selected ? m.border : '#2a2a2a'}`,
                                            background: selected ? m.bg : '#1a1a1a',
                                            color: selected ? m.color : '#444',
                                            fontWeight: '700', fontSize: '0.75rem', opacity: connected ? 1 : 0.4,
                                        }}
                                    >
                                        {m.icon}{m.label}{!connected && <span style={{ fontSize: '0.65rem' }}>(not connected)</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div>
                        <label style={labelStyle}>Timing</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            {(['now', 'later'] as const).map(m => {
                                const icons = {
                                    now: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                                    later: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                                };
                                return (
                                    <button key={m} onClick={() => setScheduleMode(m)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0.6rem', borderRadius: '8px', border: `1px solid ${scheduleMode === m ? '#0f71b1' : '#222'}`, background: scheduleMode === m ? 'rgba(15,113,177,0.2)' : '#151515', color: scheduleMode === m ? '#5bb8f5' : '#555', fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.15s', boxShadow: scheduleMode === m ? '0 0 0 1px rgba(15,113,177,0.3)' : 'none' }}>
                                        {icons[m]}{m === 'now' ? 'Publish Now' : 'Schedule'}
                                    </button>
                                );
                            })}
                        </div>
                        {scheduleMode === 'later' && (
                            <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} style={inputStyle} min={new Date().toISOString().slice(0, 16)} />
                        )}
                    </div>
                </div>

                {/* Footer actions */}
                <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #1e1e1e', display: 'flex', gap: '0.75rem', background: '#0d0d0d', position: 'sticky', bottom: 0 }}>
                    <button onClick={() => handleSubmit(false)} disabled={submitting || !content.trim()} style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid #252525', background: '#181818', color: !content.trim() ? '#333' : '#888', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', cursor: !content.trim() ? 'not-allowed' : 'pointer', letterSpacing: '0.8px' }}>
                        {scheduleMode === 'later' ? 'Add to Queue' : 'Save Draft'}
                    </button>
                    <button onClick={() => handleSubmit(true)} disabled={submitting || !content.trim() || platforms.length === 0} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '0.7rem', borderRadius: '8px', border: 'none', background: (!content.trim() || platforms.length === 0) ? '#181818' : 'linear-gradient(135deg, #0f71b1, #0a5a8e)', color: (!content.trim() || platforms.length === 0) ? '#333' : '#fff', fontWeight: '800', fontSize: '0.78rem', textTransform: 'uppercase', cursor: (!content.trim() || platforms.length === 0) ? 'not-allowed' : 'pointer', letterSpacing: '0.8px', boxShadow: (!content.trim() || platforms.length === 0) ? 'none' : '0 4px 16px rgba(15,113,177,0.4)' }}>
                        {submitting ? 'Publishing...' : scheduleMode === 'now'
                            ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Publish Now</>
                            : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Schedule Post</>}
                    </button>
                </div>
            </div>
        </>
    );
}

// ── Shared styles ─────────────────────────────────────────
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#0f71b1', marginBottom: '0.5rem' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.7rem 0.9rem', background: '#141414', border: '1px solid #252525', borderRadius: '8px', color: '#e0e0e0', fontSize: '0.88rem', boxSizing: 'border-box', outline: 'none' };

// ── Main Page ─────────────────────────────────────────────
export default function PublishingHubPage() {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [settings, setSettings] = useState<SocialSettings>({
        autoPostVehicles: false, autoPostBlog: false,
        defaultPlatforms: ['facebook'],
        defaultVehicleTemplate: '',
        defaultBlogTemplate: '',
    });
    const [connections, setConnections] = useState<ConnectionStatus>({
        facebook: { connected: false, pageName: '' },
        instagram: { connected: false, username: '' },
        youtube: { connected: false, channelName: '' },
        google: { connected: false, email: '' },
    });
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'queue' | 'published' | 'failed' | 'settings'>('queue');
    const [showCompose, setShowCompose] = useState(false);
    const [publishing, setPublishing] = useState<number | null>(null);
    const [savingSettings, setSavingSettings] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
    const [isAdmin, setIsAdmin] = useState(true); // default true; set from cookie on mount

    useEffect(() => {
        try {
            const match = document.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('admin_user='));
            if (match) {
                const session = JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')));
                setIsAdmin(session.role === 'admin');
            }
        } catch { /* keep default */ }
    }, []);

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4500);
    };

    const load = useCallback(async () => {
        const [socialRes, settingsRes, inventoryRes, blogRes] = await Promise.all([
            fetch('/api/social'),
            fetch('/api/settings'),
            fetch('/api/inventory'),
            fetch('/api/blog'),
        ]);
        const socialData = await socialRes.json();
        const settingsData = await settingsRes.json();
        const invData = await inventoryRes.json();
        const blgData = await blogRes.json();

        setPosts(socialData.queue || []);
        setSettings(prev => ({ ...prev, ...socialData.settings }));
        setVehicles((invData || []).filter((v: any) => v.status === 'Available'));
        setBlogPosts(blgData || []);

        // Parse connection status from settings
        setConnections({
            facebook:  { connected: settingsData.facebook?.connected === 'true' || settingsData.facebook?.connected === true,  pageName: settingsData.facebook?.pageName || '' },
            instagram: { connected: settingsData.instagram?.connected === 'true' || settingsData.instagram?.connected === true, username: settingsData.instagram?.username || '' },
            youtube:   { connected: settingsData.youtube?.connected === 'true' || settingsData.youtube?.connected === true,    channelName: settingsData.youtube?.channelName || '' },
            google:    { connected: settingsData.google?.connected === 'true' || settingsData.google?.connected === true,      email: settingsData.google?.email || '' },
        });
    }, []);

    useEffect(() => { load(); }, [load]);

    const connectedPlatforms = (Object.keys(connections) as Platform[]).filter(p => connections[p].connected);

    const handleCompose = async (post: Partial<SocialPost>) => {
        const res = await fetch('/api/social', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post),
        });
        if (!res.ok) { showToast('error', 'Failed to save post.'); return; }
        const saved = await res.json();
        setPosts(prev => [saved, ...prev]);
        // If "Publish Now" was requested, immediately publish
        if (!post.scheduledAt) {
            await handlePublish(saved.id);
        } else {
            showToast('success', 'Post scheduled successfully!');
        }
    };

    const handlePublish = async (id: number) => {
        setPublishing(id);
        try {
            const res = await fetch(`/api/social/publish/${id}`, { method: 'POST' });
            const updated = await res.json();
            setPosts(prev => prev.map(p => p.id === id ? updated : p));
            if (updated.status === 'published') {
                showToast('success', 'Post published successfully!');
                setActiveTab('published');
            } else {
                showToast('error', `Publish failed: ${updated.error}`);
            }
        } catch {
            showToast('error', 'Failed to publish.');
        } finally {
            setPublishing(null);
        }
    };

    const handleDelete = async (id: number) => {
        await fetch(`/api/social/${id}`, { method: 'DELETE' });
        setPosts(prev => prev.filter(p => p.id !== id));
        showToast('success', 'Post removed.');
    };

    const handleSaveSettings = async () => {
        setSavingSettings(true);
        await fetch('/api/social', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
        setSavingSettings(false);
        showToast('success', 'Settings saved.');
    };

    const filteredPosts = posts.filter(p => {
        const tabMatch =
            activeTab === 'queue'     ? (p.status === 'draft' || p.status === 'scheduled') :
            activeTab === 'published' ? p.status === 'published' :
            activeTab === 'failed'    ? p.status === 'failed' : true;
        const platMatch = platformFilter === 'all' || p.platforms.includes(platformFilter);
        return tabMatch && platMatch;
    });

    const counts = {
        queue:     posts.filter(p => p.status === 'draft' || p.status === 'scheduled').length,
        published: posts.filter(p => p.status === 'published').length,
        failed:    posts.filter(p => p.status === 'failed').length,
    };

    const tabStyle = (tab: string): React.CSSProperties => ({
        padding: '0.55rem 1.1rem', background: 'none', border: 'none', color: activeTab === tab ? '#fff' : '#555',
        fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.8px', cursor: 'pointer',
        borderBottom: `2px solid ${activeTab === tab ? '#0f71b1' : 'transparent'}`, transition: 'color 0.2s',
    });

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Toast */}
            {toast && (
                <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 10001, padding: '0.85rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.88rem', backgroundColor: toast.type === 'success' ? '#0f2e1e' : '#2d0f0f', color: toast.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, boxShadow: '0 8px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '0.6rem', maxWidth: '380px' }}>
                    {toast.type === 'success'
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    }
                    {toast.msg}
                </div>
            )}

            {showCompose && (
                <ComposeDrawer
                    onClose={() => setShowCompose(false)}
                    onSubmit={handleCompose}
                    vehicles={vehicles}
                    blogPosts={blogPosts}
                    settings={settings}
                    connectedPlatforms={connectedPlatforms}
                />
            )}

            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                {/* ── Page Header ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #1e1e1e' }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.3rem' }}>Publishing Hub</h1>
                        <p style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Schedule & publish to your connected social platforms</p>
                    </div>
                    <button onClick={() => setShowCompose(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.25rem', borderRadius: '8px', background: 'var(--primary-color)', color: '#fff', border: 'none', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Compose Post
                    </button>
                </div>

                {/* ── Platform Status Cards ── */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
                    <PlatformCard platform="facebook" connected={connections.facebook.connected} detail={connections.facebook.pageName} isAdmin={isAdmin} />
                    <PlatformCard platform="instagram" connected={connections.instagram.connected} detail={connections.instagram.username} isAdmin={isAdmin} />
                    <PlatformCard platform="youtube" connected={connections.youtube.connected} detail={connections.youtube.channelName} isAdmin={isAdmin} />
                    <PlatformCard platform="google" connected={connections.google.connected} detail={connections.google.email} isAdmin={isAdmin} />
                </div>

                {/* ── Stats Row ── */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                    {([
                        { label: 'In Queue', value: counts.queue, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)' },
                        { label: 'Published', value: counts.published, color: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)' },
                        { label: 'Failed', value: counts.failed, color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)' },
                        { label: 'Total Posts', value: posts.length, color: '#0f71b1', bg: 'rgba(15,113,177,0.06)', border: 'rgba(15,113,177,0.15)' },
                    ] as const).map(s => (
                        <div key={s.label} style={{ flex: '1 1 120px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: '10px', padding: '1rem 1.1rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ fontSize: '1.75rem', fontWeight: '900', color: s.color, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: '0.68rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px', fontWeight: '700' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Tabs ── */}
                <div style={{ display: 'flex', borderBottom: '1px solid #1e1e1e', marginBottom: '1.5rem', gap: 0 }}>
                    <button style={tabStyle('queue')} onClick={() => setActiveTab('queue')}>
                        Queue {counts.queue > 0 && <span style={{ marginLeft: '4px', background: '#f59e0b', color: '#000', borderRadius: '10px', padding: '0 6px', fontSize: '0.65rem', fontWeight: '800' }}>{counts.queue}</span>}
                    </button>
                    <button style={tabStyle('published')} onClick={() => setActiveTab('published')}>Published</button>
                    <button style={tabStyle('failed')} onClick={() => setActiveTab('failed')}>
                        Failed {counts.failed > 0 && <span style={{ marginLeft: '4px', background: '#ef4444', color: '#fff', borderRadius: '10px', padding: '0 6px', fontSize: '0.65rem', fontWeight: '800' }}>{counts.failed}</span>}
                    </button>
                    <button style={tabStyle('settings')} onClick={() => setActiveTab('settings')}>Settings</button>
                </div>

                {/* ── Posts Table ── */}
                {activeTab !== 'settings' && (
                    <>
                        {/* Filter bar */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: '#555', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Filter:</span>
                            {(['all', ...Object.keys(PLATFORM_META)] as (Platform | 'all')[]).map(p => (
                                <button key={p} onClick={() => setPlatformFilter(p)} style={{ padding: '3px 12px', borderRadius: '5px', border: `1px solid ${platformFilter === p ? '#0f71b1' : '#222'}`, background: platformFilter === p ? 'rgba(15,113,177,0.15)' : 'transparent', color: platformFilter === p ? '#4eaadc' : '#555', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', cursor: 'pointer' }}>
                                    {p === 'all' ? 'All' : PLATFORM_META[p as Platform].label}
                                </button>
                            ))}
                        </div>

                        {filteredPosts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#0c0c0c', border: '1px solid #161616', borderRadius: '14px' }}>
                                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#161616', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#333' }}>
                                    {activeTab === 'queue'
                                        ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                                        : activeTab === 'published'
                                        ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                    }
                                </div>
                                <p style={{ color: '#444', fontSize: '0.85rem', margin: '0 0 0.25rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                                    {activeTab === 'queue' ? 'Queue is empty' : activeTab === 'published' ? 'Nothing published yet' : 'No failures'}
                                </p>
                                <p style={{ color: '#333', fontSize: '0.78rem', margin: 0 }}>
                                    {activeTab === 'queue' ? 'Compose a post to add it to the queue.' : activeTab === 'published' ? 'Posts will appear here after publishing.' : 'All good — no failed posts.'}
                                </p>
                                {activeTab === 'queue' && (
                                    <button onClick={() => setShowCompose(true)} style={{ marginTop: '1.25rem', padding: '0.6rem 1.5rem', borderRadius: '8px', background: 'var(--primary-color)', color: '#fff', border: 'none', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.8px', cursor: 'pointer' }}>
                                        + Compose Post
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {filteredPosts.map(post => {
                                    const firstPlatform = post.platforms[0];
                                    const accentColor = firstPlatform ? PLATFORM_META[firstPlatform]?.color : '#333';
                                    return (
                                    <div key={post.id} style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr auto', borderLeft: `3px solid ${accentColor}` }}>
                                        <div style={{ padding: '1rem 1.25rem', minWidth: 0 }}>
                                            {/* Title row */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                                                <StatusBadge status={post.status} />
                                                <span style={{ fontSize: '0.7rem', color: '#3a3a3a', border: '1px solid #222', borderRadius: '3px', padding: '1px 6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
                                                    {post.type}
                                                </span>
                                                <span style={{ fontWeight: '700', color: '#ccc', fontSize: '0.88rem' }}>{post.title || 'Untitled'}</span>
                                            </div>

                                            {/* Content preview */}
                                            <p style={{ color: '#555', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 0.65rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                {post.content}
                                            </p>

                                            {/* Platforms + date */}
                                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                {post.platforms.map(p => <PlatformBadge key={p} platform={p} />)}
                                                <span style={{ fontSize: '0.68rem', color: '#383838', marginLeft: '0.25rem', fontWeight: '600' }}>
                                                    {post.status === 'published' && post.publishedAt
                                                        ? `Published ${new Date(post.publishedAt).toLocaleString()}`
                                                        : post.status === 'scheduled' && post.scheduledAt
                                                        ? `Scheduled for ${new Date(post.scheduledAt).toLocaleString()}`
                                                        : `Created ${new Date(post.createdAt).toLocaleDateString()}`
                                                    }
                                                </span>
                                            </div>

                                            {/* Error */}
                                            {post.error && (
                                                <div style={{ marginTop: '0.5rem', padding: '0.4rem 0.75rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: '6px', fontSize: '0.75rem', color: '#ef4444' }}>
                                                    {post.error}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '1rem 1rem 1rem 0', flexShrink: 0, justifyContent: 'center' }}>
                                            {(post.status === 'draft' || post.status === 'scheduled' || post.status === 'failed') && (
                                                <button
                                                    onClick={() => handlePublish(post.id)}
                                                    disabled={publishing === post.id}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', padding: '0.5rem 1rem', borderRadius: '7px', border: 'none', background: 'var(--primary-color)', color: '#fff', fontWeight: '700', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: publishing === post.id ? 'not-allowed' : 'pointer', opacity: publishing === post.id ? 0.6 : 1, whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(15,113,177,0.3)' }}
                                                >
                                                    {publishing === post.id ? 'Posting…' : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Publish</>}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                style={{ padding: '0.5rem 1rem', borderRadius: '7px', border: '1px solid #1e1e1e', background: 'transparent', color: '#3a3a3a', fontWeight: '700', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer' }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )})}
                            </div>
                        )}
                    </>
                )}

                {/* ── Settings Tab ── */}
                {activeTab === 'settings' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

                        {/* Auto-post toggles */}
                        <section style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 1rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#fff' }}>Auto-Publishing</h3>
                            <p style={{ margin: '0 0 1.25rem', color: '#555', fontSize: '0.82rem', lineHeight: 1.6 }}>
                                When enabled, new items will be automatically added to the publish queue when they are created or made available.
                            </p>
                            {[
                                { key: 'autoPostVehicles' as const, label: 'Auto-post new vehicles', desc: 'Queue a post whenever a vehicle status is set to Available' },
                                { key: 'autoPostBlog' as const, label: 'Auto-post new blog articles', desc: 'Queue a post whenever a new blog post is published' },
                            ].map(({ key, label, desc }) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 0', borderBottom: '1px solid #1e1e1e' }}>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#ccc', fontSize: '0.85rem' }}>{label}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '2px' }}>{desc}</div>
                                    </div>
                                    <button
                                        onClick={() => setSettings(s => ({ ...s, [key]: !s[key] }))}
                                        style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', background: settings[key] ? '#0f71b1' : '#2a2a2a', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}
                                    >
                                        <span style={{ position: 'absolute', top: '2px', left: settings[key] ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                                    </button>
                                </div>
                            ))}
                        </section>

                        {/* Default platforms */}
                        <section style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#fff' }}>Default Platforms</h3>
                            <p style={{ margin: '0 0 1rem', color: '#555', fontSize: '0.82rem' }}>Which platforms to pre-select when composing a new post.</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {(Object.keys(PLATFORM_META) as Platform[]).map(p => {
                                    const connected = connectedPlatforms.includes(p);
                                    const selected = settings.defaultPlatforms.includes(p);
                                    const m = PLATFORM_META[p];
                                    return (
                                        <button key={p} onClick={() => {
                                            if (!connected) return;
                                            setSettings(s => ({ ...s, defaultPlatforms: selected ? s.defaultPlatforms.filter(x => x !== p) : [...s.defaultPlatforms, p] }));
                                        }} disabled={!connected} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.9rem', borderRadius: '6px', border: `1px solid ${selected ? m.border : '#2a2a2a'}`, background: selected ? m.bg : '#1a1a1a', color: selected ? m.color : '#444', fontWeight: '700', fontSize: '0.75rem', cursor: connected ? 'pointer' : 'not-allowed', opacity: connected ? 1 : 0.4 }}>
                                            {m.icon}{m.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Message templates */}
                        <section style={{ background: '#141414', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#fff' }}>Post Templates</h3>
                            <p style={{ margin: '0 0 1.25rem', color: '#555', fontSize: '0.82rem', lineHeight: 1.6 }}>
                                Use <code style={{ background: '#1e1e1e', padding: '1px 5px', borderRadius: '3px', fontSize: '0.8rem', color: '#0f71b1' }}>{'{{variable}}'}</code> placeholders. Available: <code style={{ background: '#1e1e1e', padding: '1px 5px', borderRadius: '3px', fontSize: '0.8rem', color: '#888' }}>year make model price mileage description url</code> (vehicles) · <code style={{ background: '#1e1e1e', padding: '1px 5px', borderRadius: '3px', fontSize: '0.8rem', color: '#888' }}>title excerpt url</code> (blog)
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Vehicle Post Template</label>
                                    <textarea rows={7} value={settings.defaultVehicleTemplate} onChange={e => setSettings(s => ({ ...s, defaultVehicleTemplate: e.target.value }))} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.6, fontSize: '0.82rem' }} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Blog Post Template</label>
                                    <textarea rows={5} value={settings.defaultBlogTemplate} onChange={e => setSettings(s => ({ ...s, defaultBlogTemplate: e.target.value }))} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.6, fontSize: '0.82rem' }} />
                                </div>
                            </div>
                        </section>

                        <button onClick={handleSaveSettings} disabled={savingSettings} style={{ alignSelf: 'flex-start', padding: '0.7rem 2rem', borderRadius: '8px', background: 'var(--primary-color)', color: '#fff', border: 'none', fontWeight: '800', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: savingSettings ? 'not-allowed' : 'pointer', opacity: savingSettings ? 0.7 : 1 }}>
                            {savingSettings ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
