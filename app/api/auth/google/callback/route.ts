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

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectUri = `${siteUrl}/api/auth/google/callback`;

    if (error || !code) {
        return NextResponse.redirect(`${siteUrl}/admin/settings?error=google_denied`);
    }

    try {
        // Step 1 — exchange code for access + refresh tokens
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });
        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) throw new Error('No access_token in token exchange');

        // Step 2 — get Google account info (email)
        const userRes = await fetch(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`
        );
        const userData = await userRes.json();

        // Step 3 — attempt to get YouTube channel info
        let channelId = '';
        let channelName = '';
        try {
            const ytRes = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${tokenData.access_token}`
            );
            const ytData = await ytRes.json();
            const channel = ytData.items?.[0];
            if (channel) {
                channelId = channel.id ?? '';
                channelName = channel.snippet?.title ?? '';
            }
        } catch {
            // YouTube access optional — don't fail the whole flow
        }

        const settings = readSettings();

        settings.google = {
            ...(settings.google || {}),
            connected: 'true',
            email: userData.email ?? '',
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token || settings.google?.refreshToken || '',
        };

        if (channelId) {
            settings.youtube = {
                ...(settings.youtube || {}),
                connected: 'true',
                channelId,
                channelName,
            };
        }

        writeSettings(settings);
        return NextResponse.redirect(`${siteUrl}/admin/settings?connected=google`);
    } catch (err) {
        console.error('[Google OAuth] error:', err);
        return NextResponse.redirect(`${siteUrl}/admin/settings?error=google_failed`);
    }
}
