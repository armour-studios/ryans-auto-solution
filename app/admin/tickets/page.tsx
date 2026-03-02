'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface Ticket {
    id: string;
    title: string;
    description: string;
    page_url: string;
    category: 'bug' | 'glitch' | 'feature' | 'performance' | 'other';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    submitted_by: string;
    created_at: string;
    updated_at: string;
}

const PRIORITY_COLORS: Record<string, string> = {
    low: '#27ae60',
    medium: '#f39c12',
    high: '#e67e22',
    critical: '#e74c3c',
};

const STATUS_COLORS: Record<string, string> = {
    open: '#0f71b1',
    'in-progress': '#9b59b6',
    resolved: '#27ae60',
    closed: '#555',
};

const CATEGORY_LABELS: Record<string, string> = {
    bug: '🐛 Bug',
    glitch: '⚡ Visual Glitch',
    feature: '✨ Feature Request',
    performance: '🚀 Performance',
    other: '📋 Other',
};

function getUsername(): string {
    if (typeof document === 'undefined') return 'Admin';
    const value = `; ${document.cookie}`;
    const parts = value.split('; admin_user=');
    if (parts.length === 2) {
        try {
            const user = JSON.parse(decodeURIComponent(parts.pop()!.split(';').shift()!));
            return user.username || 'Admin';
        } catch { return 'Admin'; }
    }
    return 'Admin';
}

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default function TicketsPage() {
    const [view, setView] = useState<'new' | 'inbox'>('new');
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selected, setSelected] = useState<Ticket | null>(null);

    // Form state
    const [form, setForm] = useState({
        title: '',
        description: '',
        pageUrl: '',
        category: 'bug',
        priority: 'medium',
    });

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tickets');
            if (res.ok) setTickets(await res.json());
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (view === 'inbox') fetchTickets();
    }, [view, fetchTickets]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim()) {
            showToast('Title and description are required', false);
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, submittedBy: getUsername() }),
            });
            if (res.ok) {
                showToast('Ticket submitted successfully!');
                setForm({ title: '', description: '', pageUrl: '', category: 'bug', priority: 'medium' });
            } else {
                const err = await res.json();
                showToast(err.error || 'Failed to submit ticket', false);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (ticket: Ticket, status: string) => {
        await fetch('/api/tickets', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: ticket.id, status }),
        });
        fetchTickets();
        if (selected?.id === ticket.id) setSelected({ ...selected, status: status as Ticket['status'] });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this ticket? This cannot be undone.')) return;
        await fetch(`/api/tickets?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        setSelected(null);
        fetchTickets();
        showToast('Ticket deleted');
    };

    const filtered = statusFilter === 'all' ? tickets : tickets.filter(t => t.status === statusFilter);

    const counts = {
        open: tickets.filter(t => t.status === 'open').length,
        'in-progress': tickets.filter(t => t.status === 'in-progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length,
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '0.75rem 1rem',
        backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a',
        borderRadius: '8px', color: '#f4f4f9', fontSize: '0.9rem',
        outline: 'none', boxSizing: 'border-box',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.72rem', fontWeight: '700',
        color: '#888', textTransform: 'uppercase', letterSpacing: '1.2px',
        marginBottom: '0.5rem',
    };

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '1.5rem', right: '1.5rem',
                    padding: '0.85rem 1.4rem', borderRadius: '10px', zIndex: 9999,
                    backgroundColor: toast.ok ? '#0f71b1' : '#ef4444',
                    color: '#fff', fontSize: '0.88rem', fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    animation: 'fadeIn 0.2s ease',
                }}>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.4rem' }}>
                    Bug Reports &amp; Tickets
                </h1>
                <p style={{ color: '#666', fontSize: '0.82rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Report issues to the developer &middot; Synced to Discord
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                {(['new', 'inbox'] as const).map(tab => (
                    <button key={tab} onClick={() => setView(tab)} style={{
                        padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer',
                        border: view === tab ? '1px solid #0f71b1' : '1px solid #2a2a2a',
                        backgroundColor: view === tab ? 'rgba(15,113,177,0.15)' : 'transparent',
                        color: view === tab ? '#0f71b1' : '#888',
                        fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px',
                        transition: 'all 0.15s',
                    }}>
                        {tab === 'new' ? '+ New Ticket' : `Inbox${tickets.length > 0 ? ` (${tickets.length})` : ''}`}
                    </button>
                ))}
            </div>

            {/* ── NEW TICKET FORM ── */}
            {view === 'new' && (
                <div style={{ backgroundColor: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '2rem' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {/* Title */}
                            <div>
                                <label style={labelStyle}>Title *</label>
                                <input
                                    type="text"
                                    placeholder="Short description of the issue"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            {/* Category + Priority */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Category</label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        <option value="bug">🐛 Bug</option>
                                        <option value="glitch">⚡ Visual Glitch</option>
                                        <option value="feature">✨ Feature Request</option>
                                        <option value="performance">🚀 Performance</option>
                                        <option value="other">📋 Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Priority</label>
                                    <select
                                        value={form.priority}
                                        onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                                        style={inputStyle}
                                    >
                                        <option value="low">🟢 Low</option>
                                        <option value="medium">🟡 Medium</option>
                                        <option value="high">🟠 High</option>
                                        <option value="critical">🔴 Critical</option>
                                    </select>
                                </div>
                            </div>

                            {/* Affected Page */}
                            <div>
                                <label style={labelStyle}>Affected Page / URL</label>
                                <input
                                    type="text"
                                    placeholder="e.g., /inventory or https://ryansautosolution.com/blog"
                                    value={form.pageUrl}
                                    onChange={e => setForm(f => ({ ...f, pageUrl: e.target.value }))}
                                    style={inputStyle}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label style={labelStyle}>Description *</label>
                                <textarea
                                    placeholder="Describe the issue in detail. Include steps to reproduce, expected vs actual behavior, browser, device..."
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    rows={7}
                                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }}
                                    required
                                />
                            </div>

                            {/* Discord notice */}
                            <div style={{
                                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                                padding: '1rem', backgroundColor: 'rgba(15,113,177,0.06)',
                                border: '1px solid rgba(15,113,177,0.15)', borderRadius: '8px',
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f71b1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                <p style={{ margin: 0, fontSize: '0.82rem', color: '#777', lineHeight: '1.5' }}>
                                    This ticket will be sent to the <strong style={{ color: '#aaa' }}>developer&apos;s Discord</strong> and saved to the inbox for admin reference.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    padding: '0.85rem 2rem', backgroundColor: submitting ? '#333' : '#0f71b1',
                                    color: '#fff', border: 'none', borderRadius: '8px',
                                    fontSize: '0.88rem', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer',
                                    textTransform: 'uppercase', letterSpacing: '1.2px',
                                    transition: 'background 0.2s', alignSelf: 'flex-start',
                                }}
                            >
                                {submitting ? 'Submitting...' : 'Submit Ticket'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── INBOX ── */}
            {view === 'inbox' && (
                <div>
                    {/* Stats bar */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {Object.entries(counts).map(([status, count]) => (
                            <div key={status} style={{
                                backgroundColor: '#111', border: `1px solid ${statusFilter === status ? STATUS_COLORS[status] : '#1e1e1e'}`,
                                borderRadius: '10px', padding: '1rem', cursor: 'pointer',
                                transition: 'border-color 0.15s',
                            }} onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}>
                                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: STATUS_COLORS[status] }}>{count}</div>
                                <div style={{ fontSize: '0.68rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.2rem' }}>
                                    {status.replace('-', ' ')}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filter chips */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                        {['all', 'open', 'in-progress', 'resolved', 'closed'].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)} style={{
                                padding: '0.35rem 0.9rem', borderRadius: '20px', cursor: 'pointer',
                                border: statusFilter === s ? `1px solid ${s === 'all' ? '#0f71b1' : STATUS_COLORS[s]}` : '1px solid #2a2a2a',
                                backgroundColor: statusFilter === s ? (s === 'all' ? 'rgba(15,113,177,0.15)' : `${STATUS_COLORS[s]}20`) : 'transparent',
                                color: statusFilter === s ? (s === 'all' ? '#0f71b1' : STATUS_COLORS[s]) : '#666',
                                fontSize: '0.72rem', fontWeight: '600', textTransform: 'capitalize',
                            }}>
                                {s.replace('-', ' ')}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>Loading tickets...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom: '1rem' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            <p style={{ color: '#555', margin: 0, fontSize: '0.9rem' }}>No tickets found</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {filtered.map(ticket => (
                                <div key={ticket.id} onClick={() => setSelected(selected?.id === ticket.id ? null : ticket)} style={{
                                    backgroundColor: '#111', border: selected?.id === ticket.id ? '1px solid #0f71b1' : '1px solid #1e1e1e',
                                    borderRadius: '10px', padding: '1.1rem 1.25rem',
                                    cursor: 'pointer', transition: 'border-color 0.15s',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        {/* Priority dot */}
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: PRIORITY_COLORS[ticket.priority], flexShrink: 0 }} />
                                        <span style={{ color: '#fff', fontWeight: '600', fontSize: '0.92rem', flex: 1 }}>{ticket.title}</span>
                                        <span style={{
                                            padding: '0.2rem 0.65rem', borderRadius: '12px',
                                            backgroundColor: `${STATUS_COLORS[ticket.status]}20`,
                                            color: STATUS_COLORS[ticket.status],
                                            fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap',
                                        }}>
                                            {ticket.status.replace('-', ' ')}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#555' }}>{CATEGORY_LABELS[ticket.category]}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#444' }}>{ticket.id}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#444' }}>by {ticket.submitted_by}</span>
                                        <span style={{ fontSize: '0.75rem', color: '#444', marginLeft: 'auto' }}>{timeAgo(ticket.created_at)}</span>
                                    </div>

                                    {/* Expanded detail */}
                                    {selected?.id === ticket.id && (
                                        <div style={{ marginTop: '1.25rem', borderTop: '1px solid #1e1e1e', paddingTop: '1.25rem' }} onClick={e => e.stopPropagation()}>
                                            <p style={{ color: '#bbb', fontSize: '0.9rem', lineHeight: '1.7', whiteSpace: 'pre-wrap', margin: '0 0 1rem' }}>{ticket.description}</p>
                                            {ticket.page_url && (
                                                <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#555' }}>
                                                    <span style={{ color: '#444' }}>Page: </span>
                                                    <a href={ticket.page_url.startsWith('http') ? ticket.page_url : `/${ticket.page_url}`} target="_blank" rel="noreferrer" style={{ color: '#0f71b1', textDecoration: 'none' }}>
                                                        {ticket.page_url}
                                                    </a>
                                                </p>
                                            )}
                                            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#555' }}>Change status:</span>
                                                {['open', 'in-progress', 'resolved', 'closed'].map(s => (
                                                    <button key={s} onClick={() => handleStatusChange(ticket, s)} style={{
                                                        padding: '0.3rem 0.8rem', borderRadius: '6px', cursor: 'pointer',
                                                        border: `1px solid ${STATUS_COLORS[s]}`,
                                                        backgroundColor: ticket.status === s ? `${STATUS_COLORS[s]}30` : 'transparent',
                                                        color: STATUS_COLORS[s],
                                                        fontSize: '0.72rem', fontWeight: '600', textTransform: 'capitalize',
                                                    }}>
                                                        {s.replace('-', ' ')}
                                                    </button>
                                                ))}
                                                <button onClick={() => handleDelete(ticket.id)} style={{
                                                    marginLeft: 'auto', padding: '0.3rem 0.8rem', borderRadius: '6px',
                                                    cursor: 'pointer', border: '1px solid #ef4444',
                                                    backgroundColor: 'transparent', color: '#ef4444',
                                                    fontSize: '0.72rem', fontWeight: '600',
                                                }}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <style jsx global>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
                select option { background: #1a1a1a; }
                input::placeholder, textarea::placeholder { color: #444; }
            `}</style>
        </div>
    );
}
