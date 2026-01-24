import { NextResponse } from 'next/server';
import { getBlogPosts, saveBlogPosts, BlogPost } from '@/lib/blog';

export async function GET() {
    const posts = getBlogPosts();
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    const body = await request.json();
    const posts = getBlogPosts();

    const newPost = {
        id: Date.now(),
        ...body,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    };

    posts.push(newPost as BlogPost);
    saveBlogPosts(posts);

    return NextResponse.json(newPost, { status: 201 });
}
