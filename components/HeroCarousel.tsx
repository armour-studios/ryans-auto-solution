"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Vehicle } from "@/lib/inventory";

export default function HeroCarousel() {
    const [slides, setSlides] = useState<Vehicle[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/inventory')
            .then(res => res.json())
            .then((data: Vehicle[]) => {
                // Filter for trending, or fallback to first 3 available
                let trending = data.filter(v => v.trending && v.status === 'Available');
                if (trending.length === 0) {
                    trending = data.filter(v => v.status === 'Available').slice(0, 3);
                }
                setSlides(trending);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000); // 6 seconds
        return () => clearInterval(timer);
    }, [slides.length]);

    if (loading) return <div style={{ height: '600px', backgroundColor: '#000' }}></div>;

    // Fallback if no inventory
    if (slides.length === 0) {
        return (
            <section style={{ position: 'relative', height: '600px', backgroundColor: '#000', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="container" style={{ position: 'relative', zIndex: 2, color: 'white', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#fff' }}>RYAN'S AUTO SOLUTION</h1>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Quality used cars, fair prices and small town trust.</p>
                </div>
            </section>
        );
    }

    return (
        <section style={{ position: 'relative', height: '600px', backgroundColor: '#000', overflow: 'hidden' }}>
            {slides.map((vehicle, index) => (
                <div
                    key={vehicle.id}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentSlide ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {/* Overlay for readability */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))', zIndex: 1 }} />

                    <Image
                        src={vehicle.image}
                        alt={`${vehicle.year} ${vehicle.make}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority={index === 0}
                    />

                    <div className="container" style={{ position: 'relative', zIndex: 2, color: 'white', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Trending Now
                        </h2>
                        <h1 style={{ fontSize: '4rem', marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', color: '#fff' }}>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </h1>
                        <p style={{ fontSize: '1.8rem', marginBottom: '2rem', fontWeight: 'bold' }}>
                            ${vehicle.price.toLocaleString()}
                        </p>

                        <Link href={`/inventory/${vehicle.id}`} className="btn btn-accent" style={{ fontSize: '1.2rem', padding: '1rem 3rem', marginBottom: '3rem', display: 'inline-block' }}>
                            VIEW DETAILS
                        </Link>

                    </div>
                </div>
            ))}

            {/* Dots/Indicators */}
            <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '10px', zIndex: 10 }}>
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: idx === currentSlide ? 'var(--accent-color)' : 'rgba(255,255,255,0.5)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
        </section>
    );
}
