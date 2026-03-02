import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

const DISCORD_WEBHOOK_URL =
    process.env.DISCORD_WEBHOOK_URL ||
    'https://ptb.discord.com/api/webhooks/1477927547005177958/TVlF07MabEWQckYt4zNmRT1HQsApAcyvCFFNuWmGUZ8GJU7sSyiFVWlI--i8BQvOT2DJ';

export interface Ticket {
    id: string;
    title: string;
    description: string;
    page_url: string;
    category: 'bug' | 'glitch' | 'feature' | 'performance' | 'other';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    submitted_by: string;
    created_at: string;
    updated_at: string;
}

const SITE_URL = 'https://ryansautosolution.com';
const LOGO_URL = 'https://ryansautosolution.com/uploads/ryansautoblack.png';

async function sendDiscordWebhook(ticket: Ticket) {
    const priorityColors: Record<string, number> = {
        low: 0x27ae60,
        medium: 0xf39c12,
        high: 0xe67e22,
        critical: 0xe74c3c,
    };
    const priorityLabel: Record<string, string> = {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        critical: 'Critical',
    };
    const categoryLabel: Record<string, string> = {
        bug: 'Bug',
        glitch: 'Visual Glitch',
        feature: 'Feature Request',
        performance: 'Performance',
        other: 'Other',
    };

    const affectedUrl = ticket.page_url
        ? (ticket.page_url.startsWith('http') ? ticket.page_url : `${SITE_URL}${ticket.page_url.startsWith('/') ? '' : '/'}${ticket.page_url}`)
        : SITE_URL;

    const embed = {
        author: {
            name: "Ryan's Auto Solution",
            url: SITE_URL,
            icon_url: LOGO_URL,
        },
        title: `[${ticket.priority.toUpperCase()}] ${ticket.title}`,
        url: affectedUrl,
        description: ticket.description,
        color: priorityColors[ticket.priority] ?? 0x0f71b1,
        thumbnail: { url: LOGO_URL },
        fields: [
            { name: 'Category', value: categoryLabel[ticket.category] ?? ticket.category, inline: true },
            { name: 'Priority', value: priorityLabel[ticket.priority] ?? ticket.priority, inline: true },
            { name: 'Submitted By', value: ticket.submitted_by || 'Unknown', inline: true },
            ...(ticket.page_url ? [{ name: 'Affected Page', value: affectedUrl, inline: false }] : []),
            { name: 'Ticket ID', value: `\`${ticket.id}\``, inline: true },
            { name: 'Status', value: 'Open', inline: true },
        ],
        footer: { text: "Ryan's Auto Solution — Bug Tracker", icon_url: LOGO_URL },
        timestamp: ticket.created_at,
    };

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] }),
        });
    } catch (err) {
        console.error('Discord webhook failed:', err);
    }
}

// GET � list all tickets (newest first)
export async function GET() {
    try {
        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
            .from('tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase GET tickets error:', error);
            return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
        }
        return NextResponse.json(data ?? []);
    } catch (err) {
        console.error('GET /api/tickets error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST � create new ticket
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description, pageUrl, category, priority, submittedBy } = body;

        if (!title || !description) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
        }

        const validCategories = ['bug', 'glitch', 'feature', 'performance', 'other'];
        const validPriorities = ['low', 'medium', 'high', 'critical'];
        if (!validCategories.includes(category)) return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
        if (!validPriorities.includes(priority)) return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });

        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
            .from('tickets')
            .insert({
                title: title.trim(),
                description: description.trim(),
                page_url: (pageUrl || '').trim(),
                category,
                priority,
                status: 'open',
                submitted_by: (submittedBy || 'Unknown').trim(),
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase insert ticket error:', error);
            return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
        }

        sendDiscordWebhook(data as Ticket).catch(console.error);
        return NextResponse.json(data, { status: 201 });
    } catch (err) {
        console.error('POST /api/tickets error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH � update ticket status
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status } = body;

        const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
        if (!id || !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid id or status' }, { status: 400 });
        }

        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
            .from('tickets')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        return NextResponse.json(data);
    } catch (err) {
        console.error('PATCH /api/tickets error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE � remove ticket
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing ticket id' }, { status: 400 });

        const supabase = getSupabaseAdminClient();
        const { error } = await supabase.from('tickets').delete().eq('id', id);
        if (error) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('DELETE /api/tickets error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
