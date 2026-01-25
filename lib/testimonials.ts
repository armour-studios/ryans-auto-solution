import { kv } from '@vercel/kv';
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
const KV_KEY = 'testimonials';

// Check if we're running on Vercel with KV configured
const isVercelKV = () => {
    return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// Local filesystem functions
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
    // Ensure data directory exists
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(testimonials, null, 2));
}

// Vercel KV functions
async function getTestimonialsKV(): Promise<Testimonial[]> {
    try {
        const data = await kv.get<Testimonial[]>(KV_KEY);
        return data || [];
    } catch (error) {
        console.error("Error reading testimonials from KV:", error);
        return [];
    }
}

async function saveTestimonialsKV(testimonials: Testimonial[]) {
    await kv.set(KV_KEY, testimonials);
}

// Export unified async functions
export async function getTestimonials(): Promise<Testimonial[]> {
    if (isVercelKV()) {
        return getTestimonialsKV();
    }
    return getTestimonialsLocal();
}

export async function saveTestimonials(testimonials: Testimonial[]) {
    if (isVercelKV()) {
        await saveTestimonialsKV(testimonials);
    } else {
        saveTestimonialsLocal(testimonials);
    }
}

export async function getTestimonialById(id: number): Promise<Testimonial | undefined> {
    const testimonials = await getTestimonials();
    return testimonials.find(t => t.id === id);
}
