import { getBlogPosts } from '@/lib/blog';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Blog | Ryan\'s Auto Solution',
    description: 'Latest automotive news, tips, and inventory updates from Ryan\'s Auto Solution.',
};

export default function BlogPage() {
    const allPosts = getBlogPosts();
    // Sort by date desc
    const sortedPosts = [...allPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Featured Post (Latest)
    const featuredPost = sortedPosts[0];
    const otherPosts = sortedPosts.slice(1);

    // Mock trending for now (or just use random posts)
    const trendingPosts = sortedPosts.slice(0, 3); // Just select top 3 for demo

    return (
        <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '2rem 0' }}>
            <div className="container">
                <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '2px' }}>
                        Latest News <span style={{ color: 'var(--primary-color)' }}>& Tips</span>
                    </h1>
                    <p style={{ color: '#888', fontSize: '1.1rem' }}>Insights from the auto experts at Ryan's Auto Solution</p>
                    <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--primary-color)', margin: '1.5rem auto 0' }}></div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: '3rem', alignItems: 'start' }}>

                    {/* LEFT COLUMN (Featured + Grid) */}
                    <div>
                        {featuredPost ? (
                            <section style={{ marginBottom: '4rem' }}>
                                <Link href={`/blog/${featuredPost.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '450px', border: '1px solid #333' }}>
                                        {featuredPost.image ? (
                                            <Image src={featuredPost.image} alt={featuredPost.title} fill style={{ objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                                                No Cover Image
                                            </div>
                                        )}
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                            padding: '2rem', paddingTop: '6rem'
                                        }}>
                                            <span style={{ backgroundColor: 'var(--primary-color)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'inline-block' }}>
                                                Featured
                                            </span>
                                            <h2 style={{ fontSize: '2.5rem', lineHeight: '1.1', marginBottom: '0.5rem' }}>{featuredPost.title}</h2>
                                            <p style={{ color: '#ccc', fontSize: '1rem', maxWidth: '600px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {featuredPost.excerpt}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </section>
                        ) : (
                            <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#222', borderRadius: '8px', marginBottom: '4rem' }}>No posts available.</div>
                        )}

                        {/* Recent Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {otherPosts.map(post => (
                                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333', height: '100%', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ position: 'relative', height: '200px', backgroundColor: '#222' }}>
                                            {post.image && <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} />}
                                            {post.tags && post.tags[0] && (
                                                <span style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                                    {post.tags[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                                                <span style={{ textTransform: 'uppercase' }}>{post.author}</span>
                                                <span>{new Date(post.date).toLocaleDateString()}</span>
                                            </div>
                                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', lineHeight: '1.3' }}>{post.title}</h3>
                                            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                                {post.excerpt.length > 80 ? post.excerpt.substring(0, 80) + '...' : post.excerpt}
                                            </p>
                                            <span style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                Read Article &rarr;
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR - TRENDING */}
                    <aside>
                        <div style={{ backgroundColor: '#151515', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                                <div style={{ width: '30px', height: '30px', backgroundColor: 'var(--primary-color)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
                                    <span style={{ color: '#fff', fontSize: '1.2rem' }}>⚡</span>
                                </div>
                                <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Trending</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {trendingPosts.map((post, index) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                            <span style={{ fontSize: '3rem', lineHeight: '1', fontWeight: 'bold', color: '#333', fontFamily: 'var(--font-display)' }}>
                                                {index + 1}
                                            </span>
                                            <div>
                                                <h4 style={{ fontSize: '1rem', lineHeight: '1.4', marginBottom: '0.25rem', fontWeight: 'bold' }}>{post.title}</h4>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                                    Read Now
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: 'rgba(var(--primary-rgb), 0.1)', borderRadius: '12px', border: '1px solid rgba(var(--primary-rgb), 0.2)', textAlign: 'center' }}>
                            <h3 style={{ marginBottom: '1rem', textTransform: 'uppercase' }}>Need a new ride?</h3>
                            <p style={{ color: '#aaa', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Check out our latest inventory and find your perfect match today.</p>
                            <Link href="/inventory" className="btn btn-accent" style={{ width: '100%', display: 'block' }}>Search Inventory</Link>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}
