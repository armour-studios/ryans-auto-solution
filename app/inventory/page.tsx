"use client";

import { useState, useEffect, useMemo } from 'react';
import VehicleCard from '@/components/VehicleCard';
import { type Vehicle } from '@/lib/inventory';
import { calculateMonthlyPayment, calculateMaxPrice } from '@/lib/financeUtils';

// SVG Icons
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const WalletIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
    </svg>
);

// Accordion Component for Sidebar
const AccordionItem = ({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) => (
    <div className="accordion-item">
        <button className="accordion-header" onClick={onToggle}>
            <span>{title}</span>
            <ChevronIcon isOpen={isOpen} />
        </button>
        {isOpen && <div className="accordion-body">{children}</div>}
    </div>
);

export default function InventoryPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [yearRange, setYearRange] = useState({ min: '', max: '' });
    const [showSold, setShowSold] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [sortBy, setSortBy] = useState('newest');

    // Finance State
    const [financeSettings, setFinanceSettings] = useState({
        monthlyBudget: 600,
        targetPrice: 35000,
        downPayment: 2000,
        tradeIn: 0,
        apr: 6.4,
        term: 72,
        budgetMode: false
    });

    // Accordion State
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        wallet: true,
        price: true,
        year: true,
        make: true,
        type: true,
        finance: false
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Sync Monthly Budget when Finance Settings or Target Price Change
    useEffect(() => {
        const newPayment = calculateMonthlyPayment(
            financeSettings.targetPrice,
            financeSettings.downPayment,
            financeSettings.tradeIn,
            financeSettings.apr,
            financeSettings.term
        );
        if (newPayment !== financeSettings.monthlyBudget) {
            setFinanceSettings(f => ({ ...f, monthlyBudget: newPayment }));
        }
    }, [financeSettings.targetPrice, financeSettings.downPayment, financeSettings.tradeIn, financeSettings.apr, financeSettings.term]);

    // Update Target Price when Monthly Budget Slider changes
    const handleBudgetChange = (val: number) => {
        const newMaxPrice = calculateMaxPrice(
            val,
            financeSettings.downPayment,
            financeSettings.tradeIn,
            financeSettings.apr,
            financeSettings.term
        );
        setFinanceSettings(f => ({
            ...f,
            monthlyBudget: val,
            targetPrice: newMaxPrice
        }));
    };

    useEffect(() => {
        fetch('/api/inventory')
            .then(res => res.json())
            .then(data => setVehicles(data));
    }, []);

    // Derived filtering logic
    const filteredAndSortedVehicles = useMemo(() => {
        let result = [...vehicles];

        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            result = result.filter(v =>
                v.make.toLowerCase().includes(lower) ||
                v.model.toLowerCase().includes(lower) ||
                v.year.toString().includes(lower)
            );
        }

        if (filterType !== 'All') result = result.filter(v => v.type === filterType);
        if (priceRange.min) result = result.filter(v => v.price >= Number(priceRange.min));
        if (priceRange.max) result = result.filter(v => v.price <= Number(priceRange.max));
        if (yearRange.min) result = result.filter(v => v.year >= Number(yearRange.min));
        if (yearRange.max) result = result.filter(v => v.year <= Number(yearRange.max));
        if (!showSold) result = result.filter(v => v.status !== 'Sold');

        // Budget Filter
        if (financeSettings.budgetMode) {
            result = result.filter(v => {
                const payment = calculateMonthlyPayment(
                    v.price,
                    financeSettings.downPayment,
                    financeSettings.tradeIn,
                    financeSettings.apr,
                    financeSettings.term
                );
                return payment <= financeSettings.monthlyBudget;
            });
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            if (sortBy === 'year-desc') return b.year - a.year;
            if (sortBy === 'mileage-asc') return a.mileage - b.mileage;
            return b.id - a.id; // newest (id based)
        });

        return result;
    }, [vehicles, searchQuery, filterType, priceRange, yearRange, showSold, sortBy, financeSettings]);

    const activeTypes = Array.from(new Set(vehicles.map(v => v.type).filter(Boolean)));
    const activeMakes = Array.from(new Set(vehicles.map(v => v.make).filter(Boolean)));

    // Active Pills Logic
    const activePills = useMemo(() => {
        const pills = [];
        if (filterType !== 'All') pills.push({ id: 'type', label: filterType, clear: () => setFilterType('All') });
        if (priceRange.min || priceRange.max) pills.push({ id: 'price', label: `$${priceRange.min || 0} - $${priceRange.max || 'Any'}`, clear: () => setPriceRange({ min: '', max: '' }) });
        if (yearRange.min || yearRange.max) pills.push({ id: 'year', label: `${yearRange.min || 'Any'} - ${yearRange.max || 'Any'}`, clear: () => setYearRange({ min: '', max: '' }) });
        if (showSold) pills.push({ id: 'sold', label: 'Including Sold', clear: () => setShowSold(false) });
        if (financeSettings.budgetMode) pills.push({ id: 'budget', label: `Under $${financeSettings.monthlyBudget}/mo`, clear: () => setFinanceSettings(f => ({ ...f, budgetMode: false })) });
        return pills;
    }, [filterType, priceRange, yearRange, showSold, financeSettings]);

    return (
        <div style={{ padding: '4rem 0', minHeight: '80vh' }}>
            <div className="container">

                {/* Top Level Master Search */}
                <div className="master-search-bar">
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

                {/* Layout Grid */}
                <div className="inventory-grid">

                    {/* Left Sidebar Filters */}
                    <aside className="inventory-filters-aside">
                        {/* Mobile Filter Toggle */}
                        <button
                            className="mobile-filter-toggle mobile-only"
                            onClick={() => setFiltersOpen(!filtersOpen)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="18" x2="12" y2="18" />
                            </svg>
                            {filtersOpen ? 'HIDE FILTERS' : 'SHOW FILTERS'}
                        </button>
                        <div className={`filter-panel-content ${filtersOpen ? 'filter-panel-open' : ''}`}>

                            <AccordionItem title="Price" isOpen={openSections.price} onToggle={() => toggleSection('price')}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <input
                                        type="number" placeholder="MIN"
                                        className="custom-select"
                                        value={priceRange.min} onChange={(e) => setPriceRange(p => ({ ...p, min: e.target.value }))}
                                    />
                                    <span style={{ color: '#555', fontWeight: 'bold' }}>-</span>
                                    <input
                                        type="number" placeholder="MAX"
                                        className="custom-select"
                                        value={priceRange.max} onChange={(e) => setPriceRange(p => ({ ...p, max: e.target.value }))}
                                    />
                                </div>
                            </AccordionItem>

                            <AccordionItem title="Year" isOpen={openSections.year} onToggle={() => toggleSection('year')}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <input
                                        type="number" placeholder="FROM"
                                        className="custom-select"
                                        value={yearRange.min} onChange={(e) => setYearRange(y => ({ ...y, min: e.target.value }))}
                                    />
                                    <span style={{ color: '#555', fontWeight: 'bold' }}>-</span>
                                    <input
                                        type="number" placeholder="TO"
                                        className="custom-select"
                                        value={yearRange.max} onChange={(e) => setYearRange(y => ({ ...y, max: e.target.value }))}
                                    />
                                </div>
                            </AccordionItem>

                            <AccordionItem title="Make" isOpen={openSections.make} onToggle={() => toggleSection('make')}>
                                <select
                                    className="custom-select"
                                    onChange={(e) => setSearchQuery(e.target.value === 'All' ? '' : e.target.value)}
                                    value={searchQuery && activeMakes.includes(searchQuery) ? searchQuery : 'All'}
                                >
                                    <option value="All">ALL MAKES</option>
                                    {activeMakes.map(make => <option key={make} value={make}>{make.toUpperCase()}</option>)}
                                </select>
                            </AccordionItem>

                            <AccordionItem title="Category" isOpen={openSections.type} onToggle={() => toggleSection('type')}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {['All', ...activeTypes].map(type => (
                                        <label key={type} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            color: filterType === type ? 'var(--primary-color)' : '#888',
                                            fontWeight: filterType === type ? 'bold' : 'normal',
                                            textTransform: 'uppercase'
                                        }}>
                                            <input
                                                type="radio"
                                                name="type"
                                                checked={filterType === type}
                                                onChange={() => setFilterType(type)}
                                                style={{ accentColor: 'var(--primary-color)', width: '18px', height: '18px' }}
                                            />
                                            {type}
                                        </label>
                                    ))}
                                </div>
                            </AccordionItem>

                            <div style={{ marginTop: '2.5rem' }}>
                                {/* My Wallet Section */}
                                <div className="wallet-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                                            <WalletIcon />
                                            <span style={{ fontWeight: '900', fontSize: '0.9rem', letterSpacing: '1px' }}>MY WALLET</span>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={financeSettings.budgetMode}
                                                onChange={(e) => setFinanceSettings(f => ({ ...f, budgetMode: e.target.checked }))}
                                            />
                                            <span className="slider-toggle"></span>
                                        </label>
                                    </div>

                                    <span className="wallet-label">Budget Per Month</span>
                                    <div className="wallet-payment">${financeSettings.monthlyBudget}<span> / mo</span></div>

                                    <input
                                        type="range"
                                        min="200"
                                        max="2000"
                                        step="50"
                                        className="finance-slider"
                                        value={financeSettings.monthlyBudget}
                                        onChange={(e) => handleBudgetChange(Number(e.target.value))}
                                    />

                                    <button
                                        onClick={() => toggleSection('finance')}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', display: 'block', margin: '1rem auto 0 auto' }}
                                    >
                                        {openSections.finance ? 'HIDE SETTINGS' : 'UPDATE PAYMENT SETTINGS'}
                                    </button>
                                </div>

                                {openSections.finance && (
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px dashed #333' }}>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <span className="wallet-label">Target Vehicle Price</span>
                                            <div className="input-group">
                                                <span className="input-prefix">$</span>
                                                <input
                                                    type="number" className="custom-select input-with-prefix"
                                                    value={financeSettings.targetPrice}
                                                    onChange={(e) => setFinanceSettings(f => ({ ...f, targetPrice: Number(e.target.value) }))}
                                                />
                                            </div>
                                        </div>

                                        <div className="finance-grid">
                                            <div style={{ marginBottom: '1rem' }}>
                                                <span className="wallet-label">Down Payment</span>
                                                <div className="input-group">
                                                    <span className="input-prefix">$</span>
                                                    <input
                                                        type="number" className="custom-select input-with-prefix"
                                                        value={financeSettings.downPayment}
                                                        onChange={(e) => setFinanceSettings(f => ({ ...f, downPayment: Number(e.target.value) }))}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <span className="wallet-label">Trade-In Value</span>
                                                <div className="input-group">
                                                    <span className="input-prefix">$</span>
                                                    <input
                                                        type="number" className="custom-select input-with-prefix"
                                                        value={financeSettings.tradeIn}
                                                        onChange={(e) => setFinanceSettings(f => ({ ...f, tradeIn: Number(e.target.value) }))}
                                                    />
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <span className="wallet-label">APR%</span>
                                                <div className="input-group">
                                                    <input
                                                        type="number" step="0.1" className="custom-select input-with-suffix"
                                                        value={financeSettings.apr}
                                                        onChange={(e) => setFinanceSettings(f => ({ ...f, apr: Number(e.target.value) }))}
                                                    />
                                                    <span className="input-suffix">%</span>
                                                </div>
                                            </div>
                                            <div style={{ marginBottom: '1rem' }}>
                                                <span className="wallet-label">Term</span>
                                                <select
                                                    className="custom-select"
                                                    value={financeSettings.term}
                                                    onChange={(e) => setFinanceSettings(f => ({ ...f, term: Number(e.target.value) }))}
                                                >
                                                    <option value="36">36 Mo</option>
                                                    <option value="48">48 Mo</option>
                                                    <option value="60">60 Mo</option>
                                                    <option value="72">72 Mo</option>
                                                    <option value="84">84 Mo</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #222' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', color: '#888', fontSize: '0.9rem', fontVariant: 'small-caps', fontWeight: 'bold' }}>
                                    <input type="checkbox" checked={showSold} onChange={(e) => setShowSold(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }} />
                                    INCLUDE SOLD UNITS
                                </label>
                            </div>
                        </div>{/* end filter-panel-content */}
                    </aside>

                    {/* Right Content */}
                    <main>
                        {/* Active Pills and Controls */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: '900', letterSpacing: '2px' }}>
                                    {filteredAndSortedVehicles.length} UNITS
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#555', fontWeight: '900', letterSpacing: '1px' }}>SORT BY</span>
                                    <select
                                        className="custom-select"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        style={{ fontSize: '0.85rem', padding: '0.5rem 1.5rem', width: 'auto', fontWeight: 'bold' }}
                                    >
                                        <option value="newest">NEWEST LISTED</option>
                                        <option value="price-asc">PRICE: LOW TO HIGH</option>
                                        <option value="price-desc">PRICE: HIGH TO LOW</option>
                                        <option value="year-desc">YEAR: NEWEST FIRST</option>
                                        <option value="mileage-asc">LOWEST MILEAGE</option>
                                    </select>
                                </div>
                            </div>

                            {activePills.length > 0 && (
                                <div className="active-pills-container">
                                    {activePills.map(pill => (
                                        <div key={pill.id} className="filter-pill" onClick={pill.clear}>
                                            <span style={{ textTransform: 'uppercase' }}>{pill.label}</span>
                                            <CloseIcon />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            setFilterType('All');
                                            setPriceRange({ min: '', max: '' });
                                            setYearRange({ min: '', max: '' });
                                            setShowSold(false);
                                            setFinanceSettings(f => ({ ...f, budgetMode: false }));
                                        }}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '900', marginLeft: '1rem', letterSpacing: '1px' }}
                                    >
                                        CLEAR ALL
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Results Grid */}
                        {filteredAndSortedVehicles.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '8rem 0', background: '#0a0a0a', borderRadius: '24px', border: '1px solid #1a1a1a' }}>
                                <div style={{ marginBottom: '1.5rem', color: '#333' }}>
                                    <SearchIcon />
                                </div>
                                <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 'bold' }}>NO VEHICLES MATCH THESE CRITERIA</p>
                                <button onClick={() => {
                                    setSearchQuery('');
                                    setFilterType('All');
                                    setPriceRange({ min: '', max: '' });
                                    setYearRange({ min: '', max: '' });
                                    setFinanceSettings(f => ({ ...f, budgetMode: false }));
                                }} className="btn" style={{ marginTop: '2rem', padding: '1rem 2.5rem' }}>RESET ALL FILTERS</button>
                            </div>
                        ) : (
                            <div className="vehicle-results-grid">
                                {filteredAndSortedVehicles.map(vehicle => {
                                    const estPayment = calculateMonthlyPayment(
                                        vehicle.price,
                                        financeSettings.downPayment,
                                        financeSettings.tradeIn,
                                        financeSettings.apr,
                                        financeSettings.term
                                    );

                                    return (
                                        <div key={vehicle.id} style={{ position: 'relative' }}>
                                            <VehicleCard vehicle={vehicle} />
                                            <div style={{ position: 'absolute', top: '1rem', left: '1rem', pointerEvents: 'none' }}>
                                                <div className="payment-badge">
                                                    EST. ${estPayment}/mo
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
