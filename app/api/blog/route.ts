import { NextResponse } from 'next/server';
import { getBlogPosts, saveBlogPosts, BlogPost } from '@/lib/blog';

export async function GET() {
    try {
        const posts = await getBlogPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const posts = await getBlogPosts();

        const newPost = {
            id: Date.now(),
            ...body,
            slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        };

        posts.push(newPost as BlogPost);
        await saveBlogPosts(posts);

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }
}
