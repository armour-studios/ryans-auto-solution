import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json');

function readSettings(): Record<string, Record<string, string>> {
    try {
        return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
    } catch {
        return {};
    }
}

function writeSettings(s: object) {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(s, null, 2), 'utf-8');
}

// Fields to clear when a provider is disconnected
const RESET: Record<string, string[]> = {
    facebook: ['connected', 'pageName', 'pageId', 'accessToken'],
    instagram: ['connected', 'username', 'accountId', 'accessToken'],
    google:    ['connected', 'email', 'accessToken', 'refreshToken'],
    youtube:   ['connected', 'channelName', 'channelId'],
};

export async function POST(req: NextRequest) {
    const { provider } = await req.json();

    if (!provider || !RESET[provider]) {
        return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    const settings = readSettings();

    if (settings[provider]) {
        for (const field of RESET[provider]) {
            settings[provider][field] = field === 'connected' ? 'false' : '';
        }
    }

    // Disconnecting Facebook also disconnects Instagram (shared token)
    if (provider === 'facebook' && settings.instagram) {
        for (const field of RESET.instagram) {
            settings.instagram[field] = field === 'connected' ? 'false' : '';
        }
    }

    writeSettings(settings);
    return NextResponse.json({ success: true });
}
