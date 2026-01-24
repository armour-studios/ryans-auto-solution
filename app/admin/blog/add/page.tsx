import AdminBlogForm from '@/components/AdminBlogForm';

export const metadata = {
    title: 'Add New Blog Post',
};

export default function AddBlogPostPage() {
    return (
        <div style={{ padding: '4rem 0' }}>
            <div className="container">
                <AdminBlogForm />
            </div>
        </div>
    );
}
