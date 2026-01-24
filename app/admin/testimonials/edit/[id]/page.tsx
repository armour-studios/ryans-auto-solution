import AdminTestimonialForm from '@/components/AdminTestimonialForm';
import { getTestimonialById } from '@/lib/testimonials';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = {
    title: 'Edit Testimonial | Admin',
};

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const testimonial = getTestimonialById(Number(id));

    if (!testimonial) {
        notFound();
    }

    return (
        <div style={{ padding: '4rem 0', minHeight: '80vh' }}>
            <div className="container">
                <Link href="/admin/testimonials" style={{ color: '#888', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
                    &larr; Back to Testimonials
                </Link>
                <AdminTestimonialForm initialData={testimonial} />
            </div>
        </div>
    );
}
