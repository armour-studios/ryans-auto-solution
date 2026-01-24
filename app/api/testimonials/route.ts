import { NextResponse } from 'next/server';
import { getTestimonials, saveTestimonials, Testimonial } from '@/lib/testimonials';

export async function GET() {
    const testimonials = getTestimonials();
    return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const testimonials = getTestimonials();

        const newTestimonial: Testimonial = {
            id: Date.now(),
            name: body.name,
            role: body.role,
            content: body.content,
            rating: Number(body.rating),
            date: body.date || new Date().toISOString().split('T')[0]
        };

        testimonials.push(newTestimonial);
        saveTestimonials(testimonials);

        return NextResponse.json(newTestimonial, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}
