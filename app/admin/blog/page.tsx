import { getBlogPosts } from '@/lib/blog';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

export const metadata = {
    title: 'Blog Management',
};

export const dynamic = 'force-dynamic';

export default async function BlogAdminPage() {
    const blogPosts = await getBlogPosts();

    return (
        <div style={{ padding: '2rem 0' }}>
            <div className="container">

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem' }}>Blog Management</h1>
                    <Link href="/admin/blog/add" className="btn" style={{ backgroundColor: '#222', color: '#fff', border: '1px solid #333' }}>
                        + ADD NEW POST
                    </Link>
                </div>

                <div style={{ backgroundColor: '#222', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #333' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                        <thead style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>Date</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>Title</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>Author</th>
                                <th style={{ padding: '1rem', textAlign: 'right', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogPosts.map(post => (
                                <tr key={post.id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: '#666' }}>{new Date(post.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>{post.title}</td>
                                    <td style={{ padding: '1rem', color: '#888' }}>{post.author}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <Link href={`/admin/blog/edit/${post.id}`} className="btn" style={{ marginRight: '0.5rem', padding: '0.25rem 0.75rem', fontSize: '0.8rem', backgroundColor: '#333' }}>Edit</Link>
                                        <DeleteButton id={post.id} endpoint="/api/blog" />
                                    </td>
                                </tr>
                            ))}
                            {blogPosts.length === 0 && (
                                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>No blog posts found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
