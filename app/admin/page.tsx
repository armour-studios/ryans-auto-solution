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
        availableVehicles: 0,
        pendingVehicles: 0,
        comingSoonVehicles: 0,
        draftVehicles: 0,
        totalPosts: 0,
        avgRating: 0,
        totalReviews: 0,
        totalSales: 0,
        totalCost: 0,
        totalProfit: 0,
        avgMargin: 0,
        inventoryValue: 0,
        inventoryCost: 0,
        projectedProfit: 0,
        projectedMargin: 0,
        visitors: 0
    });
    const [vehicleData, setVehicleData] = useState<any[]>([]);
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
                const pending = Array.isArray(inventory) ? inventory.filter((v: any) => v.status === 'Pending') : [];
                const comingSoon = Array.isArray(inventory) ? inventory.filter((v: any) => v.status === 'Coming Soon') : [];
                const drafts = Array.isArray(inventory) ? inventory.filter((v: any) => v.status === 'Draft') : [];

                const totalSales = sold.reduce((acc: number, v: any) => acc + (v.price || 0), 0);
                const soldWithCost = sold.filter((v: any) => v.buyCost && v.buyCost > 0);
                const totalCost = soldWithCost.reduce((acc: number, v: any) => acc + (v.buyCost || 0), 0);
                const totalCostRevenue = soldWithCost.reduce((acc: number, v: any) => acc + (v.price || 0), 0);
                const totalProfit = soldWithCost.length > 0 ? totalCostRevenue - totalCost : 0;
                const avgMargin = soldWithCost.length > 0
                    ? soldWithCost.reduce((acc: number, v: any) => acc + ((v.price - v.buyCost) / v.price * 100), 0) / soldWithCost.length
                    : 0;
                const inventoryValue = available.reduce((acc: number, v: any) => acc + (v.price || 0), 0);
                const inventoryCost = available.reduce((acc: number, v: any) => acc + (v.buyCost || 0), 0);
                const availableWithCost = available.filter((v: any) => v.buyCost && v.buyCost > 0);
                const projectedProfit = availableWithCost.reduce((acc: number, v: any) => acc + (v.price - v.buyCost), 0);
                const projectedMargin = availableWithCost.length > 0
                    ? availableWithCost.reduce((acc: number, v: any) => acc + ((v.price - v.buyCost) / v.price * 100), 0) / availableWithCost.length
                    : 0;

                setVehicleData(Array.isArray(inventory) ? inventory : []);

                setStats({
                    totalInventory: Array.isArray(inventory) ? inventory.length : 0,
                    soldVehicles: sold.length,
                    availableVehicles: available.length,
                    pendingVehicles: pending.length,
                    comingSoonVehicles: comingSoon.length,
                    draftVehicles: drafts.length,
                    totalPosts: Array.isArray(posts) ? posts.length : 0,
                    avgRating: Array.isArray(reviews) && reviews.length > 0
                        ? reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / reviews.length
                        : 0,
                    totalReviews: Array.isArray(reviews) ? reviews.length : 0,
                    totalSales,
                    totalCost,
                    totalProfit,
                    avgMargin,
                    inventoryValue,
                    inventoryCost,
                    projectedProfit,
                    projectedMargin,
                    visitors: 1284
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

    const hasCostData = stats.totalCost > 0;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const SectionLabel = ({ children }: { children: React.ReactNode }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '3px', height: '18px', background: 'var(--primary-color)', borderRadius: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '2px' }}>{children}</span>
        </div>
    );

    if (loading) {
        return (
            <div style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', color: '#555' }}>
                <div style={{ width: '36px', height: '36px', border: '3px solid #222', borderTop: '3px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Loading Dashboard…</span>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
            <style>{`
                .dash-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; }
                .dash-header-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
                .dash-kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); }
                .dash-mid-grid { display: grid; grid-template-columns: 1fr 1fr; }
                .dash-quick-nav { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
                @media (max-width: 1024px) {
                    .dash-kpi-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 640px) {
                    .dash-kpi-grid { grid-template-columns: repeat(2, 1fr); }
                    .dash-mid-grid { grid-template-columns: 1fr; }
                    .dash-quick-nav { grid-template-columns: 1fr; }
                    .dash-kpi-card { padding: 1rem !important; }
                    .dash-header-actions { width: 100%; }
                    .dash-header-actions a { flex: 1 1 0; justify-content: center; min-width: 0; }
                }
            `}</style>

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="dash-header" style={{ gap: '1rem', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid #222' }}>
                <div>
                    <p style={{ fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.4rem' }}>{today}</p>
                    <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', color: '#fff', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1.1 }}>
                        Welcome Back{username ? `, ${username.charAt(0).toUpperCase() + username.slice(1)}` : ''}
                    </h1>
                    <p style={{ color: '#555', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.35rem' }}>
                        {userRole === 'superadmin' ? 'Super Admin' : 'Staff'} · Dealership Control Center
                    </p>
                </div>
                <div className="dash-header-actions">
                    <Link href="/admin/inventory/add" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add Vehicle
                    </Link>
                    <Link href="/admin/blog/add" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', backgroundColor: '#1a1a1a', color: '#ccc', border: '1px solid #333', borderRadius: '6px', textDecoration: 'none', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Post Article
                    </Link>
                </div>
            </div>

            {/* ── Primary KPI Row ─────────────────────────────────── */}
            <div className="dash-kpi-grid" style={{ gap: '0.85rem', marginBottom: '2rem' }}>

                {/* Units Available */}
                <div className="dash-kpi-card" style={{ padding: '1.35rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #1e3028', borderTop: '3px solid #10b981', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'radial-gradient(circle at top right, rgba(16,185,129,0.1), transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 0.8 }}>Available</span>
                        <div style={{ width: '28px', height: '28px', backgroundColor: 'rgba(16,185,129,0.12)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                    </div>
                    <div style={{ fontSize: 'clamp(1.5rem, 6vw, 2.4rem)', fontWeight: '800', color: '#10b981', lineHeight: 1, marginBottom: '0.5rem' }}>{stats.availableVehicles}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.4 }}>of <strong style={{ color: '#888' }}>{stats.totalInventory}</strong> total units on lot</div>
                </div>

                {/* Units Sold */}
                <div className="dash-kpi-card" style={{ padding: '1.35rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #2d1e1e', borderTop: '3px solid #ef4444', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'radial-gradient(circle at top right, rgba(239,68,68,0.1), transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 0.8 }}>Units Sold</span>
                        <div style={{ width: '28px', height: '28px', backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        </div>
                    </div>
                    <div style={{ fontSize: 'clamp(1.5rem, 6vw, 2.4rem)', fontWeight: '800', color: '#ef4444', lineHeight: 1, marginBottom: '0.5rem' }}>{stats.soldVehicles}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.4 }}><strong style={{ color: '#888' }}>${(stats.totalSales / 1000).toFixed(1)}k</strong> total sales revenue</div>
                </div>

                {/* Portfolio Value */}
                <div className="dash-kpi-card" style={{ padding: '1.35rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #1a2535', borderTop: '3px solid #0f71b1', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'radial-gradient(circle at top right, rgba(15,113,177,0.12), transparent 70%)', pointerEvents: 'none' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#0f71b1', textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 0.8 }}>Portfolio Value</span>
                        <div style={{ width: '28px', height: '28px', backgroundColor: 'rgba(15,113,177,0.14)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0f71b1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                        </div>
                    </div>
                    <div style={{ fontSize: 'clamp(1.5rem, 6vw, 2.4rem)', fontWeight: '800', color: '#0f71b1', lineHeight: 1, marginBottom: '0.5rem' }}>${(stats.inventoryValue / 1000).toFixed(0)}k</div>
                    <div style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.4 }}>listed ask price on lot</div>
                </div>

                {/* Projected Profit */}
                <div className="dash-kpi-card" style={{ padding: '1.35rem', backgroundColor: '#111', borderRadius: '12px', border: stats.projectedProfit > 0 ? '1px solid #1f2a1a' : '1px solid #1e1e1e', borderTop: stats.projectedProfit > 0 ? '3px solid #84cc16' : '3px solid #252525', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: stats.projectedProfit > 0 ? 'radial-gradient(circle at top right, rgba(132,204,22,0.08), transparent 70%)' : 'none', pointerEvents: 'none' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', color: stats.projectedProfit > 0 ? '#84cc16' : '#444', textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 0.9 }}>Proj. Profit</span>
                        <div style={{ width: '28px', height: '28px', backgroundColor: stats.projectedProfit > 0 ? 'rgba(132,204,22,0.1)' : 'rgba(100,100,100,0.06)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={stats.projectedProfit > 0 ? '#84cc16' : '#333'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        </div>
                    </div>
                    <div style={{ fontSize: 'clamp(1.5rem, 6vw, 2.4rem)', fontWeight: '800', color: stats.projectedProfit > 0 ? '#84cc16' : '#2a2a2a', lineHeight: 1, marginBottom: '0.5rem' }}>
                        {stats.projectedProfit > 0 ? `$${(stats.projectedProfit / 1000).toFixed(1)}k` : '—'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.4 }}>
                        {stats.projectedProfit > 0 ? <><strong style={{ color: '#888' }}>{stats.projectedMargin.toFixed(1)}%</strong> est. avg margin</> : 'Add buy costs to unlock'}
                    </div>
                </div>

                {/* Realized Profit */}
                <div className="dash-kpi-card" style={{ padding: '1.35rem', backgroundColor: '#111', borderRadius: '12px', border: hasCostData ? '1px solid #1e3028' : '1px solid #1a1a1a', borderTop: hasCostData ? '3px solid #10b981' : '3px solid #252525', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: hasCostData ? 'radial-gradient(circle at top right, rgba(16,185,129,0.1), transparent 70%)' : 'none', pointerEvents: 'none' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', color: hasCostData ? '#10b981' : '#444', textTransform: 'uppercase', letterSpacing: '1.2px', opacity: 0.9 }}>Realized Profit</span>
                        <div style={{ width: '28px', height: '28px', backgroundColor: hasCostData ? 'rgba(16,185,129,0.12)' : 'rgba(100,100,100,0.06)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hasCostData ? '#10b981' : '#333'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        </div>
                    </div>
                    <div style={{ fontSize: 'clamp(1.5rem, 6vw, 2.4rem)', fontWeight: '800', color: hasCostData ? (stats.totalProfit >= 0 ? '#10b981' : '#ef4444') : '#2a2a2a', lineHeight: 1, marginBottom: '0.5rem' }}>
                        {hasCostData ? `$${(stats.totalProfit / 1000).toFixed(1)}k` : '—'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.4 }}>
                        {hasCostData ? <><strong style={{ color: '#888' }}>{stats.avgMargin.toFixed(1)}%</strong> avg margin on sold</> : 'Add buy costs to track'}
                    </div>
                </div>

            </div>

            {/* ── Mid Row: Inventory Breakdown + Revenue vs Cost ──── */}
            <div className="dash-mid-grid" style={{ gap: '1rem', marginBottom: '1rem' }}>

                {/* Inventory Status Breakdown */}
                <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #222', padding: '1.5rem' }}>
                    <SectionLabel>Inventory Breakdown</SectionLabel>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { label: 'Available', count: stats.availableVehicles, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
                            { label: 'Pending', count: stats.pendingVehicles, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
                            { label: 'Coming Soon', count: stats.comingSoonVehicles, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
                            { label: 'Draft', count: stats.draftVehicles, color: '#6b7280', bg: 'rgba(107,114,128,0.08)' },
                            { label: 'Sold', count: stats.soldVehicles, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
                        ].map(s => {
                            const pct = stats.totalInventory > 0 ? (s.count / stats.totalInventory) * 100 : 0;
                            return (
                                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '100px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
                                        <span style={{ fontSize: '0.78rem', color: '#aaa' }}>{s.label}</span>
                                    </div>
                                    <div style={{ flex: 1, height: '8px', backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: s.color, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                                    </div>
                                    <div style={{ width: '60px', flexShrink: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: s.color }}>{s.count}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#444' }}>{pct.toFixed(0)}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Units</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>{stats.totalInventory}</span>
                    </div>
                </div>

                {/* Revenue vs Cost Breakdown */}
                <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #222', padding: '1.5rem' }}>
                    <SectionLabel>Revenue vs Cost (Sold)</SectionLabel>
                    {hasCostData ? (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                {(() => {
                                    const maxVal = Math.max(stats.totalSales, stats.totalCost, 1);
                                    return [
                                        { label: 'Sales Revenue', value: stats.totalSales, color: '#0f71b1', bg: 'rgba(15,113,177,0.15)' },
                                        { label: 'Buy Cost', value: stats.totalCost, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
                                        { label: 'Net Profit', value: stats.totalProfit, color: stats.totalProfit >= 0 ? '#10b981' : '#ef4444', bg: stats.totalProfit >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' },
                                    ].map(row => (
                                        <div key={row.label}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                                <span style={{ fontSize: '0.78rem', color: '#aaa' }}>{row.label}</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: row.color }}>${(row.value / 1000).toFixed(1)}k</span>
                                            </div>
                                            <div style={{ height: '10px', backgroundColor: '#1a1a1a', borderRadius: '5px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${(Math.abs(row.value) / maxVal) * 100}%`, background: row.bg.replace('0.15', '1').includes('linear') ? row.bg : row.color, borderRadius: '5px', opacity: 0.9, transition: 'width 0.8s ease' }} />
                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>Margin</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: stats.avgMargin >= 0 ? '#10b981' : '#ef4444' }}>{stats.avgMargin.toFixed(1)}%</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>Units w/ Cost</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>{vehicleData.filter((v:any) => v.status === 'Sold' && v.buyCost > 0).length}</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px' }}>Proj. Profit</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: stats.projectedProfit >= 0 ? '#10b981' : '#ef4444' }}>${(stats.projectedProfit / 1000).toFixed(1)}k</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', gap: '1rem', textAlign: 'center' }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            <p style={{ color: '#444', fontSize: '0.82rem', maxWidth: '200px', lineHeight: 1.5 }}>
                                Add <strong style={{ color: '#666' }}>buy costs</strong> to sold vehicles to unlock profit analytics.
                            </p>
                            <Link href="/admin/inventory" style={{ fontSize: '0.75rem', color: 'var(--primary-color)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px' }}>Edit Inventory →</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Per-Vehicle Profit ──────────────────────────────── */}
            {(() => {
                const soldWithCost = vehicleData.filter((v: any) => v.status === 'Sold' && v.buyCost && v.buyCost > 0)
                    .sort((a: any, b: any) => (b.price - b.buyCost) - (a.price - a.buyCost));
                if (soldWithCost.length === 0) return null;
                const maxProfit = Math.max(...soldWithCost.map((v: any) => Math.abs(v.price - v.buyCost)), 1);
                return (
                    <div style={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #222', padding: '1.5rem', marginBottom: '1rem' }}>
                        <SectionLabel>Profit Per Sold Vehicle</SectionLabel>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            {soldWithCost.map((v: any) => {
                                const profit = v.price - v.buyCost;
                                const margin = ((profit / v.price) * 100).toFixed(1);
                                const color = profit >= 0 ? '#10b981' : '#ef4444';
                                return (
                                    <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#ccc' }}>{v.year} {v.make} {v.model}</span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: '700', color }}>
                                                    {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
                                                </span>
                                            </div>
                                            <div style={{ height: '6px', backgroundColor: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${(Math.abs(profit) / maxProfit) * 100}%`, backgroundColor: color, borderRadius: '3px', transition: 'width 0.8s ease' }} />
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', minWidth: '50px' }}>
                                            <span style={{ fontSize: '0.72rem', fontWeight: '700', color, backgroundColor: `${color}18`, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{margin}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}

            {/* ── Secondary Stats Row ─────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Pending Sales', value: stats.pendingVehicles, sub: 'vehicles in negotiation', color: '#fbbf24' },
                    { label: 'Coming Soon', value: stats.comingSoonVehicles, sub: 'pre-announced', color: '#8b5cf6' },
                    { label: 'Draft Listings', value: stats.draftVehicles, sub: 'not yet published', color: '#6b7280' },
                    { label: 'Blog Posts', value: stats.totalPosts, sub: 'published articles', color: '#0f71b1' },
                    { label: 'Reviews', value: stats.totalReviews, sub: stats.avgRating > 0 ? `${stats.avgRating.toFixed(1)} avg rating` : 'no ratings yet', color: '#f59e0b' },
                    { label: 'Inventory Cost', value: stats.inventoryCost > 0 ? `$${(stats.inventoryCost / 1000).toFixed(1)}k` : '—', sub: 'floor cost on-lot', color: stats.inventoryCost > 0 ? '#f59e0b' : '#333' },
                ].map(s => (
                    <div key={s.label} style={{ padding: '1.25rem', backgroundColor: '#111', borderRadius: '10px', border: '1px solid #1c1c1c' }}>
                        <div style={{ fontSize: '0.65rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>{s.label}</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: s.color, lineHeight: 1, marginBottom: '0.3rem' }}>{s.value}</div>
                        <div style={{ fontSize: '0.68rem', color: '#444' }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* ── Quick Navigation ────────────────────────────────── */}
            <div className="dash-quick-nav" style={{ gap: '0.75rem' }}>
                {[
                    { label: 'Inventory Manager', href: '/admin/inventory', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, count: `${stats.availableVehicles} active`, color: '#0f71b1' },
                    { label: 'Blog & News', href: '/admin/blog', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, count: `${stats.totalPosts} posts`, color: '#10b981' },
                    { label: 'Customer Reviews', href: '/admin/testimonials', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, count: `${stats.totalReviews} reviews`, color: '#f59e0b' },
                    { label: 'User Management', href: '/admin/users', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, count: 'Staff access', color: '#6b7280' },
                ].map(mod => (
                    <Link key={mod.label} href={mod.href} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', backgroundColor: '#111', borderRadius: '10px', border: '1px solid #1c1c1c', textDecoration: 'none', transition: 'border-color 0.2s ease' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#333'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#1c1c1c'}
                    >
                        <div style={{ width: '40px', height: '40px', backgroundColor: `${mod.color}18`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mod.color, flexShrink: 0 }}>
                            {mod.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ddd', marginBottom: '0.2rem' }}>{mod.label}</div>
                            <div style={{ fontSize: '0.7rem', color: '#555' }}>{mod.count}</div>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" style={{ marginLeft: 'auto', flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
                    </Link>
                ))}
            </div>
        </div>
    );
}
