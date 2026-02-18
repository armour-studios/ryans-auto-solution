"use client";

import { useState, useEffect, useRef } from 'react';
import { type Testimonial } from '@/lib/testimonials';

export default function Testimonials({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
    const [activeIndex, setActiveIndex] = useState(1); // Start at 1 because 0 is cloned last
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialTestimonials.length > 0) {
            // Clone first and last for infinite effect
            const clonedTestimonials = [
                initialTestimonials[initialTestimonials.length - 1],
                ...initialTestimonials,
                initialTestimonials[0]
            ];
            setTestimonials(clonedTestimonials);
        }
    }, [initialTestimonials]);

    const handleTransitionEnd = () => {
        setIsTransitioning(false);
        if (activeIndex === 0) {
            setActiveIndex(testimonials.length - 2);
        } else if (activeIndex === testimonials.length - 1) {
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
        if (testimonials.length <= 1) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length, isTransitioning]);

    if (testimonials.length === 0) return null;

    // The index for dots (1-based to original contents length)
    const dotIndex = activeIndex === 0
        ? initialTestimonials.length - 1
        : activeIndex === testimonials.length - 1
            ? 0
            : activeIndex - 1;

    return (
        <section style={{ padding: '6rem 0', backgroundColor: '#0a1628', color: '#fff', overflow: 'hidden' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '1rem', color: '#fff', letterSpacing: '1px' }}>
                        What Our <span style={{ color: 'var(--primary-color)' }}>Customers Say</span>
                    </h2>
                    <hr style={{ width: '80px', margin: '0 auto', border: '2px solid var(--primary-color)', opacity: 0.5 }} />
                </div>

                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                    <div
                        onTransitionEnd={handleTransitionEnd}
                        style={{
                            display: 'flex',
                            transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                            transform: `translateX(-${activeIndex * 100}%)`
                        }}
                    >
                        {testimonials.map((t, idx) => (
                            <div key={`${t.id}-${idx}`} style={{ minWidth: '100%', padding: '0 1rem' }}>
                                <div className="glass-card card-glow" style={{
                                    padding: 'clamp(1.5rem, 5vw, 3rem)',
                                    textAlign: 'center',
                                    position: 'relative',
                                    border: '1px solid rgba(15, 113, 177, 0.2)'
                                }}>
                                    <div style={{ color: 'var(--primary-color)', fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.2rem' }}>
                                        {[...Array(t.rating)].map((_, i) => (
                                            <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 'var(--font-size-p)', fontStyle: 'italic', marginBottom: '2rem', lineHeight: '1.8', color: '#eee' }}>
                                        &quot;{t.content}&quot;
                                    </p>
                                    <div>
                                        <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.name}</strong>
                                        <span style={{ fontSize: '0.85rem', color: '#888' }}>{t.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="hide-on-mobile"
                        style={{
                            position: 'absolute',
                            left: '-60px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-color)',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            opacity: 0.7,
                            transition: 'opacity 0.3s',
                            zIndex: 10
                        }}
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="hide-on-mobile"
                        style={{
                            position: 'absolute',
                            right: '-60px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-color)',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            opacity: 0.7,
                            transition: 'opacity 0.3s',
                            zIndex: 10
                        }}
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>

                    {/* Pagination Dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '3rem' }}>
                        {initialTestimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (isTransitioning) return;
                                    setIsTransitioning(true);
                                    setActiveIndex(index + 1);
                                }}
                                style={{
                                    width: index === dotIndex ? '30px' : '10px',
                                    height: '10px',
                                    borderRadius: '5px',
                                    backgroundColor: index === dotIndex ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
