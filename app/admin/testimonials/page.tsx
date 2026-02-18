import Link from 'next/link';
import { getTestimonials } from '@/lib/testimonials';
import DeleteButton from '@/components/DeleteButton';

export const metadata = {
    title: 'Manage Testimonials | Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
    const testimonials = await getTestimonials();

    // Sort by date desc
    const sortedTestimonials = [...testimonials].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div style={{ padding: '2rem 0', minHeight: '80vh', color: '#fff' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase', color: 'var(--primary-color)', margin: 0 }}>Testimonials</h1>
                    <Link href="/admin/testimonials/add" className="btn btn-primary">
                        + Add New Testimonial
                    </Link>
                </div>

                {sortedTestimonials.length === 0 ? (
                    <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#222', borderRadius: '8px', color: '#888' }}>
                        No testimonials found. Add one to get started.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {sortedTestimonials.map((t) => (
                            <div key={t.id} style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{t.name}</h3>
                                    <span style={{ color: '#666', fontSize: '0.8rem' }}>{t.date}</span>
                                </div>
                                <div style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'flex', gap: '2px' }}>
                                    {[...Array(t.rating)].map((_, i) => (
                                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                    ))}
                                </div>
                                <p style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                    &quot;{t.content.length > 100 ? t.content.substring(0, 100) + '...' : t.content}&quot;
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <Link href={`/admin/testimonials/edit/${t.id}`} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                                        Edit
                                    </Link>
                                    <DeleteButton id={t.id} endpoint="/api/testimonials" itemName="this testimonial" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
