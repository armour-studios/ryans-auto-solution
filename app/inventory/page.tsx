"use client";

import { useState, useEffect } from 'react';
import VehicleCard from '@/components/VehicleCard';
import { type Vehicle } from '@/lib/inventory';

// Sidebar Item Component
const SidebarFilter = ({ title, active, children }: { title: string; active?: boolean; children: React.ReactNode }) => (
    <div style={{ marginBottom: '1rem', border: '1px solid #333', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
            backgroundColor: '#222',
            padding: '0.75rem 1rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            borderLeft: active ? '4px solid var(--primary-color)' : '4px solid transparent',
            color: '#fff'
        }}>
            {title}
        </div>
        <div style={{ padding: '1rem', backgroundColor: '#111' }}>
            {children}
        </div>
    </div>
);

type ClientVehicle = Vehicle; // Re-use type from lib

export default function InventoryPage() {
    const [vehicles, setVehicles] = useState<ClientVehicle[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<ClientVehicle[]>([]);
    const [filterType, setFilterType] = useState('All');
    const [showSold, setShowSold] = useState(false);

    // Advanced Search State
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [yearRange, setYearRange] = useState({ min: '', max: '' });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('/api/inventory')
            .then(res => res.json())
            .then(data => {
                setVehicles(data);
                setFilteredVehicles(data);
            });
    }, []);

    useEffect(() => {
        let result = vehicles;

        // Search Query (Make/Model)
        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            result = result.filter(v =>
                v.make.toLowerCase().includes(lower) ||
                v.model.toLowerCase().includes(lower) ||
                v.year.toString().includes(lower)
            );
        }

        // Filter by Type
        if (filterType !== 'All') {
            result = result.filter(v => v.type === filterType);
        }

        // Filter by Price
        if (priceRange.min) result = result.filter(v => v.price >= Number(priceRange.min));
        if (priceRange.max) result = result.filter(v => v.price <= Number(priceRange.max));

        // Filter by Year
        if (yearRange.min) result = result.filter(v => v.year >= Number(yearRange.min));
        if (yearRange.max) result = result.filter(v => v.year <= Number(yearRange.max));

        // Status Filter
        if (!showSold) {
            result = result.filter(v => v.status !== 'Sold');
        } else {
            result = result.filter(v => v.status === 'Sold');
        }
        setFilteredVehicles(result);
    }, [vehicles, filterType, showSold, priceRange, yearRange, searchQuery]);

    const types = ['All', ...Array.from(new Set(vehicles.map(v => v.type).filter(Boolean)))];

    return (
        <div style={{ padding: '2rem 0', minHeight: '80vh' }}>
            <div className="container">

                {/* Main Layout Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2.5rem',
                    alignItems: 'start'
                }} className="inventory-layout-grid">

                    {/* Left Sidebar */}
                    <aside>
                        <SidebarFilter title="Search" active>
                            <input
                                type="text"
                                placeholder="Make, Model, Year..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#222', color: '#fff' }}
                            />
                        </SidebarFilter>

                        <SidebarFilter title="Price Range">
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="number" placeholder="Min"
                                    value={priceRange.min} onChange={(e) => setPriceRange(p => ({ ...p, min: e.target.value }))}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#222', color: '#fff' }}
                                />
                                <span style={{ color: '#888' }}>-</span>
                                <input
                                    type="number" placeholder="Max"
                                    value={priceRange.max} onChange={(e) => setPriceRange(p => ({ ...p, max: e.target.value }))}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#222', color: '#fff' }}
                                />
                            </div>
                        </SidebarFilter>

                        <SidebarFilter title="Year Range">
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="number" placeholder="Min"
                                    value={yearRange.min} onChange={(e) => setYearRange(y => ({ ...y, min: e.target.value }))}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#222', color: '#fff' }}
                                />
                                <span style={{ color: '#888' }}>-</span>
                                <input
                                    type="number" placeholder="Max"
                                    value={yearRange.max} onChange={(e) => setYearRange(y => ({ ...y, max: e.target.value }))}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#222', color: '#fff' }}
                                />
                            </div>
                        </SidebarFilter>

                        <SidebarFilter title="Category">
                            <ul style={{ listStyle: 'none' }}>
                                {types.map(t => (
                                    <li key={t} style={{ marginBottom: '0.5rem' }}>
                                        <button
                                            onClick={() => setFilterType(t)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: filterType === t ? 'var(--primary-color)' : '#aaa',
                                                cursor: 'pointer',
                                                textTransform: 'uppercase',
                                                fontWeight: filterType === t ? 'bold' : 'normal',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%'
                                            }}
                                        >
                                            <span>{t}</span>
                                            <span>{t === 'All' ? vehicles.length : vehicles.filter(v => v.type === t).length}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </SidebarFilter>

                        <SidebarFilter title="Status">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#ccc' }}>
                                <input
                                    type="checkbox"
                                    checked={showSold}
                                    onChange={(e) => setShowSold(e.target.checked)}
                                />
                                Include Sold Vehicles
                            </label>
                        </SidebarFilter>
                    </aside>

                    {/* Right Content */}
                    <main>
                        <div style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                                {showSold ? 'All Inventory (Inc. Sold)' : 'Current Inventory'}
                            </h1>
                            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{filteredVehicles.length} Units</span>
                        </div>

                        {filteredVehicles.length === 0 ? (
                            <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '2rem' }}>
                                No vehicles found matching your criteria.
                            </p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {filteredVehicles.map(vehicle => (
                                    <VehicleCard key={vehicle.id} vehicle={vehicle as any} />
                                ))}
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
}
