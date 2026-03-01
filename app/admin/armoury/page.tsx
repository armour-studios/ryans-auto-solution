'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Article {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    source: string;
    category: string;
}

// SVG icons per category — no emojis
const CategoryIcon = ({ category, size = 12 }: { category: string; size?: number }) => {
    const s = { width: size, height: size, flexShrink: 0 as const };
    switch (category) {
        case 'US Market':
            return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
        case 'Used Car Market':
            return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
        case 'Industry News':
            return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>;
        case 'Article Ideas':
            return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><line x1="9" y1="21" x2="15" y2="21"/></svg>;
        case 'Industry Discussion':
            return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
        default:
            return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
    }
};

function timeAgo(dateStr: string): string {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    if (isNaN(diff)) return '';
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
}

export default function ArmouryPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

    const fetchArticles = useCallback(async (q = '', cat = '') => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (q) params.set('q', q);
            if (cat && cat !== 'All') params.set('category', cat);
            const res = await fetch(`/api/armoury?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setArticles(data.articles || []);
            setCategories(data.categories || []);
            setLastRefreshed(new Date());
        } catch {
            setError('Could not load articles. RSS feeds may be temporarily unavailable.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        fetchArticles(searchInput, activeCategory !== 'All' ? activeCategory : '');
    };

    const handleCategoryClick = (cat: string) => {
        setActiveCategory(cat);
        fetchArticles(search, cat !== 'All' ? cat : '');
    };

    const handleRefresh = () => {
        fetchArticles(search, activeCategory !== 'All' ? activeCategory : '');
    };

    const allCategories = ['All', ...categories];

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                        <img
                            src="/uploads/armourstudiospng.png"
                            alt="Armour Studios"
                            style={{ height: '26px', width: 'auto', maxWidth: '160px', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.85, display: 'block', flexShrink: 0 }}
                        />
                        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                            The Armoury
                        </h1>
                        <div style={{ padding: '0.2rem 0.65rem', borderRadius: '12px', backgroundColor: 'rgba(15,113,177,0.12)', border: '1px solid rgba(15,113,177,0.2)' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#0f71b1', textTransform: 'uppercase', letterSpacing: '1px' }}>News & Ideas</span>
                        </div>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.88rem', margin: 0 }}>
                        Industry news, market trends, and article ideas for the Canadian auto market.
                        {lastRefreshed && <span style={{ color: '#444', marginLeft: '0.5rem' }}>Updated {timeAgo(lastRefreshed.toISOString())}</span>}
                    </p>
                </div>
                <button onClick={handleRefresh} disabled={loading} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.1rem', borderRadius: '8px',
                    backgroundColor: loading ? 'transparent' : 'rgba(15,113,177,0.1)',
                    border: '1px solid rgba(15,113,177,0.25)',
                    color: loading ? '#444' : '#0f71b1',
                    fontSize: '0.78rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                    textTransform: 'uppercase', letterSpacing: '1px',
                    transition: 'all 0.15s',
                }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input
                        type="text"
                        placeholder="Search articles, topics, keywords..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        style={{
                            width: '100%', padding: '0.72rem 1rem 0.72rem 2.5rem',
                            backgroundColor: '#111', border: '1px solid #2a2a2a',
                            borderRadius: '8px', color: '#f4f4f9', fontSize: '0.9rem',
                            outline: 'none', boxSizing: 'border-box',
                        }}
                    />
                </div>
                <button type="submit" style={{
                    padding: '0.72rem 1.4rem', backgroundColor: '#0f71b1',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
                }}>
                    Search
                </button>
                {search && (
                    <button type="button" onClick={() => { setSearchInput(''); setSearch(''); fetchArticles('', activeCategory !== 'All' ? activeCategory : ''); }} style={{
                        padding: '0.72rem 1rem', backgroundColor: 'transparent',
                        color: '#888', border: '1px solid #2a2a2a', borderRadius: '8px',
                        fontSize: '0.82rem', cursor: 'pointer',
                    }}>
                        Clear
                    </button>
                )}
            </form>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {allCategories.map(cat => (
                    <button key={cat} onClick={() => handleCategoryClick(cat)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.4rem 0.9rem', borderRadius: '20px', cursor: 'pointer',
                        border: activeCategory === cat ? '1px solid #0f71b1' : '1px solid #2a2a2a',
                        backgroundColor: activeCategory === cat ? 'rgba(15,113,177,0.15)' : 'transparent',
                        color: activeCategory === cat ? '#0f71b1' : '#777',
                        fontSize: '0.78rem', fontWeight: '600',
                        transition: 'all 0.15s',
                    }}>
                        {cat !== 'All' && (
                            <span style={{ color: activeCategory === cat ? '#0f71b1' : '#555' }}>
                                <CategoryIcon category={cat} size={11} />
                            </span>
                        )}
                        {cat}
                    </button>
                ))}
            </div>

            {/* Tips banner (Article Ideas mode) */}
            {activeCategory === 'Article Ideas' && (
                <div style={{
                    marginBottom: '1.5rem', padding: '1rem 1.25rem',
                    backgroundColor: 'rgba(15,113,177,0.06)', border: '1px solid rgba(15,113,177,0.15)',
                    borderRadius: '10px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f71b1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><line x1="9" y1="21" x2="15" y2="21"/></svg>
                    <div>
                        <p style={{ margin: '0 0 0.35rem', fontSize: '0.85rem', fontWeight: '700', color: '#aaa' }}>Article Ideas Mode</p>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#666', lineHeight: '1.5' }}>
                            These articles are curated for topic inspiration. Use a headline or discussion as the basis for a blog post on your own site to drive SEO and local traffic.
                        </p>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{ padding: '1.5rem', backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', marginBottom: '1.5rem', color: '#ef4444', fontSize: '0.88rem' }}>
                    {error}
                </div>
            )}

            {/* Loading skeleton */}
            {loading && (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{ backgroundColor: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', padding: '1.25rem', animation: 'pulse 1.5s ease-in-out infinite' }}>
                            <div style={{ height: '16px', backgroundColor: '#1e1e1e', borderRadius: '4px', marginBottom: '0.6rem', width: `${60 + (i % 3) * 15}%` }} />
                            <div style={{ height: '12px', backgroundColor: '#1a1a1a', borderRadius: '4px', width: '40%' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Articles grid */}
            {!loading && !error && articles.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
                    <p style={{ color: '#555', margin: 0 }}>No articles found{search ? ` for "${search}"` : ''}.</p>
                </div>
            )}

            {!loading && articles.length > 0 && (
                <>
                    <p style={{ fontSize: '0.75rem', color: '#444', marginBottom: '1rem', letterSpacing: '0.5px' }}>
                        {articles.length} article{articles.length !== 1 ? 's' : ''}{search ? ` matching "${search}"` : ''}
                    </p>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {articles.map((article, i) => {
                            const cleanDesc = stripHtml(article.description).slice(0, 220);
                            return (
                                <a
                                    key={i}
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', display: 'block', minWidth: 0, overflow: 'hidden' }}
                                >
                                    <div
                                        style={{
                                            backgroundColor: '#111', border: '1px solid #1e1e1e', borderRadius: '10px',
                                            padding: '1rem 1.25rem', transition: 'border-color 0.15s, background 0.15s',
                                            overflow: 'hidden',
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0f71b1'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(15,113,177,0.04)'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1e1e1e'; (e.currentTarget as HTMLElement).style.backgroundColor = '#111'; }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', minWidth: 0 }}>
                                            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                        padding: '0.15rem 0.55rem', borderRadius: '10px',
                                                        backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a',
                                                        fontSize: '0.65rem', fontWeight: '600', color: '#666',
                                                        textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap',
                                                    }}>
                                                        <CategoryIcon category={article.category} size={10} />
                                                        {article.category}
                                                    </span>
                                                    <span style={{ fontSize: '0.7rem', color: '#444' }}>{article.source}</span>
                                                </div>
                                                <h3 style={{
                                                    margin: '0 0 0.4rem',
                                                    fontSize: '0.92rem', fontWeight: '600', color: '#e0e0e0', lineHeight: '1.4',
                                                    overflow: 'hidden', textOverflow: 'ellipsis',
                                                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                    wordBreak: 'break-word',
                                                }}>
                                                    {article.title}
                                                </h3>
                                                {cleanDesc && (
                                                    <p style={{
                                                        margin: 0, fontSize: '0.78rem', color: '#555', lineHeight: '1.5',
                                                        overflow: 'hidden', textOverflow: 'ellipsis',
                                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                        wordBreak: 'break-word',
                                                    }}>
                                                        {cleanDesc}
                                                    </p>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                                                <span style={{ fontSize: '0.68rem', color: '#444', whiteSpace: 'nowrap' }}>{timeAgo(article.pubDate)}</span>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </>
            )}

            <style jsx global>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                input::placeholder { color: #444; }
            `}</style>
        </div>
    );
}
