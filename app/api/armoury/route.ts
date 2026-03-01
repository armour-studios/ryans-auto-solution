import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
// Cache armoury responses for 30 minutes
export const revalidate = 1800;

interface RssArticle {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    source: string;
    category: string;
}

function extractTag(xml: string, tag: string): string {
    // Handle CDATA
    const cdataMatch = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i').exec(xml);
    if (cdataMatch) return cdataMatch[1].trim();
    const match = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(xml);
    if (match) return match[1].replace(/<[^>]+>/g, '').trim();
    return '';
}

function parseRss(xml: string, sourceName: string, category: string): RssArticle[] {
    const items: RssArticle[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match: RegExpExecArray | null;
    while ((match = itemRegex.exec(xml)) !== null) {
        const chunk = match[1];
        const title = extractTag(chunk, 'title');
        const link = extractTag(chunk, 'link') || extractTag(chunk, 'guid');
        const description = extractTag(chunk, 'description');
        const pubDate = extractTag(chunk, 'pubDate');
        if (title && link) {
            items.push({ title, link, description: description.slice(0, 300), pubDate, source: sourceName, category });
        }
    }
    return items;
}

const FEEDS = [
    {
        url: 'https://news.google.com/rss/search?q=car+dealership+usa&hl=en-US&gl=US&ceid=US:en',
        source: 'Google News',
        category: 'US Market',
    },
    {
        url: 'https://news.google.com/rss/search?q=used+car+prices+usa+2025&hl=en-US&gl=US&ceid=US:en',
        source: 'Google News',
        category: 'Used Car Market',
    },
    {
        url: 'https://news.google.com/rss/search?q=auto+industry+news+usa&hl=en-US&gl=US&ceid=US:en',
        source: 'Google News',
        category: 'Industry News',
    },
    {
        url: 'https://news.google.com/rss/search?q=car+buying+tips+usa&hl=en-US&gl=US&ceid=US:en',
        source: 'Google News',
        category: 'Article Ideas',
    },
    {
        url: 'https://news.google.com/rss/search?q=auto+financing+usa+2025&hl=en-US&gl=US&ceid=US:en',
        source: 'Google News',
        category: 'Article Ideas',
    },
    {
        url: 'https://www.reddit.com/r/askcarsales/.rss?limit=15',
        source: 'r/AskCarSales',
        category: 'Industry Discussion',
    },
    {
        url: 'https://www.reddit.com/r/UsedCars/.rss?limit=15',
        source: 'r/UsedCars',
        category: 'Used Car Market',
    },
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('q') || '';
    const categoryFilter = searchParams.get('category') || '';

    const results = await Promise.allSettled(
        FEEDS.map(async (feed) => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 6000);
            try {
                const res = await fetch(feed.url, {
                    signal: controller.signal,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; RyanAutoSolution/1.0)',
                        'Accept': 'application/rss+xml, application/xml, text/xml',
                    },
                    next: { revalidate: 1800 },
                });
                if (!res.ok) return [];
                const xml = await res.text();
                return parseRss(xml, feed.source, feed.category);
            } catch {
                return [];
            } finally {
                clearTimeout(timeout);
            }
        })
    );

    let articles: RssArticle[] = results
        .filter((r): r is PromiseFulfilledResult<RssArticle[]> => r.status === 'fulfilled')
        .flatMap(r => r.value);

    // Deduplicate by title similarity
    const seen = new Set<string>();
    articles = articles.filter(a => {
        const key = a.title.toLowerCase().slice(0, 60);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    // Filter by search query
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        articles = articles.filter(a =>
            a.title.toLowerCase().includes(q) ||
            a.description.toLowerCase().includes(q)
        );
    }

    // Filter by category
    if (categoryFilter) {
        articles = articles.filter(a => a.category === categoryFilter);
    }

    // Sort by date (newest first)
    articles.sort((a, b) => {
        const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
        const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
        return db - da;
    });

    const categories = [...new Set(FEEDS.map(f => f.category))];

    return NextResponse.json({ articles, categories, total: articles.length });
}
