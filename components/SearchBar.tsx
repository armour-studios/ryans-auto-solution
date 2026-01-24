"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type SimpleVehicle = {
    id: number;
    year: number;
    make: string;
    model: string;
}

export default function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SimpleVehicle[]>([]);
    const [allVehicles, setAllVehicles] = useState<SimpleVehicle[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        // Fetch basic inventory data for search
        fetch('/api/inventory')
            .then(res => res.json())
            .then(data => setAllVehicles(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (query.length > 1) {
            const lowerQuery = query.toLowerCase();
            const filtered = allVehicles.filter(v =>
                `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(lowerQuery)
            );
            setSuggestions(filtered.slice(0, 5)); // Limit to 5
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [query, allVehicles]);

    const handleSelect = (id: number) => {
        router.push(`/inventory/${id}`);
        setShowSuggestions(false);
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <input
                type="text"
                placeholder="Search vehicle (e.g. 2015 Honda)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '30px', // Rounder for modern feel
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    fontSize: '1rem',
                    outline: 'none'
                }}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul style={{
                    position: 'absolute',
                    top: '120%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    listStyle: 'none',
                    zIndex: 10,
                    overflow: 'hidden'
                }}>
                    {suggestions.map(vehicle => (
                        <li
                            key={vehicle.id}
                            onClick={() => handleSelect(vehicle.id)}
                            style={{
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                borderBottom: '1px solid #eee',
                                color: '#333'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                        >
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
