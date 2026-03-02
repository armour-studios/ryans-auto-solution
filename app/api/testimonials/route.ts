import { NextResponse } from 'next/server';
import { getTestimonials, Testimonial } from '@/lib/testimonials';
import { supabase } from '@/lib/supabase';

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

        const newTestimonial = {
            name: body.name,
            role: body.role || '',
            content: body.content,
            rating: Number(body.rating),
            date: body.date || new Date().toISOString().split('T')[0],
        };

        const { data, error } = await supabase
            .from('testimonials')
            .insert(newTestimonial)
            .select()
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
        }

        return NextResponse.json(data as Testimonial, { status: 201 });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}
