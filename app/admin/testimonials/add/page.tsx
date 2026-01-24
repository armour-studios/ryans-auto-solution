import AdminTestimonialForm from '@/components/AdminTestimonialForm';
import Link from 'next/link';

export const metadata = {
    title: 'Add Testimonial | Admin',
};

export default function AddTestimonialPage() {
    return (
        <div style={{ padding: '4rem 0', minHeight: '80vh' }}>
            <div className="container">
                <Link href="/admin/testimonials" style={{ color: '#888', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
                    &larr; Back to Testimonials
                </Link>
                <AdminTestimonialForm />
            </div>
        </div>
    );
}
