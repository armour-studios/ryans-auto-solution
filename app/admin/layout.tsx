'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ICONS: Record<string, React.ReactNode> = {
    overview: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    inventory: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    blog: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    testimonials: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    tools: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    users: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    tickets: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    armoury: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    social: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };
        try {
            const userCookie = getCookie('admin_user');
            if (userCookie) {
                const user = JSON.parse(decodeURIComponent(userCookie));
                setUserRole(user.role);
                setUsername(user.username);
            }
        } catch (err) {
            console.error('Failed to parse user cookie:', err);
        }
    }, []);

    // Close drawer on route change
    useEffect(() => { setIsSidebarOpen(false); }, [pathname]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    const navItems = [
        { label: 'Dashboard', href: '/admin', id: 'overview' },
        { label: 'Inventory', href: '/admin/inventory', id: 'inventory' },
        { label: 'Blog', href: '/admin/blog', id: 'blog' },
        { label: 'Testimonials', href: '/admin/testimonials', id: 'testimonials' },
        { label: 'Publishing Hub', href: '/admin/social', id: 'social' },
        { label: 'Website Tools', href: '/admin/tools/image-editor', id: 'tools' },
        { label: 'The Armoury', href: '/admin/armoury', id: 'armoury' },
        { label: 'Bug Reports', href: '/admin/tickets', id: 'tickets' },
    ];

    if (userRole === 'admin' || userRole === 'superadmin') {
        navItems.push({ label: 'Users', href: '/admin/users', id: 'users' });
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>

            {/* ── Desktop Sidebar ── */}
            <aside className="admin-sidebar" style={{
                width: '260px',
                backgroundColor: '#111',
                borderRight: '1px solid #1e1e1e',
                padding: '2rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                overflowY: 'auto',
            }}>
                {/* Brand */}
                <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #1e1e1e', textAlign: 'center' }}>
                    <Link href="/admin" style={{ display: 'block', textDecoration: 'none' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', lineHeight: 1.1 }}>
                            <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#fff', letterSpacing: '1px', textTransform: 'uppercase' }}>Ryan&apos;s</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0f71b1', letterSpacing: '1px', textTransform: 'uppercase' }}>Auto Solution</div>
                        </div>
                    </Link>
                    <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '0.5rem' }}>Admin Console</div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {navItems.map((item) => {
                            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <li key={item.id} style={{ marginBottom: '0.2rem' }}>
                                    <Link href={item.href} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.65rem',
                                        padding: '0.72rem 1rem',
                                        color: active ? '#fff' : '#aaa',
                                        backgroundColor: active ? 'rgba(15,113,177,0.12)' : 'transparent',
                                        borderRadius: '8px', textDecoration: 'none',
                                        fontWeight: active ? '700' : '500',
                                        fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px',
                                        borderLeft: active ? '3px solid #0f71b1' : '3px solid transparent',
                                        transition: 'all 0.15s',
                                    }}>
                                        <span style={{ color: active ? '#0f71b1' : '#555', flexShrink: 0 }}>{NAV_ICONS[item.id]}</span>
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin/settings" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        padding: '0.65rem 1rem', borderRadius: '8px', textDecoration: 'none',
                        color: '#fff',
                        backgroundColor: pathname.startsWith('/admin/settings') ? '#0a5d96' : '#0f71b1',
                        fontWeight: '700',
                        fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px',
                        transition: 'background-color 0.15s',
                        boxShadow: '0 2px 8px rgba(15,113,177,0.35)',
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        Site Settings
                    </Link>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', borderRadius: '8px', backgroundColor: '#fff', color: '#111', textDecoration: 'none', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', transition: 'opacity 0.2s' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Return to Site
                    </Link>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '0.65rem', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', transition: 'background 0.2s' }}>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Mobile Top Bar ── */}
            <header className="admin-mobile-bar" style={{
                display: 'none',
                position: 'fixed', top: 0, left: 0, right: 0, height: '58px',
                backgroundColor: '#111', borderBottom: '1px solid #1e1e1e',
                padding: '0 1.25rem', alignItems: 'center', justifyContent: 'space-between',
                zIndex: 200,
            }}>
                {/* Brand */}
                <Link href="/admin" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <Image
                        src="/uploads/ryansautowhite.png"
                        alt="Ryan's Auto Solution"
                        width={130}
                        height={44}
                        style={{ objectFit: 'contain', objectPosition: 'left', height: 'auto' }}
                        priority
                    />
                </Link>
                {/* Right: username chip + hamburger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {username && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.65rem', backgroundColor: 'rgba(15,113,177,0.12)', borderRadius: '20px', border: '1px solid rgba(15,113,177,0.25)' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#0f71b1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{username}</span>
                        </div>
                    )}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle menu" style={{
                        display: 'flex', flexDirection: 'column', gap: '5px',
                        background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px',
                        padding: '0.5rem', cursor: 'pointer', transition: 'border-color 0.2s',
                    }}>
                        <span style={{ display: 'block', width: '18px', height: '2px', background: '#f4f4f9', borderRadius: '2px', transition: 'transform 0.25s, opacity 0.25s', transform: isSidebarOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
                        <span style={{ display: 'block', width: '18px', height: '2px', background: '#f4f4f9', borderRadius: '2px', transition: 'opacity 0.25s', opacity: isSidebarOpen ? 0 : 1 }} />
                        <span style={{ display: 'block', width: '18px', height: '2px', background: '#f4f4f9', borderRadius: '2px', transition: 'transform 0.25s, opacity 0.25s', transform: isSidebarOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
                    </button>
                </div>
            </header>

            {/* ── Mobile Drawer ── */}
            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 198, backdropFilter: 'blur(3px)' }} />
            )}
            <div className="admin-mobile-drawer" style={{
                position: 'fixed', top: '58px', left: 0, bottom: 0,
                width: '280px', backgroundColor: '#111', borderRight: '1px solid #1e1e1e',
                zIndex: 199, display: 'flex', flexDirection: 'column',
                transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                overflowY: 'auto',
            }}>
                {/* Nav items */}
                <nav style={{ padding: '1rem 1rem 0' }}>
                    <p style={{ fontSize: '0.6rem', color: '#333', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', padding: '0.5rem 0.75rem', margin: '0 0 0.5rem' }}>Navigation</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {navItems.map((item) => {
                            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                            return (
                                <li key={item.id} style={{ marginBottom: '0.2rem' }}>
                                    <Link href={item.href} onClick={() => setIsSidebarOpen(false)} style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.85rem 0.75rem', borderRadius: '8px', textDecoration: 'none',
                                        color: active ? '#fff' : '#aaa',
                                        backgroundColor: active ? 'rgba(15,113,177,0.12)' : 'transparent',
                                        fontWeight: active ? '700' : '500',
                                        fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1.2px',
                                        borderLeft: active ? '3px solid #0f71b1' : '3px solid transparent',
                                        minHeight: '48px',
                                    }}>
                                        <span style={{ color: active ? '#0f71b1' : '#555', flexShrink: 0 }}>{NAV_ICONS[item.id]}</span>
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Drawer footer */}
                <div style={{ marginTop: 'auto', padding: '1.25rem 1rem 1.5rem', borderTop: '1px solid #1e1e1e', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link href="/admin/settings" onClick={() => setIsSidebarOpen(false)} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        padding: '0.85rem 0.75rem', borderRadius: '8px', textDecoration: 'none',
                        color: '#fff',
                        backgroundColor: pathname.startsWith('/admin/settings') ? '#0a5d96' : '#0f71b1',
                        fontWeight: '700', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1.2px',
                        minHeight: '48px', boxShadow: '0 2px 8px rgba(15,113,177,0.35)',
                    }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        Site Settings
                    </Link>
                    <Link href="/" onClick={() => setIsSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#111', backgroundColor: '#fff', textDecoration: 'none', borderRadius: '8px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Return to Site
                    </Link>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '0.78rem', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* ── Main Content ── */}
            <main className="admin-main" style={{ flex: 1, marginLeft: '260px', padding: '2rem', maxWidth: '100%' }}>
                {children}
            </main>

            <style jsx global>{`
                .admin-sidebar { display: flex !important; }
                .admin-mobile-bar { display: none !important; }
                .admin-mobile-drawer { display: flex !important; }

                @media (max-width: 992px) {
                    .admin-sidebar { display: none !important; }
                    .admin-mobile-bar { display: flex !important; }
                    .admin-main {
                        margin-left: 0 !important;
                        padding: 1.25rem 1rem !important;
                        padding-top: calc(58px + 1.25rem) !important;
                    }
                }
            `}</style>
        </div>
    );
}
