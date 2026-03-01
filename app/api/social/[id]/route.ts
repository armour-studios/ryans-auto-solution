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

// PATCH — edit a queued post (reschedule, change content, change platforms)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = readData();
    const idx = data.queue.findIndex((p: { id: number }) => p.id === Number(id));
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    data.queue[idx] = { ...data.queue[idx], ...body };
    writeData(data);
    return NextResponse.json(data.queue[idx]);
}

// DELETE — remove a queued post
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = readData();
    data.queue = data.queue.filter((p: { id: number }) => p.id !== Number(id));
    writeData(data);
    return NextResponse.json({ success: true });
}
