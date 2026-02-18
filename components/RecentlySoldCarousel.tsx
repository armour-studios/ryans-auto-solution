"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type Vehicle } from '@/lib/inventory';

export default function RecentlySoldCarousel({ initialVehicles }: { initialVehicles: Vehicle[] }) {
    const [activeIndex, setActiveIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [soldVehicles, setSoldVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        if (initialVehicles.length > 0) {
            // Clone first and last for infinite effect
            const cloned = [
                initialVehicles[initialVehicles.length - 1],
                ...initialVehicles,
                initialVehicles[0]
            ];
            setSoldVehicles(cloned);
        }
    }, [initialVehicles]);

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        if (activeIndex === 0) {
            setActiveIndex(soldVehicles.length - 2);
        } else if (activeIndex === soldVehicles.length - 1) {
            setActiveIndex(1);
        }
    };

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex((prev) => prev + 1);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex((prev) => prev - 1);
    };

    useEffect(() => {
        if (soldVehicles.length <= 1) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(interval);
    }, [soldVehicles.length, isTransitioning]);

    if (soldVehicles.length === 0) return null;

    // Dot index logic
    const dotIndex = activeIndex === 0
        ? initialVehicles.length - 1
        : activeIndex === soldVehicles.length - 1
            ? 0
            : activeIndex - 1;

    return (
        <section style={{ padding: '6rem 0', background: '#000', borderTop: '1px solid #222' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '1rem', color: '#fff', letterSpacing: '1px' }}>
                        Recently <span style={{ color: 'var(--primary-color)' }}>Sold</span>
                    </h2>
                    <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto' }}>
                        Join our family of happy customers. These vehicles have found their new homes!
                    </p>
                </div>

                <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto', overflow: 'hidden' }}>
                    <div
                        onTransitionEnd={handleTransitionEnd}
                        style={{
                            display: 'flex',
                            transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                            transform: `translateX(-${activeIndex * 100}%)`
                        }}
                    >
                        {soldVehicles.map((vehicle, idx) => (
                            <div key={`${vehicle.id}-${idx}`} style={{ minWidth: '100%', padding: '0 1rem' }}>
                                <div className="card-glow" style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    backgroundColor: '#111',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1px solid #222',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ position: 'relative', height: '350px', backgroundColor: '#000' }}>
                                        <Image
                                            src={vehicle.image}
                                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                            fill
                                            style={{ objectFit: 'cover', opacity: 0.8 }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '1.5rem',
                                            left: '1.5rem',
                                            backgroundColor: '#ef4444',
                                            color: '#fff',
                                            padding: '0.5rem 1.5rem',
                                            fontWeight: 'bold',
                                            borderRadius: '4px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                                        }}>
                                            Sold
                                        </div>
                                    </div>
                                    <div style={{ padding: '3rem' }}>
                                        <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>
                                            {vehicle.year} {vehicle.make} {vehicle.model}
                                        </h3>
                                        <p style={{ color: '#999', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                                            {vehicle.description.length > 150 ? vehicle.description.substring(0, 150) + '...' : vehicle.description}
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ backgroundColor: '#222', padding: '0.75rem 1.25rem', borderRadius: '8px', textAlign: 'center' }}>
                                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>Mileage</span>
                                                <span style={{ fontWeight: 'bold' }}>{vehicle.mileage.toLocaleString()} mi</span>
                                            </div>
                                            <div style={{ backgroundColor: '#222', padding: '0.75rem 1.25rem', borderRadius: '8px', textAlign: 'center' }}>
                                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>Status</span>
                                                <span style={{ fontWeight: 'bold', color: '#ef4444' }}>Gone!</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    {initialVehicles.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                style={{
                                    position: 'absolute',
                                    left: '0',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.5)',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    zIndex: 10,
                                    borderRadius: '0 8px 8px 0'
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0,0,0,0.5)',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    zIndex: 10,
                                    borderRadius: '8px 0 0 8px'
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Pagination Bars */}
                    {initialVehicles.length > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem' }}>
                            {initialVehicles.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (isTransitioning) return;
                                        setIsTransitioning(true);
                                        setActiveIndex(index + 1);
                                    }}
                                    style={{
                                        width: '40px',
                                        height: '4px',
                                        backgroundColor: index === dotIndex ? 'var(--primary-color)' : '#333',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    div[style*="gridTemplateColumns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
}
