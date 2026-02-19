import { supabase } from '@/lib/supabase';
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

// Local filesystem functions (fallback/dev)
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
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2));
}

// Supabase functions
async function getBlogPostsSupabase(): Promise<BlogPost[]> {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error("Error reading blog posts from Supabase:", error);
            // Fallback to local if error?
            return [];
        }
        return data as BlogPost[] || [];
    } catch (error) {
        console.error("Error calling Supabase:", error);
        return [];
    }
}

async function saveBlogPostsSupabase(posts: BlogPost[]) {
    try {
        const { error } = await supabase
            .from('blog_posts')
            .upsert(posts, { onConflict: 'id' });

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }
    } catch (e) {
        console.error("Failed to save blog posts to Supabase", e);
        throw e;
    }
}

// Export unified async functions
export async function getBlogPosts(): Promise<BlogPost[]> {
    const data = await getBlogPostsSupabase();
    if (data && data.length > 0) return data;

    // Fallback?
    return getBlogPostsLocal();
}

export async function saveBlogPosts(posts: BlogPost[]) {
    await saveBlogPostsSupabase(posts);
    if (process.env.NODE_ENV === 'development') {
        saveBlogPostsLocal(posts);
    }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        // Fallback to full list search if single query fails (e.g. if table structure mismatch or other issue)
        // Or checking local
        const local = getBlogPostsLocal();
        return local.find(p => p.slug === slug);
    }
    return data as BlogPost;
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return undefined;
    }
    return data as BlogPost;
}

export async function deleteBlogPost(id: number): Promise<void> {
    try {
        // Delete from Supabase
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting from Supabase:', error);
        }

        // Delete from local file in development
        if (process.env.NODE_ENV === 'development') {
            const posts = getBlogPostsLocal();
            const newPosts = posts.filter(p => p.id !== id);
            saveBlogPostsLocal(newPosts);
        }
    } catch (error) {
        console.error('Error in deleteBlogPost:', error);
        throw error;
    }
}

