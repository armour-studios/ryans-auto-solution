'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ApplyForFinancingPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: 'MN',
        zip: '',
        employmentStatus: 'Employed Full-Time',
        employer: '',
        monthlyIncome: '',
        housingStatus: 'Rent',
        monthlyPayment: '',
        creditScore: 'Good (670-739)',
        vehicleInterest: '',
        downPayment: '',
        tradeIn: 'No',
        comments: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div style={{ padding: '6rem 0', color: '#fff', minHeight: '80vh', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '600px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✓</div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Application Submitted!</h1>
                    <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem' }}>
                        Thank you for your interest! We&apos;ll review your application and contact you within 24 hours.
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
                        Apply For Financing
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px', margin: '0 auto' }}>
                        Complete the form below to get pre-qualified. No obligation, no impact on your credit score.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ backgroundColor: '#111', padding: '3rem', borderRadius: '12px', border: '1px solid #333' }}>
                    {/* Personal Information */}
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)' }}>
                        Personal Information
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
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

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Street Address *</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>City *</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>ZIP Code *</label>
                            <input type="text" name="zip" value={formData.zip} onChange={handleChange} required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                    </div>

                    {/* Employment Information */}
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)' }}>
                        Employment Information
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Employment Status *</label>
                            <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}>
                                <option>Employed Full-Time</option>
                                <option>Employed Part-Time</option>
                                <option>Self-Employed</option>
                                <option>Retired</option>
                                <option>Student</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Employer Name</label>
                            <input type="text" name="employer" value={formData.employer} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Monthly Income *</label>
                            <input type="text" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} required placeholder="$"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Estimated Credit Score</label>
                            <select name="creditScore" value={formData.creditScore} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}>
                                <option>Excellent (740+)</option>
                                <option>Good (670-739)</option>
                                <option>Fair (580-669)</option>
                                <option>Poor (Below 580)</option>
                                <option>Not Sure</option>
                            </select>
                        </div>
                    </div>

                    {/* Housing Information */}
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)' }}>
                        Housing Information
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Housing Status</label>
                            <select name="housingStatus" value={formData.housingStatus} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}>
                                <option>Rent</option>
                                <option>Own</option>
                                <option>Live with Family</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Monthly Rent/Mortgage</label>
                            <input type="text" name="monthlyPayment" value={formData.monthlyPayment} onChange={handleChange} placeholder="$"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                    </div>

                    {/* Vehicle Interest */}
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--primary-color)' }}>
                        Vehicle Interest
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Vehicle You&apos;re Interested In</label>
                            <input type="text" name="vehicleInterest" value={formData.vehicleInterest} onChange={handleChange} placeholder="e.g. 2018 Ford F-150"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Down Payment Available</label>
                            <input type="text" name="downPayment" value={formData.downPayment} onChange={handleChange} placeholder="$"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }} />
                        </div>
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Do you have a trade-in?</label>
                        <select name="tradeIn" value={formData.tradeIn} onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}>
                            <option>No</option>
                            <option>Yes</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Additional Comments</label>
                        <textarea name="comments" value={formData.comments} onChange={handleChange} rows={4}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', resize: 'vertical' }} />
                    </div>

                    <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '1.25rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        Submit Application
                    </button>
                    <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
                        * This is a pre-qualification inquiry only. No credit check will be performed at this stage.
                    </p>
                </form>
            </div>
        </div>
    );
}
