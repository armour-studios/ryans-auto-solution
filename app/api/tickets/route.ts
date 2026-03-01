import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TICKETS_PATH = path.join(process.cwd(), 'data', 'tickets.json');
const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json');

export interface Ticket {
    id: string;
    title: string;
    description: string;
    pageUrl: string;
    category: 'bug' | 'glitch' | 'feature' | 'performance' | 'other';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    submittedBy: string;
    createdAt: string;
    updatedAt: string;
}

function readTickets(): Ticket[] {
    try {
        const raw = fs.readFileSync(TICKETS_PATH, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function writeTickets(tickets: Ticket[]) {
    fs.writeFileSync(TICKETS_PATH, JSON.stringify(tickets, null, 2), 'utf-8');
}

async function sendDiscordWebhook(ticket: Ticket) {
    // Check env var first, then fall back to settings.json
    let webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        try {
            const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
            webhookUrl = settings?.discord?.bugWebhookUrl || '';
        } catch { /* ok */ }
    }
    if (!webhookUrl) return;

    const priorityColors: Record<string, number> = {
        low: 0x27ae60,
        medium: 0xf39c12,
        high: 0xe67e22,
        critical: 0xe74c3c,
    };

    const priorityEmoji: Record<string, string> = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        critical: '🔴',
    };

    const categoryLabel: Record<string, string> = {
        bug: '🐛 Bug',
        glitch: '⚡ Visual Glitch',
        feature: '✨ Feature Request',
        performance: '🚀 Performance',
        other: '📋 Other',
    };

    const embed = {
        title: `${priorityEmoji[ticket.priority]} [${ticket.priority.toUpperCase()}] ${ticket.title}`,
        description: ticket.description,
        color: priorityColors[ticket.priority] ?? 0x0f71b1,
        fields: [
            { name: 'Category', value: categoryLabel[ticket.category] ?? ticket.category, inline: true },
            { name: 'Priority', value: ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1), inline: true },
            { name: 'Submitted By', value: ticket.submittedBy || 'Unknown', inline: true },
            ...(ticket.pageUrl ? [{ name: 'Affected Page / URL', value: ticket.pageUrl, inline: false }] : []),
            { name: 'Ticket ID', value: `\`${ticket.id}\``, inline: true },
        ],
        footer: { text: "Ryan's Auto Solution — Bug Tracker" },
        timestamp: ticket.createdAt,
    };

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] }),
        });
    } catch (err) {
        console.error('Discord webhook failed:', err);
    }
}

// GET — list all tickets (sorted newest first)
export async function GET() {
    const tickets = readTickets();
    tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(tickets);
}

// POST — create new ticket
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { title, description, pageUrl, category, priority, submittedBy } = body;

    if (!title || !description) {
        return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const validCategories = ['bug', 'glitch', 'feature', 'performance', 'other'];
    const validPriorities = ['low', 'medium', 'high', 'critical'];

    if (!validCategories.includes(category)) {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    if (!validPriorities.includes(priority)) {
        return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const ticket: Ticket = {
        id: `TKT-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        pageUrl: (pageUrl || '').trim(),
        category,
        priority,
        status: 'open',
        submittedBy: (submittedBy || 'Unknown').trim(),
        createdAt: now,
        updatedAt: now,
    };

    const tickets = readTickets();
    tickets.push(ticket);
    writeTickets(tickets);

    // Send to Discord (non-blocking)
    sendDiscordWebhook(ticket).catch(console.error);

    return NextResponse.json(ticket, { status: 201 });
}

// PATCH — update ticket status
export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const { id, status } = body;

    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (!id || !validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid id or status' }, { status: 400 });
    }

    const tickets = readTickets();
    const idx = tickets.findIndex(t => t.id === id);
    if (idx === -1) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    tickets[idx].status = status;
    tickets[idx].updatedAt = new Date().toISOString();
    writeTickets(tickets);

    return NextResponse.json(tickets[idx]);
}

// DELETE — remove ticket
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing ticket id' }, { status: 400 });
    }

    const tickets = readTickets();
    const filtered = tickets.filter(t => t.id !== id);
    if (filtered.length === tickets.length) {
        return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    writeTickets(filtered);
    return NextResponse.json({ success: true });
}
