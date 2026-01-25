import { NextResponse } from 'next/server';
import { getTestimonials, saveTestimonials } from '@/lib/testimonials';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const testimonials = await getTestimonials();
        const index = testimonials.findIndex(t => t.id === Number(id));

        if (index === -1) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
        }

        testimonials[index] = { ...testimonials[index], ...body, id: Number(id) };
        await saveTestimonials(testimonials);

        return NextResponse.json(testimonials[index]);
    } catch (error) {
        console.error('Error updating testimonial:', error);
        return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const testimonials = await getTestimonials();
        const filtered = testimonials.filter(t => t.id !== Number(id));
        await saveTestimonials(filtered);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }
}
