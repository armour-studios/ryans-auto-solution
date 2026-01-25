import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';

export type BlogPost = {
    id: number;
    title: string;
    slug: string;
    date: string;
    author: string;
    excerpt: string;
    content: string;
    image?: string;
    seoTitle?: string;
    seoDescription?: string;
    tags?: string[];
};

const dataFilePath = path.join(process.cwd(), 'data/blog.json');
const KV_KEY = 'blog_posts';

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
function getBlogPostsLocal(): BlogPost[] {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    try {
        const jsonData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("Error reading blog data:", error);
        return [];
    }
}

function saveBlogPostsLocal(posts: BlogPost[]) {
    fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
}

// Redis functions
async function getBlogPostsRedis(): Promise<BlogPost[]> {
    const redis = getRedisClient();
    if (!redis) return [];

    try {
        const data = await redis.get<BlogPost[]>(KV_KEY);
        return data || [];
    } catch (error) {
        console.error("Error reading blog from Redis:", error);
        return [];
    }
}

async function saveBlogPostsRedis(posts: BlogPost[]) {
    const redis = getRedisClient();
    if (!redis) throw new Error('Redis not configured');

    await redis.set(KV_KEY, posts);
}

// Export unified async functions
export async function getBlogPosts(): Promise<BlogPost[]> {
    if (hasRedis()) {
        return getBlogPostsRedis();
    }
    return getBlogPostsLocal();
}

export async function saveBlogPosts(posts: BlogPost[]) {
    if (hasRedis()) {
        await saveBlogPostsRedis(posts);
    } else {
        saveBlogPostsLocal(posts);
    }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const posts = await getBlogPosts();
    return posts.find(p => p.slug === slug);
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const posts = await getBlogPosts();
    return posts.find(p => p.id === id);
}
