'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminPortalPage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Get user info from the non-httpOnly cookie
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };

        try {
            // Read from admin_user cookie (non-httpOnly, readable by JS)
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

    return (
        <div style={{ padding: '4rem 0', minHeight: '80vh' }}>
            <div className="container">
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem',
                    paddingBottom: '2rem',
                    borderBottom: '1px solid #333'
                }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#fff' }}>
                            Welcome{username ? `, ${username.charAt(0).toUpperCase() + username.slice(1)}` : ''}! 👋
                        </h1>
                        <p style={{ color: '#888', fontSize: '1rem' }}>Manage your dealership content</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'transparent',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.2s'
                        }}
                    >
                        Logout
                    </button>
                </div>

                {/* Dashboard Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

                    {/* Inventory Module */}
                    <Link href="/admin/inventory"
                        style={{
                            display: 'block',
                            padding: '2.5rem',
                            background: 'linear-gradient(135deg, rgba(0,123,255,0.15) 0%, rgba(0,123,255,0.05) 100%)',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            border: '1px solid rgba(0,123,255,0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, var(--primary-color), #00d4ff)'
                        }} />
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
                        <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Inventory Management</h2>
                        <p style={{ color: '#888' }}>Add, edit, and remove vehicles from your lot</p>
                    </Link>

                    {/* Blog Module */}
                    <Link href="/admin/blog"
                        style={{
                            display: 'block',
                            padding: '2.5rem',
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            border: '1px solid rgba(16,185,129,0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, #10b981, #34d399)'
                        }} />
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📰</div>
                        <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Blog Management</h2>
                        <p style={{ color: '#888' }}>Write and publish news & tips</p>
                    </Link>

                    {/* Testimonials Module */}
                    <Link href="/admin/testimonials"
                        style={{
                            display: 'block',
                            padding: '2.5rem',
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            border: '1px solid rgba(245,158,11,0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                        }} />
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                        <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Testimonials</h2>
                        <p style={{ color: '#888' }}>Manage customer reviews</p>
                    </Link>

                    {/* User Management Module - Admin Only */}
                    {userRole === 'admin' && (
                        <Link href="/admin/users"
                            style={{
                                display: 'block',
                                padding: '2.5rem',
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.05) 100%)',
                                borderRadius: '16px',
                                textDecoration: 'none',
                                border: '1px solid rgba(139,92,246,0.3)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
                            }} />
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                            <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.4rem' }}>User Management</h2>
                            <p style={{ color: '#888' }}>Add and manage admin users</p>
                        </Link>
                    )}

                </div>

                {/* Quick Stats */}
                <div style={{
                    marginTop: '4rem',
                    padding: '2rem',
                    backgroundColor: '#111',
                    borderRadius: '12px',
                    border: '1px solid #333'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link href="/admin/inventory/add" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                            + Add New Vehicle
                        </Link>
                        <Link href="/admin/blog/add" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
                            + Write Blog Post
                        </Link>
                        <Link href="/admin/testimonials/add" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
                            + Add Testimonial
                        </Link>
                        <Link href="/" className="btn" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#333' }}>
                            View Live Site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
