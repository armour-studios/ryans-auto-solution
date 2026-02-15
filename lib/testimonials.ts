import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export type Testimonial = {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    date: string;
};

const dataFilePath = path.join(process.cwd(), 'data/testimonials.json');

// Local filesystem functions (fallback/dev)
function getTestimonialsLocal(): Testimonial[] {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    try {
        const jsonData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("Error reading testimonials data:", error);
        return [];
    }
}

function saveTestimonialsLocal(testimonials: Testimonial[]) {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(testimonials, null, 2));
}

// Supabase functions
async function getTestimonialsSupabase(): Promise<Testimonial[]> {
    try {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error("Error reading testimonials from Supabase:", error);
            return [];
        }
        return data as Testimonial[] || [];
    } catch (error) {
        console.error("Error calling Supabase:", error);
        return [];
    }
}

async function saveTestimonialsSupabase(testimonials: Testimonial[]) {
    try {
        const { error } = await supabase
            .from('testimonials')
            .upsert(testimonials, { onConflict: 'id' });

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }
    } catch (e) {
        console.error("Failed to save testimonials to Supabase", e);
        throw e;
    }
}

// Export unified async functions
export async function getTestimonials(): Promise<Testimonial[]> {
    const data = await getTestimonialsSupabase();
    if (data && data.length > 0) return data;

    return getTestimonialsLocal();
}

export async function saveTestimonials(testimonials: Testimonial[]) {
    await saveTestimonialsSupabase(testimonials);
    if (process.env.NODE_ENV === 'development') {
        saveTestimonialsLocal(testimonials);
    }
}

export async function getTestimonialById(id: number): Promise<Testimonial | undefined> {
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return undefined;
    }
    return data as Testimonial;
}

