import { kv } from '@vercel/kv';
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

// Check if we're running on Vercel with KV configured
const isVercelKV = () => {
    return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

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

// Vercel KV functions
async function getBlogPostsKV(): Promise<BlogPost[]> {
    try {
        const data = await kv.get<BlogPost[]>(KV_KEY);
        return data || [];
    } catch (error) {
        console.error("Error reading blog from KV:", error);
        return [];
    }
}

async function saveBlogPostsKV(posts: BlogPost[]) {
    await kv.set(KV_KEY, posts);
}

// Export unified async functions
export async function getBlogPosts(): Promise<BlogPost[]> {
    if (isVercelKV()) {
        return getBlogPostsKV();
    }
    return getBlogPostsLocal();
}

export async function saveBlogPosts(posts: BlogPost[]) {
    if (isVercelKV()) {
        await saveBlogPostsKV(posts);
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
