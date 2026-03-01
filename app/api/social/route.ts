import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data/social-posts.json');

function readData() {
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch {
        return { settings: {}, queue: [] };
    }
}

function writeData(data: object) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// GET — return full data (queue + settings)
export async function GET() {
    return NextResponse.json(readData());
}

// POST — add a new post to the queue
export async function POST(req: Request) {
    const data = readData();
    const body = await req.json();

    const post = {
        id: Date.now(),
        type: body.type ?? 'custom',           // 'vehicle' | 'blog' | 'custom'
        sourceId: body.sourceId ?? null,
        title: body.title ?? '',
        content: body.content ?? '',
        image: body.image ?? null,
        platforms: body.platforms ?? ['facebook'],
        status: body.scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: body.scheduledAt ?? null,
        publishedAt: null,
        publishedIds: {},
        error: null,
        createdAt: new Date().toISOString(),
    };

    data.queue.unshift(post);
    writeData(data);
    return NextResponse.json(post, { status: 201 });
}

// PATCH — update settings
export async function PATCH(req: Request) {
    const data = readData();
    const body = await req.json();
    data.settings = { ...data.settings, ...body };
    writeData(data);
    return NextResponse.json(data.settings);
}
