import { NextResponse } from 'next/server';
import { getBlogPosts, saveBlogPosts } from '@/lib/blog';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const posts = getBlogPosts();
    const index = posts.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    posts[index] = { ...posts[index], ...body };
    saveBlogPosts(posts);

    return NextResponse.json(posts[index]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const posts = getBlogPosts();
    const newPosts = posts.filter(p => p.id !== parseInt(id));

    saveBlogPosts(newPosts);
    return NextResponse.json({ message: 'Deleted' });
}
