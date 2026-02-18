'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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
        { label: 'Website Tools', href: '/admin/tools/image-editor', id: 'tools' },
    ];

    if (userRole === 'admin') {
        navItems.push({ label: 'Users', href: '/admin/users', id: 'users' });
    }

    // Don't show sidebar on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
            {/* Desktop Sidebar */}
            <aside className="admin-sidebar hide-on-mobile" style={{
                width: '280px',
                backgroundColor: '#111',
                borderRight: '1px solid #222',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'var(--primary-color)',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '0.5rem'
                    }}>
                        Ryan's Auto
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>
                        Management Portal
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {navItems.map((item) => (
                            <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                                <Link
                                    href={item.href}
                                    style={{
                                        display: 'block',
                                        padding: '1rem',
                                        color: pathname === item.href ? '#fff' : '#888',
                                        backgroundColor: pathname === item.href ? 'rgba(15, 113, 177, 0.1)' : 'transparent',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        fontWeight: pathname === item.href ? 'bold' : 'normal',
                                        borderLeft: pathname === item.href ? '4px solid var(--primary-color)' : '4px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid #222' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.9rem', color: '#fff' }}>{username}</div>
                        <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>{userRole}</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: 'transparent',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Sign Out
                    </button>
                    <Link href="/" style={{
                        display: 'block',
                        textAlign: 'center',
                        marginTop: '1rem',
                        fontSize: '0.8rem',
                        color: '#444',
                        textDecoration: 'none'
                    }}>
                        Return to Site
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="show-on-mobile-flex" style={{
                display: 'none', // CSS Override
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                backgroundColor: '#111',
                padding: '0 1.5rem',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #222',
                zIndex: 101
            }}>
                <div style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>ADMIN</div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem' }}
                >
                    {isSidebarOpen ? '✕' : '☰'}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="show-on-mobile"
                    style={{
                        position: 'fixed',
                        top: '60px',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#111',
                        zIndex: 100,
                        padding: '2rem'
                    }}
                >
                    <nav>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {navItems.map((item) => (
                                <li key={item.id} style={{ marginBottom: '1rem' }}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsSidebarOpen(false)}
                                        style={{
                                            display: 'block',
                                            padding: '1.2rem',
                                            color: pathname === item.href ? 'var(--primary-color)' : '#888',
                                            textDecoration: 'none',
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            borderBottom: '1px solid #222'
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            marginTop: '2rem',
                            backgroundColor: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold'
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                marginLeft: '280px', // Compensate for fixed sidebar on desktop
                padding: '2rem',
                maxWidth: '100%',
                transition: 'margin 0.3s'
            }} className="admin-main">
                {children}
            </main>

            <style jsx global>{`
                @media (max-width: 992px) {
                    .admin-main {
                        margin-left: 0 !important;
                        padding-top: 80px !important;
                    }
                    .hide-on-mobile {
                        display: none !important;
                    }
                    .show-on-mobile-flex {
                        display: flex !important;
                    }
                }
            `}</style>
        </div>
    );
}
