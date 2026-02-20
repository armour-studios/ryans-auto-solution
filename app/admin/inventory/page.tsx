'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DeleteButton from '@/components/DeleteButton';
import FeaturedToggle from '@/components/admin/FeaturedToggle';

export default function InventoryAdminPage() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState<'All' | 'Available' | 'Sold'>('Available');
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
        if (activeFilter === 'All') return true;
        return v.status === activeFilter;
    });

    if (loading) {
        return <div style={{ padding: '2rem', color: '#666' }}>Loading Inventory Management...</div>;
    }

    return (
        <div style={{ padding: '2rem 0' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', color: '#fff', textTransform: 'uppercase' }}>Inventory Management</h1>
                    <Link href="/admin/inventory/add" className="btn btn-accent">
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

                <div style={{ backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #222' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #222' }}>
                                <th style={{ padding: '1.25rem', textAlign: 'left', color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>ID</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left', color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Image</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left', color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Vehicle</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left', color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Price</th>
                                <th style={{ padding: '1.25rem', textAlign: 'center', color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Featured</th>
                                <th style={{ padding: '1.25rem', textAlign: 'left', color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Status</th>
                                <th style={{ padding: '1.25rem', textAlign: 'right', color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map(vehicle => (
                                <tr key={vehicle.id} style={{ borderBottom: '1px solid #222' }}>
                                    <td style={{ padding: '1.25rem', color: '#444', fontSize: '0.85rem' }}>{vehicle.id}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div style={{ position: 'relative', width: '70px', height: '50px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #333', backgroundColor: '#222' }}>
                                            {vehicle.image ? (
                                                <Image
                                                    src={vehicle.image}
                                                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    sizes="70px"
                                                />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '0.65rem' }}>No img</div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#eee' }}>{vehicle.year} {vehicle.make} {vehicle.model}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>{vehicle.mileage.toLocaleString()} miles</div>
                                    </td>
                                    <td style={{ padding: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>${vehicle.price.toLocaleString()}</td>
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
                                    <td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: '#666', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
                                        No vehicles found in this category.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
