'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DeleteButton from '@/components/DeleteButton';
import FeaturedToggle from '@/components/admin/FeaturedToggle';

export default function InventoryAdminPage() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState<'All' | 'Available' | 'Sold'>('Available');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await fetch('/api/inventory');
                const data = await res.json();
                setInventory(data);
            } catch (err) {
                console.error('Failed to load inventory:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    const filteredInventory = inventory.filter(v => {
        if (activeFilter !== 'All' && v.status !== activeFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const name = `${v.year} ${v.make} ${v.model}`.toLowerCase();
            if (!name.includes(q) && !v.id.toString().includes(q)) return false;
        }
        return true;
    });

    if (loading) {
        return <div style={{ padding: '2rem', color: '#666' }}>Loading Inventory Management...</div>;
    }

    return (
        <div style={{ padding: '2rem 0' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>

                <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 2.5rem)', color: '#fff', textTransform: 'uppercase' }}>Inventory Management</h1>
                    <Link href="/admin/inventory/add" className="btn btn-accent" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                        + ADD NEW VEHICLE
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                    {['Available', 'Sold', 'All'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter as any)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                backgroundColor: activeFilter === filter ? 'var(--primary-color)' : 'transparent',
                                border: '1px solid',
                                borderColor: activeFilter === filter ? 'var(--primary-color)' : '#333',
                                color: activeFilter === filter ? '#fff' : '#888',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                fontSize: '0.8rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, make, model, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%', padding: '0.85rem 1.25rem 0.85rem 2.75rem', backgroundColor: '#1a1a1a',
                            border: '1px solid #333', borderRadius: '8px', color: '#fff',
                            fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#333'}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>✕</button>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="admin-table-view" style={{ backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#1a1a1a', borderBottom: '2px solid #222' }}>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', color: '#555', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1.5px', fontWeight: '700', width: '90px' }}></th>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', color: '#555', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1.5px', fontWeight: '700' }}>Vehicle</th>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', color: '#555', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1.5px', fontWeight: '700' }}>Price</th>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', color: '#555', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1.5px', fontWeight: '700' }}>Featured</th>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', color: '#555', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1.5px', fontWeight: '700' }}>Status</th>
                                <th style={{ padding: '1rem 1.25rem', textAlign: 'right', color: '#555', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1.5px', fontWeight: '700' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map(vehicle => (
                                <tr key={vehicle.id} style={{ borderBottom: '1px solid #1a1a1a', transition: 'background 0.15s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <td style={{ padding: '0.75rem 1.25rem' }}>
                                        <Link href={`/inventory/${vehicle.id}`} style={{ display: 'block' }}>
                                            <div style={{ position: 'relative', width: '75px', height: '52px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #333', backgroundColor: '#222', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                                                {vehicle.image ? (
                                                    <Image
                                                        src={vehicle.image}
                                                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        sizes="75px"
                                                    />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.65rem' }}>No img</div>
                                                )}
                                            </div>
                                        </Link>
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem' }}>
                                        <Link href={`/inventory/${vehicle.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#eee' }}>{vehicle.year} {vehicle.make} {vehicle.model}</div>
                                        </Link>
                                        <div style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.3rem', fontFamily: 'monospace' }}>{vehicle.mileage.toLocaleString()} mi · #{vehicle.id}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.25rem', fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1rem' }}>${vehicle.price.toLocaleString()}</td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                                        <FeaturedToggle id={vehicle.id} initialStatus={vehicle.trending || false} />
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span style={{
                                            padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase',
                                            backgroundColor: vehicle.status === 'Sold' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: vehicle.status === 'Sold' ? '#ef4444' : '#10b981',
                                            border: `1px solid ${vehicle.status === 'Sold' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                        }}>
                                            {vehicle.status || 'Available'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        <Link href={`/admin/inventory/edit/${vehicle.id}`} className="btn" style={{ marginRight: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: '#222', border: '1px solid #333' }}>
                                            EDIT
                                        </Link>
                                        <DeleteButton id={vehicle.id} endpoint="/api/inventory" />
                                    </td>
                                </tr>
                            ))}
                            {filteredInventory.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
                                        No vehicles found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="admin-card-view" style={{ display: 'none' }}>
                    {filteredInventory.map(vehicle => (
                        <div key={vehicle.id} style={{
                            backgroundColor: '#111',
                            borderRadius: '12px',
                            border: '1px solid #222',
                            marginBottom: '1rem',
                            overflow: 'hidden'
                        }}>
                            {/* Card Header: Image + Info */}
                            <div style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
                                <Link href={`/inventory/${vehicle.id}`} style={{ flexShrink: 0 }}>
                                    <div style={{ position: 'relative', width: '90px', height: '65px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333', backgroundColor: '#222' }}>
                                        {vehicle.image ? (
                                            <Image
                                                src={vehicle.image}
                                                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                sizes="90px"
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.65rem' }}>No img</div>
                                        )}
                                    </div>
                                </Link>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#eee', marginBottom: '0.25rem' }}>
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '0.25rem' }}>
                                        ${vehicle.price.toLocaleString()}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#555', fontFamily: 'monospace' }}>{vehicle.mileage.toLocaleString()} mi</span>
                                        <span style={{
                                            padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase',
                                            backgroundColor: vehicle.status === 'Sold' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: vehicle.status === 'Sold' ? '#ef4444' : '#10b981',
                                            border: `1px solid ${vehicle.status === 'Sold' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
                                        }}>
                                            {vehicle.status || 'Available'}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <FeaturedToggle id={vehicle.id} initialStatus={vehicle.trending || false} />
                                            <span style={{ fontSize: '0.7rem', color: '#555', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Featured</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div style={{
                                display: 'flex',
                                borderTop: '1px solid #222',
                                backgroundColor: '#0d0d0d'
                            }}>
                                <Link
                                    href={`/admin/inventory/edit/${vehicle.id}`}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '0.85rem',
                                        color: 'var(--primary-color)',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem',
                                        textDecoration: 'none',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        borderRight: '1px solid #222'
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit
                                </Link>
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <DeleteButton id={vehicle.id} endpoint="/api/inventory" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredInventory.length === 0 && (
                        <div style={{ padding: '4rem', textAlign: 'center', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #222' }}>
                            No vehicles found in this category.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
