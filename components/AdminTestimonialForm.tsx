"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminTestimonialForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [formData, setFormData] = useState(initialData || {
        name: '',
        role: '',
        content: '',
        rating: 5,
        date: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = initialData ? `/api/testimonials/${initialData.id}` : '/api/testimonials';
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/admin/testimonials');
                router.refresh();
            } else {
                alert('Failed to save testimonial');
            }
        } catch (err) {
            console.error(err);
            alert('Error saving testimonial');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#222', padding: '2rem', borderRadius: '8px', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
            <h2 style={{ marginBottom: '2rem', textTransform: 'uppercase', color: 'var(--primary-color)' }}>
                {initialData ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Client Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Location / Role</label>
                <input required name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Bemidji, MN" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Rating</label>
                <select name="rating" value={formData.rating} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }}>
                    <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                    <option value="3">⭐⭐⭐ (3 Stars)</option>
                    <option value="2">⭐⭐ (2 Stars)</option>
                    <option value="1">⭐ (1 Star)</option>
                </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Review Content</label>
                <textarea required name="content" value={formData.content} onChange={handleChange} rows={5} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#333', color: '#fff' }} />
            </div>

            <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 'bold' }}>
                {initialData ? 'Update Testimonial' : 'Add Testimonial'}
            </button>
        </form>
    );
}
