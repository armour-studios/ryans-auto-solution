'use client';

import { useState, useEffect } from 'react';

type User = {
    username: string;
    role: 'admin' | 'editor' | 'staff' | 'marketing';
    createdAt: string;
};

const ROLE_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
    admin:     { label: 'Admin',     color: '#0f71b1', bg: 'rgba(15,113,177,0.15)',  border: 'rgba(15,113,177,0.3)'  },
    editor:    { label: 'Staff',     color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
    staff:     { label: 'Staff',     color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
    marketing: { label: 'Marketing', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)' },
};

function DeleteModal({ username, onConfirm, onCancel }: { username: string; onConfirm: () => void; onCancel: () => void }) {
    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
            <div style={{ backgroundColor: '#161616', borderRadius: '14px', padding: '2rem', maxWidth: '420px', width: '90%', border: '1px solid #2a2a2a', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: '700' }}>Delete User</h3>
                        <p style={{ margin: '0.2rem 0 0', color: '#555', fontSize: '0.78rem' }}>This action cannot be undone</p>
                    </div>
                </div>
                <p style={{ color: '#aaa', marginBottom: '1.75rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
                    You are about to permanently delete <strong style={{ color: '#fff' }}>{username}</strong>. They will immediately lose all access to the admin panel.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button onClick={onCancel} style={{ padding: '0.65rem 1.5rem', backgroundColor: '#1e1e1e', color: '#aaa', border: '1px solid #333', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} style={{ padding: '0.65rem 1.5rem', backgroundColor: '#c92a37', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Delete User
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [savingRole, setSavingRole] = useState<string | null>(null);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState<'admin' | 'editor' | 'marketing'>('editor');
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch { showToast('error', 'Failed to load users'); }
        finally { setLoading(false); }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }) });
            const data = await res.json();
            if (res.ok) { showToast('success', `User "${newUsername}" created`); setNewUsername(''); setNewPassword(''); setNewRole('editor'); setShowForm(false); fetchUsers(); }
            else { showToast('error', data.error || 'Failed to create user'); }
        } catch { showToast('error', 'An error occurred'); }
    };

    const handleRoleChange = async (username: string, role: string) => {
        setSavingRole(username);
        try {
            const res = await fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, role }) });
            const data = await res.json();
            if (res.ok) { setUsers(prev => prev.map(u => u.username === username ? { ...u, role: role as any } : u)); showToast('success', `${username} updated to ${role}`); }
            else { showToast('error', data.error || 'Failed to update role'); }
        } catch { showToast('error', 'Failed to update role'); }
        finally { setSavingRole(null); }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            const res = await fetch('/api/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: deleteTarget }) });
            const data = await res.json();
            if (res.ok) { setUsers(prev => prev.filter(u => u.username !== deleteTarget)); showToast('success', `"${deleteTarget}" deleted`); }
            else { showToast('error', data.error || 'Failed to delete user'); }
        } catch { showToast('error', 'An error occurred'); }
        finally { setDeleteTarget(null); }
    };

    const formatDate = (iso: string) => {
        try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
        catch { return '--'; }
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            {toast && (
                <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 10000, padding: '0.85rem 1.5rem', borderRadius: '10px', fontWeight: '600', fontSize: '0.88rem', backgroundColor: toast.type === 'success' ? '#0f2e1e' : '#2d0f0f', color: toast.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, boxShadow: '0 8px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {toast.type === 'success' ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                    {toast.msg}
                </div>
            )}
            {deleteTarget && <DeleteModal username={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />}

            <div style={{ maxWidth: '860px', margin: '0 auto' }}>
                {/* Page header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #1e1e1e' }}>
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.3rem' }}>User Management</h1>
                        <p style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{users.length} account{users.length !== 1 ? 's' : ''} &middot; Admin access only</p>
                    </div>
                    <button onClick={() => setShowForm(s => !s)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', border: showForm ? '1px solid #333' : 'none', backgroundColor: showForm ? 'transparent' : 'var(--primary-color)', color: showForm ? '#888' : '#fff' }}>
                        {showForm
                            ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Cancel</>
                            : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add User</>
                        }
                    </button>
                </div>

                {/* Add user form */}
                {showForm && (
                    <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #222', borderTop: '3px solid var(--primary-color)', padding: '1.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '3px', height: '16px', backgroundColor: 'var(--primary-color)', borderRadius: '2px' }} />
                            <span style={{ fontSize: '0.7rem', color: '#777', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>New Account</span>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px', gap: '1rem', marginBottom: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Username</label>
                                    <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="e.g. jsmith" required minLength={3} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #2a2a2a', backgroundColor: '#0d0d0d', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.currentTarget.style.borderColor = 'var(--primary-color)'} onBlur={e => e.currentTarget.style.borderColor = '#2a2a2a'} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '8px', border: '1px solid #2a2a2a', backgroundColor: '#0d0d0d', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.currentTarget.style.borderColor = 'var(--primary-color)'} onBlur={e => e.currentTarget.style.borderColor = '#2a2a2a'} />
                                        <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                            {showPassword ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.68rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Role</label>
                                    <select value={newRole} onChange={e => setNewRole(e.target.value as 'admin' | 'editor' | 'marketing')} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #2a2a2a', backgroundColor: '#0d0d0d', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}>
                                        <option value="editor">Staff</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" style={{ padding: '0.7rem 2rem', backgroundColor: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Create User</button>
                        </form>
                    </div>
                )}

                {/* Users table */}
                <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #1e1e1e', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px 140px 110px', padding: '0.8rem 1.5rem', backgroundColor: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
                        {['User', 'Role', 'Created', 'Actions'].map(h => <span key={h} style={{ fontSize: '0.62rem', color: '#3a3a3a', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>{h}</span>)}
                    </div>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#444', fontSize: '0.85rem' }}>Loading...</div>
                    ) : users.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#444', fontSize: '0.85rem' }}>No users found</div>
                    ) : users.map((user, i) => {
                        const rm = ROLE_META[user.role] || ROLE_META.editor;
                        return (
                            <div key={user.username} style={{ display: 'grid', gridTemplateColumns: '1fr 170px 140px 110px', padding: '0.9rem 1.5rem', borderTop: i === 0 ? 'none' : '1px solid #181818', alignItems: 'center', transition: 'background 0.15s' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#141414'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: rm.bg, border: `1px solid ${rm.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: rm.color }}>{user.username.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span style={{ fontWeight: '700', color: '#ddd', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.username}</span>
                                </div>
                                <div>
                                    <select value={user.role} disabled={savingRole === user.username} onChange={e => handleRoleChange(user.username, e.target.value)}
                                        style={{ padding: '0.32rem 0.6rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: '700', backgroundColor: rm.bg, color: rm.color, border: `1px solid ${rm.border}`, cursor: savingRole === user.username ? 'wait' : 'pointer', outline: 'none', opacity: savingRole === user.username ? 0.5 : 1 }}>
                                        <option value="editor">Staff</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div style={{ color: '#444', fontSize: '0.76rem' }}>{formatDate(user.createdAt)}</div>
                                <div>
                                    <button onClick={() => setDeleteTarget(user.username)}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.32rem 0.75rem', backgroundColor: 'transparent', border: '1px solid #252525', color: '#555', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.2s' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ef4444'; (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#252525'; (e.currentTarget as HTMLElement).style.color = '#555'; }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Role legend */}
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Admin',     desc: 'Full access including user management',         color: '#0f71b1' },
                        { label: 'Staff',     desc: 'Inventory, blog, and testimonials only',          color: '#10b981' },
                        { label: 'Marketing', desc: 'Publishing Hub and social media management only', color: '#8b5cf6' },
                    ].map(r => (
                        <div key={r.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                            <div style={{ width: '3px', height: '15px', backgroundColor: r.color, borderRadius: '2px', marginTop: '0.15rem', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: r.color, textTransform: 'uppercase', letterSpacing: '1px' }}>{r.label}</div>
                                <div style={{ fontSize: '0.68rem', color: '#444' }}>{r.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
