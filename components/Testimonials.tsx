"use client";

import { useState } from 'react';

const testimonials = [
    {
        id: 1,
        name: "John D.",
        location: "Cartown, USA",
        text: "Ryan's Auto Solution made buying my truck incredibly easy. No pressure, fair prices, and the vehicle was exactly as described.",
        rating: 5,
    },
    {
        id: 2,
        name: "Sarah M.",
        location: "Nearby City",
        text: "I was hesitant to buy a used car, but the team here was so transparent. They even showed me a video walkthrough before I drove down!",
        rating: 5,
    },
    {
        id: 3,
        name: "Mike T.",
        location: "Local Customer",
        text: "Best dealership in town. They gave me a great deal on my trade-in and I drove off in a Mustang the same day.",
        rating: 5,
    }
];

export default function Testimonials() {
    return (
        <section style={{ padding: '4rem 0', backgroundColor: '#111', color: '#fff' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>What Our Customers Say</h2>
                    <hr style={{ width: '100px', margin: '0 auto', border: '2px solid var(--primary-color)' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {testimonials.map((t) => (
                        <div key={t.id} style={{
                            backgroundColor: 'var(--card-bg)',
                            padding: '2rem',
                            borderRadius: '4px',
                            border: '1px solid #333',
                            position: 'relative'
                        }}>
                            <div style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                                {"★".repeat(t.rating)}
                            </div>
                            <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6', color: '#ccc' }}>
                                "{t.text}"
                            </p>
                            <div>
                                <strong style={{ display: 'block', fontSize: '1.1rem' }}>{t.name}</strong>
                                <span style={{ fontSize: '0.9rem', color: '#888' }}>{t.location}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
