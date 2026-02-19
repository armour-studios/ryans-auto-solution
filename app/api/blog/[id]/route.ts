import { NextResponse } from 'next/server';
import { getBlogPosts, saveBlogPosts, deleteBlogPost } from '@/lib/blog';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const posts = await getBlogPosts();
        const index = posts.findIndex(p => p.id === parseInt(id));

        if (index === -1) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        posts[index] = { ...posts[index], ...body };
        await saveBlogPosts(posts);

        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        revalidatePath(`/blog/${posts[index].slug}`);

        return NextResponse.json(posts[index]);
    } catch (error) {
        console.error('Error updating blog post:', error);
        return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await deleteBlogPost(parseInt(id));

        revalidatePath('/blog');
        revalidatePath('/admin/blog');

        return NextResponse.json({ message: 'Deleted' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
    }
}
