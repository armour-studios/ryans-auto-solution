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

export function getBlogPosts(): BlogPost[] {
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

export function saveBlogPosts(posts: BlogPost[]) {
    fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
    const posts = getBlogPosts();
    return posts.find(p => p.slug === slug);
}

export function getBlogPostById(id: number): BlogPost | undefined {
    const posts = getBlogPosts();
    return posts.find(p => p.id === id);
}
