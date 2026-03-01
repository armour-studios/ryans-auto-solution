"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import VehicleCard from '@/components/VehicleCard';
import { type Vehicle } from '@/lib/inventory';
import { calculateMonthlyPayment } from '@/lib/financeUtils';
import { useTheme } from '@/components/ThemeProvider';

const SunIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

// SVG Icons
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="12" y2="18" />
    </svg>
);

const ChevronDown = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

// Filter Dropdown Component
const FilterDropdown = ({ label, children, isOpen, onToggle, onClose }: {
    label: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; onClose: () => void;
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <div ref={ref} className="filter-dropdown-wrapper">
            <button className={`filter-dropdown-btn ${isOpen ? 'active' : ''}`} onClick={onToggle}>
                <span>{label}</span>
                <ChevronDown />
            </button>
            {isOpen && <div className="filter-dropdown-panel">{children}</div>}
        </div>
    );
};

export default function InventoryPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMake, setFilterMake] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [yearRange, setYearRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('newest');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [gridCols, setGridCols] = useState<2 | 3>(2);
    const { theme, toggleTheme } = useTheme();

    // Finance defaults for est. monthly payment
    const financeDefaults = { downPayment: 2000, tradeIn: 0, apr: 6.4, term: 72 };

    useEffect(() => {
        fetch('/api/inventory')
            .then(res => res.json())
            .then(data => setVehicles(data));
    }, []);

    // Separate available & sold, then apply filters
    const { availableVehicles, soldVehicles } = useMemo(() => {
        let available = vehicles.filter(v => v.status !== 'Sold' && v.status !== 'Draft');
        let sold = vehicles.filter(v => v.status === 'Sold');

        // Apply shared filters to both groups
        const applyFilters = (list: Vehicle[]) => {
            let result = [...list];

            if (searchQuery) {
                const lower = searchQuery.toLowerCase();
                result = result.filter(v =>
                    v.make.toLowerCase().includes(lower) ||
                    v.model.toLowerCase().includes(lower) ||
                    v.year.toString().includes(lower)
                );
            }

            if (filterMake !== 'All') result = result.filter(v => v.make === filterMake);
            if (filterType !== 'All') result = result.filter(v => v.type === filterType);
            if (priceRange.min) result = result.filter(v => v.price >= Number(priceRange.min));
            if (priceRange.max) result = result.filter(v => v.price <= Number(priceRange.max));
            if (yearRange.min) result = result.filter(v => v.year >= Number(yearRange.min));
            if (yearRange.max) result = result.filter(v => v.year <= Number(yearRange.max));

            // Sorting
            result.sort((a, b) => {
                if (sortBy === 'price-asc') return a.price - b.price;
                if (sortBy === 'price-desc') return b.price - a.price;
                if (sortBy === 'year-desc') return b.year - a.year;
                if (sortBy === 'mileage-asc') return a.mileage - b.mileage;
                return b.id - a.id;
            });

            return result;
        };

        return {
            availableVehicles: applyFilters(available),
            soldVehicles: applyFilters(sold)
        };
    }, [vehicles, searchQuery, filterMake, filterType, priceRange, yearRange, sortBy]);

    const activeTypes = Array.from(new Set(vehicles.map(v => v.type).filter(Boolean)));
    const activeMakes = Array.from(new Set(vehicles.map(v => v.make).filter(Boolean))).sort();

    // Active Pills
    const activePills = useMemo(() => {
        const pills: { id: string; label: string; clear: () => void }[] = [];
        if (filterMake !== 'All') pills.push({ id: 'make', label: filterMake, clear: () => setFilterMake('All') });
        if (filterType !== 'All') pills.push({ id: 'type', label: filterType, clear: () => setFilterType('All') });
        if (priceRange.min || priceRange.max) pills.push({ id: 'price', label: `$${priceRange.min || '0'} - $${priceRange.max || 'Any'}`, clear: () => setPriceRange({ min: '', max: '' }) });
        if (yearRange.min || yearRange.max) pills.push({ id: 'year', label: `${yearRange.min || 'Any'} - ${yearRange.max || 'Any'}`, clear: () => setYearRange({ min: '', max: '' }) });
        return pills;
    }, [filterMake, filterType, priceRange, yearRange]);

    const clearAllFilters = () => {
        setSearchQuery('');
        setFilterMake('All');
        setFilterType('All');
        setPriceRange({ min: '', max: '' });
        setYearRange({ min: '', max: '' });
    };

    const toggleDropdown = (name: string) => setOpenDropdown(prev => prev === name ? null : name);

    const getEstPayment = (price: number) => calculateMonthlyPayment(
        price, financeDefaults.downPayment, financeDefaults.tradeIn, financeDefaults.apr, financeDefaults.term
    );

    return (
        <div style={{ padding: '3rem 0', minHeight: '80vh' }}>
            <div className="container">

                {/* Search Bar + Theme Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                <div className="master-search-bar" style={{ flex: 1, marginBottom: 0 }}>
                    <SearchIcon />
                    <input
                        type="text"
                        className="master-search-input"
                        placeholder="SEARCH OUR INVENTORY..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                            <CloseIcon />
                        </button>
                    )}
                </div>
                <button
                    className="theme-toggle-cta"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
                </button>
                </div>

                {/* ── Filter Bar (horizontal, under search) ── */}
                <div className="inv-filter-bar">
                    <div className="inv-filter-bar-left">
                        <span className="inv-filter-icon"><FilterIcon /></span>

                        <FilterDropdown label={filterMake === 'All' ? 'Make' : filterMake} isOpen={openDropdown === 'make'} onToggle={() => toggleDropdown('make')} onClose={() => setOpenDropdown(null)}>
                            <button className={`fd-option ${filterMake === 'All' ? 'active' : ''}`} onClick={() => { setFilterMake('All'); setOpenDropdown(null); }}>ALL MAKES</button>
                            {activeMakes.map(m => (
                                <button key={m} className={`fd-option ${filterMake === m ? 'active' : ''}`} onClick={() => { setFilterMake(m); setOpenDropdown(null); }}>{m.toUpperCase()}</button>
                            ))}
                        </FilterDropdown>

                        <FilterDropdown label={filterType === 'All' ? 'Category' : filterType} isOpen={openDropdown === 'type'} onToggle={() => toggleDropdown('type')} onClose={() => setOpenDropdown(null)}>
                            <button className={`fd-option ${filterType === 'All' ? 'active' : ''}`} onClick={() => { setFilterType('All'); setOpenDropdown(null); }}>ALL</button>
                            {activeTypes.map(t => (
                                <button key={t} className={`fd-option ${filterType === t ? 'active' : ''}`} onClick={() => { setFilterType(t); setOpenDropdown(null); }}>{t.toUpperCase()}</button>
                            ))}
                        </FilterDropdown>

                        <FilterDropdown label="Price" isOpen={openDropdown === 'price'} onToggle={() => toggleDropdown('price')} onClose={() => setOpenDropdown(null)}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.25rem' }}>
                                <input type="number" placeholder="MIN" className="fd-input" value={priceRange.min} onChange={(e) => setPriceRange(p => ({ ...p, min: e.target.value }))} />
                                <span style={{ color: '#555', fontWeight: 'bold' }}>—</span>
                                <input type="number" placeholder="MAX" className="fd-input" value={priceRange.max} onChange={(e) => setPriceRange(p => ({ ...p, max: e.target.value }))} />
                            </div>
                        </FilterDropdown>

                        <FilterDropdown label="Year" isOpen={openDropdown === 'year'} onToggle={() => toggleDropdown('year')} onClose={() => setOpenDropdown(null)}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.25rem' }}>
                                <input type="number" placeholder="FROM" className="fd-input" value={yearRange.min} onChange={(e) => setYearRange(y => ({ ...y, min: e.target.value }))} />
                                <span style={{ color: '#555', fontWeight: 'bold' }}>—</span>
                                <input type="number" placeholder="TO" className="fd-input" value={yearRange.max} onChange={(e) => setYearRange(y => ({ ...y, max: e.target.value }))} />
                            </div>
                        </FilterDropdown>
                    </div>

                    <div className="inv-filter-bar-right">
                        <div className="grid-toggle">
                            <button
                                className={`grid-toggle-btn ${gridCols === 2 ? 'active' : ''}`}
                                onClick={() => setGridCols(2)}
                                title="2 columns"
                                aria-label="2 column layout"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                                </svg>
                            </button>
                            <button
                                className={`grid-toggle-btn ${gridCols === 3 ? 'active' : ''}`}
                                onClick={() => setGridCols(3)}
                                title="3 columns"
                                aria-label="3 column layout"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="5" height="7" /><rect x="9.5" y="3" width="5" height="7" /><rect x="17" y="3" width="5" height="7" />
                                    <rect x="2" y="14" width="5" height="7" /><rect x="9.5" y="14" width="5" height="7" /><rect x="17" y="14" width="5" height="7" />
                                </svg>
                            </button>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#555', fontWeight: '900', letterSpacing: '1px' }}>SORT</span>
                        <select className="inv-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">NEWEST LISTED</option>
                            <option value="price-asc">PRICE: LOW → HIGH</option>
                            <option value="price-desc">PRICE: HIGH → LOW</option>
                            <option value="year-desc">YEAR: NEWEST FIRST</option>
                            <option value="mileage-asc">LOWEST MILEAGE</option>
                        </select>
                    </div>
                </div>

                {/* Active Filter Pills */}
                {activePills.length > 0 && (
                    <div className="active-pills-container" style={{ marginBottom: '2rem' }}>
                        {activePills.map(pill => (
                            <div key={pill.id} className="filter-pill" onClick={pill.clear}>
                                <span style={{ textTransform: 'uppercase' }}>{pill.label}</span>
                                <CloseIcon />
                            </div>
                        ))}
                        <button onClick={clearAllFilters} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '900', marginLeft: '0.5rem', letterSpacing: '1px' }}>
                            CLEAR ALL
                        </button>
                    </div>
                )}

                {/* ═══════════ AVAILABLE VEHICLES ═══════════ */}
                <section>
                    <div className="inv-section-header">
                        <h2 className="inv-section-title">
                            <span className="inv-status-dot available"></span>
                            AVAILABLE VEHICLES
                        </h2>
                        <span className="inv-section-count">{availableVehicles.length} UNITS</span>
                    </div>

                    {availableVehicles.length === 0 ? (
                        <div className="inv-empty-state">
                            <SearchIcon />
                            <p>NO AVAILABLE VEHICLES MATCH YOUR CRITERIA</p>
                            <button onClick={clearAllFilters} className="btn" style={{ marginTop: '1.5rem', padding: '0.75rem 2rem' }}>RESET FILTERS</button>
                        </div>
                    ) : (
                        <div className="vehicle-results-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
                            {availableVehicles.map(vehicle => (
                                <VehicleCard key={vehicle.id} vehicle={vehicle} estPayment={getEstPayment(vehicle.price)} />
                            ))}
                        </div>
                    )}
                </section>

                {/* ═══════════ SOLD VEHICLES ═══════════ */}
                {soldVehicles.length > 0 && (
                    <section style={{ marginTop: '4rem' }}>
                        <div className="inv-section-header sold">
                            <h2 className="inv-section-title">
                                <span className="inv-status-dot sold"></span>
                                RECENTLY SOLD
                            </h2>
                            <span className="inv-section-count">{soldVehicles.length} UNITS</span>
                        </div>

                        <div className="vehicle-results-grid sold-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
                            {soldVehicles.map(vehicle => (
                                <VehicleCard key={vehicle.id} vehicle={vehicle} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
