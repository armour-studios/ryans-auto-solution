import { Redis } from '@upstash/redis';
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

// Create Redis client with flexible env var detection
function getRedisClient(): Redis | null {
    const url = process.env.KV_REST_API_URL ||
        process.env.UPSTASH_REDIS_REST_URL ||
        process.env.REDIS_URL;
    const token = process.env.KV_REST_API_TOKEN ||
        process.env.UPSTASH_REDIS_REST_TOKEN ||
        process.env.REDIS_TOKEN;

    if (url && token && !url.includes('provisioning')) {
        return new Redis({ url, token });
    }
    return null;
}

const hasRedis = () => getRedisClient() !== null;

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
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(testimonials, null, 2));
}

// Redis functions
async function getTestimonialsRedis(): Promise<Testimonial[]> {
    const redis = getRedisClient();
    if (!redis) return [];

    try {
        const data = await redis.get<Testimonial[]>(KV_KEY);
        return data || [];
    } catch (error) {
        console.error("Error reading testimonials from Redis:", error);
        return [];
    }
}

async function saveTestimonialsRedis(testimonials: Testimonial[]) {
    const redis = getRedisClient();
    if (!redis) throw new Error('Redis not configured');

    await redis.set(KV_KEY, testimonials);
}

// Export unified async functions
export async function getTestimonials(): Promise<Testimonial[]> {
    if (hasRedis()) {
        return getTestimonialsRedis();
    }
    return getTestimonialsLocal();
}

export async function saveTestimonials(testimonials: Testimonial[]) {
    if (hasRedis()) {
        await saveTestimonialsRedis(testimonials);
    } else {
        saveTestimonialsLocal(testimonials);
    }
}

export async function getTestimonialById(id: number): Promise<Testimonial | undefined> {
    const testimonials = await getTestimonials();
    return testimonials.find(t => t.id === id);
}
