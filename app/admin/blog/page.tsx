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

                <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 2.5rem)' }}>Blog Management</h1>
                    <Link href="/admin/blog/add" className="btn" style={{ backgroundColor: '#222', color: '#fff', border: '1px solid #333', whiteSpace: 'nowrap' }}>
                        + ADD NEW POST
                    </Link>
                </div>

                {/* Desktop Table View */}
                <div className="admin-table-view" style={{ backgroundColor: '#222', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #333' }}>
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

                {/* Mobile Card View */}
                <div className="admin-card-view" style={{ display: 'none' }}>
                    {blogPosts.map(post => (
                        <div key={post.id} style={{
                            backgroundColor: '#111',
                            borderRadius: '12px',
                            border: '1px solid #222',
                            marginBottom: '1rem',
                            overflow: 'hidden'
                        }}>
                            <div style={{ padding: '1rem' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#eee', marginBottom: '0.35rem' }}>
                                    {post.title}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#666' }}>
                                    <span>{new Date(post.date).toLocaleDateString()}</span>
                                    <span>by {post.author}</span>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                borderTop: '1px solid #222',
                                backgroundColor: '#0d0d0d'
                            }}>
                                <Link
                                    href={`/admin/blog/edit/${post.id}`}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '0.85rem',
                                        color: 'var(--primary-color)',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem',
                                        textDecoration: 'none',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        borderRight: '1px solid #222'
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit
                                </Link>
                                <div style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <DeleteButton id={post.id} endpoint="/api/blog" />
                                </div>
                            </div>
                        </div>
                    ))}
                    {blogPosts.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#666', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #222' }}>
                            No blog posts found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
