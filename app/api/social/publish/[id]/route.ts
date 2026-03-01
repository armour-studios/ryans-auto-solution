import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data/social-posts.json');

function readData() {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}
function writeData(data: object) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

async function publishToFacebook(post: { content: string; image?: string }, settings: { accessToken?: string; pageId?: string }) {
    const settingsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/settings.json'), 'utf8'));
    const accessToken = settingsData.facebook?.accessToken || process.env.FACEBOOK_ACCESS_TOKEN;
    const pageId = settingsData.facebook?.pageId || process.env.FACEBOOK_PAGE_ID;

    if (!accessToken || !pageId) {
        throw new Error('Facebook not connected — missing access token or page ID');
    }

    // Post with photo if image is an absolute URL; otherwise post text only
    if (post.image && post.image.startsWith('http')) {
        const res = await fetch(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: post.image, caption: post.content, access_token: accessToken }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error.message);
        return json.post_id || json.id;
    } else {
        const res = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: post.content, access_token: accessToken }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error.message);
        return json.id;
    }
}

// POST /api/social/publish/[id] — publish a queued post now
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = readData();
    const idx = data.queue.findIndex((p: { id: number }) => p.id === Number(id));
    if (idx === -1) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const post = data.queue[idx];
    const results: Record<string, string> = {};
    const errors: string[] = [];

    for (const platform of post.platforms as string[]) {
        try {
            if (platform === 'facebook') {
                const fbId = await publishToFacebook(post, {});
                results.facebook = fbId;
            } else {
                // Placeholder for future platforms
                errors.push(`${platform}: integration not yet implemented`);
            }
        } catch (err) {
            errors.push(`${platform}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    }

    const allFailed = Object.keys(results).length === 0;

    data.queue[idx] = {
        ...post,
        status: allFailed ? 'failed' : 'published',
        publishedAt: allFailed ? null : new Date().toISOString(),
        publishedIds: results,
        error: errors.length ? errors.join('; ') : null,
    };

    writeData(data);
    return NextResponse.json(data.queue[idx]);
}
