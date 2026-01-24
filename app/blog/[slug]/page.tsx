import { getBlogPostBySlug, getBlogPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export async function generateStaticParams() {
    const posts = getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) return { title: 'Blog Not Found' };

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt,
            images: post.image ? [post.image] : [],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Simple Markdown Parser (Headers, Bold, Lists, Links)
    const renderContent = (text: string) => {
        return text.split('\n').map((line, idx) => {
            // H2
            if (line.startsWith('## ')) {
                return <h2 key={idx} style={{ marginTop: '2rem', marginBottom: '1rem', color: '#fff', fontSize: '1.8rem' }}>{line.replace('## ', '')}</h2>
            }
            // H3
            if (line.startsWith('### ')) {
                return <h3 key={idx} style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#ddd', fontSize: '1.5rem' }}>{line.replace('### ', '')}</h3>
            }
            // Blockquote
            if (line.startsWith('> ')) {
                return (
                    <blockquote key={idx} style={{ borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem', fontStyle: 'italic', color: '#aaa', margin: '1.5rem 0' }}>
                        {line.replace('> ', '')}
                    </blockquote>
                );
            }
            // Unordered List
            if (line.startsWith('- ')) {
                return <li key={idx} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>{parseInline(line.replace('- ', ''))}</li>
            }

            // Paragraph (Default)
            if (line.trim().length === 0) return <br key={idx} />;

            return <p key={idx} style={{ marginBottom: '1rem' }}>{parseInline(line)}</p>;
        });
    };

    const parseInline = (text: string) => {
        // Very basic inline parsing for **bold** and _italic_
        // Note: usage of dangerouslySetInnerHTML should be avoided, using split/map strategy for safety
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} style={{ color: '#fff' }}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <article style={{ padding: '4rem 0', minHeight: '80vh', color: '#fff' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <Link href="/blog" style={{ display: 'inline-block', marginBottom: '2rem', color: '#888' }}>
                    &larr; Back to Blog
                </Link>

                <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    {post.tags && post.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                            {post.tags.map((tag, i) => (
                                <span key={i} style={{
                                    fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px',
                                    padding: '0.25rem 0.5rem', backgroundColor: '#333', borderRadius: '4px', color: '#aaa'
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>{post.title}</h1>

                    <div style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                        {new Date(post.date).toLocaleDateString()} • {post.author}
                    </div>
                </header>

                {post.image && (
                    <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '3rem', borderRadius: '8px', overflow: 'hidden' }}>
                        <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} priority />
                    </div>
                )}

                <div style={{
                    backgroundColor: 'var(--card-bg)',
                    padding: '3rem',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    fontSize: '1.15rem',
                    lineHeight: '1.8',
                    color: '#ccc'
                }}>
                    {renderContent(post.content)}
                </div>

                <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid #333', paddingTop: '3rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Looking for your next vehicle?</h3>
                    <Link href="/inventory" className="btn btn-accent">Browse Inventory</Link>
                </div>
            </div>
        </article>
    );
}
