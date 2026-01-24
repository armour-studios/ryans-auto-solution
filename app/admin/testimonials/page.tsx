import Link from 'next/link';
import { getTestimonials } from '@/lib/testimonials';

export const metadata = {
    title: 'Manage Testimonials | Admin',
};

export default function AdminTestimonialsPage() {
    const testimonials = getTestimonials();

    // Sort by date desc
    const sortedTestimonials = [...testimonials].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div style={{ padding: '2rem 0', minHeight: '80vh', color: '#fff' }}>
            <div className="container">
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/admin" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem' }}>
                        ← Back to Dashboard
                    </Link>
                </div>

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
                            <div key={t.id} style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{t.name}</h3>
                                    <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{t.date}</span>
                                </div>
                                <div style={{ color: 'gold', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                                    {'⭐'.repeat(t.rating)}
                                </div>
                                <p style={{ color: '#ccc', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                    "{t.content.length > 100 ? t.content.substring(0, 100) + '...' : t.content}"
                                </p>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Link href={`/admin/testimonials/edit/${t.id}`} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                                        Edit
                                    </Link>
                                    <form action={`/api/testimonials/${t.id}`} method="POST" style={{ display: 'inline' }}>
                                        {/* Note: In a real app we'd use a client component for delete or a server action. For simplicity, we'll assume the edit page has delete or use a client deletion button component. Actually, let's just use the edit page to delete or keep it simple. */}
                                    </form>
                                    {/* Since delete needs JS or a form action, let's stick to Edit for now which can have a delete button inside or just Link to edit. */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
