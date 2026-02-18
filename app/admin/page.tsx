'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminPortalPage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalInventory: 0,
        soldVehicles: 0,
        totalPosts: 0,
        avgRating: 0,
        totalReviews: 0,
        totalSales: 0,
        inventoryValue: 0,
        visitors: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };

        const loadDashboardData = async () => {
            try {
                // Fetch from API endpoints instead of direct lib imports to avoid 'fs' module errors in browser
                const [inventoryRes, postsRes, reviewsRes] = await Promise.all([
                    fetch('/api/inventory'),
                    fetch('/api/blog'),
                    fetch('/api/testimonials')
                ]);

                const [inventory, posts, reviews] = await Promise.all([
                    inventoryRes.json(),
                    postsRes.json(),
                    reviewsRes.json()
                ]);

                // Calculate money metrics
                const sold = Array.isArray(inventory) ? inventory.filter((v: any) => v.status === 'Sold') : [];
                const available = Array.isArray(inventory) ? inventory.filter((v: any) => v.status === 'Available') : [];

                const totalSales = sold.reduce((acc: number, v: any) => acc + (v.price || 0), 0);
                const inventoryValue = available.reduce((acc: number, v: any) => acc + (v.price || 0), 0);

                setStats({
                    totalInventory: Array.isArray(inventory) ? inventory.length : 0,
                    soldVehicles: sold.length,
                    totalPosts: Array.isArray(posts) ? posts.length : 0,
                    avgRating: Array.isArray(reviews) && reviews.length > 0
                        ? reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviews.length
                        : 0,
                    totalReviews: Array.isArray(reviews) ? reviews.length : 0,
                    totalSales,
                    inventoryValue,
                    visitors: 1284 // Simulated baseline for now
                });

                // User cookie
                const userCookie = getCookie('admin_user');
                if (userCookie) {
                    const user = JSON.parse(decodeURIComponent(userCookie));
                    setUserRole(user.role);
                    setUsername(user.username);
                }
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    if (loading) {
        return <div style={{ padding: '2rem', color: '#666' }}>Initializing Control Center...</div>;
    }

    return (
        <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
            {/* Header */}
            <div style={{
                marginBottom: '3rem',
                paddingBottom: '2rem',
                borderBottom: '1px solid #222'
            }}>
                <h1 style={{
                    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                    marginBottom: '0.5rem',
                    color: '#fff',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Welcome Back{username ? `, ${username.charAt(0).toUpperCase() + username.slice(1)}` : ''}
                </h1>
                <p style={{ color: '#666', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Dealership Control Center
                </p>
            </div>

            {/* Business Analytics Shelf */}
            <div style={{ marginBottom: '4rem' }}>
                <h3 style={{
                    marginBottom: '1.5rem',
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                }}>
                    Business at a Glance
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { label: 'Total Inventory', value: stats.totalInventory },
                        { label: 'Units Sold', value: stats.soldVehicles },
                        { label: 'Inventory Value', value: `$${(stats.inventoryValue / 1000).toFixed(1)}k` },
                        { label: 'Sales Volume', value: `$${(stats.totalSales / 1000).toFixed(1)}k` },
                        { label: 'Site Visitors', value: stats.visitors.toLocaleString() },
                        { label: 'Blog Posts', value: stats.totalPosts },
                        { label: 'Avg Rating', value: `${stats.avgRating.toFixed(1)} / 5` },
                    ].map((stat) => (
                        <div key={stat.label} style={{
                            padding: '1.5rem',
                            backgroundColor: '#111',
                            borderRadius: '12px',
                            border: '1px solid #222'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '1px' }}>
                                {stat.label}
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Management Modules */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {[
                    { label: 'Inventory', href: '/admin/inventory', desc: 'Manage your vehicle catalog', color: 'var(--primary-color)' },
                    { label: 'Blog & News', href: '/admin/blog', desc: 'Publish updates and articles', color: '#10b981' },
                    { label: 'Customer Reviews', href: '/admin/testimonials', desc: 'Moderate client feedback', color: 'var(--primary-color)' },
                ].map((mod) => (
                    <Link key={mod.label} href={mod.href} className="card-glow" style={{
                        display: 'block',
                        padding: '2rem',
                        backgroundColor: '#111',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        border: '1px solid #222',
                        transition: 'all 0.3s ease'
                    }}>
                        <div style={{ width: '40px', height: '4px', backgroundColor: mod.color, marginBottom: '1.5rem' }} />
                        <h2 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.2rem', textTransform: 'uppercase' }}>{mod.label}</h2>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>{mod.desc}</p>
                    </Link>
                ))}
            </div>

            {/* Executive Actions Shelf */}
            <div style={{
                padding: '2.5rem',
                backgroundColor: 'rgba(15, 113, 177, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(15, 113, 177, 0.1)'
            }}>
                <h3 style={{
                    marginBottom: '2rem',
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                }}>
                    Executive Actions
                </h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link href="/admin/inventory/add" className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '4px' }}>
                        NEW VEHICLE
                    </Link>
                    <Link href="/admin/blog/add" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', border: '1px solid #333', borderRadius: '4px' }}>
                        POST ARTICLE
                    </Link>
                    <Link href="/admin/testimonials/add" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', border: '1px solid #333', borderRadius: '4px' }}>
                        ADD REVIEW
                    </Link>
                </div>
            </div>
        </div>
    );
}
