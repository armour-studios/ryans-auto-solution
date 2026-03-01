import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json');

// Fields that are sensitive — returned as '__SET__' if non-empty so the client
// can show "configured" status without exposing raw secrets.
const SENSITIVE_FIELDS = new Set([
    'accessToken',
    'refreshToken',
    'password',
    'apiKey',
    'mapsApiKey',
    'appSecret',
    'bugWebhookUrl',
    'leadWebhookUrl',
]);

function readSettings(): Record<string, Record<string, string>> {
    try {
        return JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
    } catch {
        return {};
    }
}

function writeSettings(settings: Record<string, Record<string, string>>) {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
}

function maskSettings(
    raw: Record<string, Record<string, string>>
): Record<string, Record<string, string>> {
    const masked: Record<string, Record<string, string>> = {};
    for (const section of Object.keys(raw)) {
        masked[section] = {};
        for (const [key, val] of Object.entries(raw[section])) {
            masked[section][key] =
                SENSITIVE_FIELDS.has(key) && val ? '__SET__' : val;
        }
    }
    return masked;
}

// GET — return all settings with sensitive values masked
export async function GET() {
    const settings = readSettings();
    return NextResponse.json(maskSettings(settings));
}

// PATCH — update one section; skip any fields that are still '__SET__' (unchanged masked values)
export async function PATCH(req: NextRequest) {
    const body = await req.json();

    if (typeof body !== 'object' || body === null) {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const current = readSettings();

    for (const section of Object.keys(body)) {
        if (typeof body[section] === 'object' && body[section] !== null) {
            const updates: Record<string, string> = {};
            for (const [k, v] of Object.entries(
                body[section] as Record<string, string>
            )) {
                // Don't overwrite a real secret with the placeholder mask
                if (v !== '__SET__') updates[k] = v;
            }
            current[section] = { ...(current[section] || {}), ...updates };
        }
    }

    writeSettings(current);
    return NextResponse.json({ success: true });
}
