"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Vehicle = {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    status: string;
    image: string;
    trending?: boolean;
};

export default function FeaturedVehicles({ vehicles }: { vehicles: Vehicle[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-rotate carousel
    useEffect(() => {
        if (vehicles.length <= 1) return;

        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % vehicles.length);
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [vehicles.length]);

    const goToSlide = (index: number) => {
        setActiveIndex(index);
        // Reset interval on manual navigation
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % vehicles.length);
            }, 5000);
        }
    };

    const nextSlide = () => {
        goToSlide((activeIndex + 1) % vehicles.length);
    };

    const prevSlide = () => {
        goToSlide((activeIndex - 1 + vehicles.length) % vehicles.length);
    };

    if (vehicles.length === 0) {
        return null;
    }

    const currentVehicle = vehicles[activeIndex];

    return (
        <section style={{ padding: '4rem 0', backgroundColor: '#0a0a0a' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span style={{
                        display: 'inline-block',
                        color: 'var(--primary-color)',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold'
                    }}>
                        Featured Inventory
                    </span>
                    <h2 style={{
                        fontSize: '2.5rem',
                        textTransform: 'uppercase',
                        color: '#fff',
                        margin: 0
                    }}>
                        New <span style={{ color: 'var(--primary-color)' }}>Arrivals</span>
                    </h2>
                </div>

                {/* Carousel Container */}
                <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
                    {/* Main Slide */}
                    <Link href={`/inventory/${currentVehicle.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                        <div style={{
                            position: 'relative',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            backgroundColor: '#111',
                            border: '1px solid #333',
                            transition: 'transform 0.3s ease'
                        }}>
                            {/* Image */}
                            <div style={{ position: 'relative', height: '450px' }}>
                                <Image
                                    src={currentVehicle.image}
                                    alt={`${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority
                                />

                                {/* Gradient overlay */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '50%',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                                }} />

                                {/* Featured Badge */}
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    background: 'linear-gradient(135deg, var(--primary-color), #0056b3)',
                                    color: '#fff',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    ⭐ Featured
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '2rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end'
                            }}>
                                <div>
                                    <h3 style={{
                                        fontSize: '1.8rem',
                                        color: '#fff',
                                        margin: 0,
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase'
                                    }}>
                                        {currentVehicle.year} {currentVehicle.make} {currentVehicle.model}
                                    </h3>
                                    <p style={{ color: '#888', margin: 0, fontSize: '1rem' }}>
                                        {currentVehicle.mileage.toLocaleString()} miles
                                    </p>
                                </div>
                                <div style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: 'var(--primary-color)'
                                }}>
                                    ${currentVehicle.price.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Navigation Arrows */}
                    {vehicles.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.preventDefault(); prevSlide(); }}
                                style={{
                                    position: 'absolute',
                                    left: '-60px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    border: '1px solid #333',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                ←
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); nextSlide(); }}
                                style={{
                                    position: 'absolute',
                                    right: '-60px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    border: '1px solid #333',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                →
                            </button>
                        </>
                    )}

                    {/* Dots Indicator */}
                    {vehicles.length > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            marginTop: '1.5rem'
                        }}>
                            {vehicles.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goToSlide(idx)}
                                    style={{
                                        width: idx === activeIndex ? '30px' : '10px',
                                        height: '10px',
                                        borderRadius: '5px',
                                        backgroundColor: idx === activeIndex ? 'var(--primary-color)' : '#333',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* View All Link */}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Link
                        href="/inventory"
                        style={{
                            color: 'var(--primary-color)',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        View All Inventory →
                    </Link>
                </div>
            </div>
        </section>
    );
}
