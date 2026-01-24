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

export function getTestimonials(): Testimonial[] {
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

export function saveTestimonials(testimonials: Testimonial[]) {
    // Ensure data directory exists
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(testimonials, null, 2));
}

export function getTestimonialById(id: number): Testimonial | undefined {
    const testimonials = getTestimonials();
    return testimonials.find(t => t.id === id);
}
