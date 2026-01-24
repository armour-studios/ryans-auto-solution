'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ValueYourTradePage() {
    const [formData, setFormData] = useState({
        year: '',
        make: '',
        model: '',
        trim: '',
        mileage: '',
        condition: 'Good',
        exteriorColor: '',
        interiorColor: '',
        transmission: 'Automatic',
        drivetrain: '4WD',
        hasAccidents: 'No',
        titleStatus: 'Clean',
        ownerCount: '1',
        features: [] as string[],
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        comments: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFeatureToggle = (feature: string) => {
        const features = formData.features.includes(feature)
            ? formData.features.filter(f => f !== feature)
            : [...formData.features, feature];
        setFormData({ ...formData, features });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const featureOptions = [
        'Leather Seats', 'Heated Seats', 'Navigation', 'Backup Camera',
        'Bluetooth', 'Sunroof/Moonroof', 'Remote Start', 'Tow Package',
        'Running Boards', 'Bed Liner', 'Alloy Wheels', 'Premium Audio'
    ];

    if (submitted) {
        return (
            <div style={{ padding: '6rem 0', color: '#fff', minHeight: '80vh', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>💰</div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>We&apos;ll Be In Touch!</h1>
                    <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem' }}>
                        Thank you for submitting your trade-in information. We&apos;ll evaluate your vehicle and send you an offer within 24-48 hours.
                    </p>
                    <Link href="/inventory" className="btn btn-primary">Browse Our Inventory</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '4rem 0', color: '#fff', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Link href="/financing" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        ← Back to Financing
                    </Link>
                    <h1 style={{ fontSize: '3rem', marginTop: '1rem', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--primary-color)' }}>
                        Value Your Trade
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '650px', margin: '0 auto' }}>
                        Get an instant estimate on your trade-in value. Simply fill out the details below and we&apos;ll provide a competitive offer.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ backgroundColor: '#111', padding: '3rem', borderRadius: '12px', border: '1px solid #333' }}>
                    {/* Vehicle Information */}
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)' }}>
                        Vehicle Information
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Year *</label>
                            <input type="text" name="year" value={formData.year} onChange={handleChange} required placeholder="2018"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Make *</label>
                            <input type="text" name="make" value={formData.make} onChange={handleChange} required placeholder="Ford"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Model *</label>
                            <input type="text" name="model" value={formData.model} onChange={handleChange} required placeholder="F-150"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Trim</label>
                            <input type="text" name="trim" value={formData.trim} onChange={handleChange} placeholder="XLT"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Mileage *</label>
                            <input type="text" name="mileage" value={formData.mileage} onChange={handleChange} required placeholder="75,000"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Exterior Color</label>
                            <input type="text" name="exteriorColor" value={formData.exteriorColor} onChange={handleChange} placeholder="Black"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Interior Color</label>
                            <input type="text" name="interiorColor" value={formData.interiorColor} onChange={handleChange} placeholder="Gray"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Condition *</label>
                            <select name="condition" value={formData.condition} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}>
                                <option>Excellent</option>
                                <option>Good</option>
                                <option>Fair</option>
                                <option>Poor</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Transmission</label>
                            <select name="transmission" value={formData.transmission} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}>
                                <option>Automatic</option>
                                <option>Manual</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Drivetrain</label>
                            <select name="drivetrain" value={formData.drivetrain} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}>
                                <option>4WD</option>
                                <option>AWD</option>
                                <option>FWD</option>
                                <option>RWD</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}># of Owners</label>
                            <select name="ownerCount" value={formData.ownerCount} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}>
                                <option>1</option>
                                <option>2</option>
                                <option>3+</option>
                            </select>
                        </div>
                    </div>

                    {/* Vehicle History */}
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)' }}>
                        Vehicle History
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Any Accidents?</label>
                            <select name="hasAccidents" value={formData.hasAccidents} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}>
                                <option>No</option>
                                <option>Yes - Minor</option>
                                <option>Yes - Major</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title Status</label>
                            <select name="titleStatus" value={formData.titleStatus} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}>
                                <option>Clean</option>
                                <option>Salvage</option>
                                <option>Rebuilt</option>
                                <option>Lien</option>
                            </select>
                        </div>
                    </div>

                    {/* Features */}
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)' }}>
                        Features (Select All That Apply)
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                        {featureOptions.map(feature => (
                            <label key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem', backgroundColor: formData.features.includes(feature) ? 'rgba(0,123,255,0.2)' : 'transparent', borderRadius: '6px', border: '1px solid #333' }}>
                                <input type="checkbox" checked={formData.features.includes(feature)} onChange={() => handleFeatureToggle(feature)} style={{ accentColor: 'var(--primary-color)' }} />
                                <span style={{ fontSize: '0.9rem' }}>{feature}</span>
                            </label>
                        ))}
                    </div>

                    {/* Contact Information */}
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)' }}>
                        Your Contact Information
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>First Name *</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Last Name *</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email Address *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone Number *</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Additional Comments</label>
                        <textarea name="comments" value={formData.comments} onChange={handleChange} rows={4} placeholder="Any additional details about your vehicle..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', resize: 'vertical' }} />
                    </div>

                    <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '1.25rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        Get My Trade-In Value
                    </button>
                </form>
            </div>
        </div>
    );
}
