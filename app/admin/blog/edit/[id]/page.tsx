import AdminBlogForm from '@/components/AdminBlogForm';
import { getBlogPostById } from '@/lib/blog';
import { notFound } from 'next/navigation';

export const metadata = {
    title: 'Edit Blog Post',
};

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = getBlogPostById(parseInt(id));

    if (!post) {
        notFound();
    }

    return (
        <div style={{ padding: '4rem 0' }}>
            <div className="container">
                <AdminBlogForm initialData={post} />
            </div>
        </div>
    );
}
