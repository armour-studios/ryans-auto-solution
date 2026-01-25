import { NextResponse } from 'next/server';
import { getTestimonials, saveTestimonials, Testimonial } from '@/lib/testimonials';

export async function GET() {
    try {
        const testimonials = await getTestimonials();
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const testimonials = await getTestimonials();

        const newTestimonial: Testimonial = {
            id: Date.now(),
            name: body.name,
            role: body.role,
            content: body.content,
            rating: Number(body.rating),
            date: body.date || new Date().toISOString().split('T')[0]
        };

        testimonials.push(newTestimonial);
        await saveTestimonials(testimonials);

        return NextResponse.json(newTestimonial, { status: 201 });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}
