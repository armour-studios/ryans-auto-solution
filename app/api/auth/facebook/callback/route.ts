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
    const redirectUri = `${siteUrl}/api/auth/facebook/callback`;

    if (error || !code) {
        return NextResponse.redirect(`${siteUrl}/admin/settings?error=facebook_denied`);
    }

    try {
        // Step 1 — exchange code for short-lived user token
        const tokenRes = await fetch(
            `https://graph.facebook.com/v19.0/oauth/access_token` +
            `?client_id=${process.env.FACEBOOK_APP_ID}` +
            `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&code=${code}`
        );
        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) throw new Error('No access_token in token exchange');

        // Step 2 — exchange for long-lived user token (60-day)
        const longRes = await fetch(
            `https://graph.facebook.com/v19.0/oauth/access_token` +
            `?grant_type=fb_exchange_token` +
            `&client_id=${process.env.FACEBOOK_APP_ID}` +
            `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
            `&fb_exchange_token=${tokenData.access_token}`
        );
        const longData = await longRes.json();
        const longLivedToken = longData.access_token || tokenData.access_token;

        // Step 3 — get list of managed pages (page tokens never expire)
        const pagesRes = await fetch(
            `https://graph.facebook.com/v19.0/me/accounts?access_token=${longLivedToken}`
        );
        const pagesData = await pagesRes.json();
        const page = pagesData.data?.[0];

        const settings = readSettings();

        if (page) {
            settings.facebook = {
                ...(settings.facebook || {}),
                connected: 'true',
                pageName: page.name ?? '',
                pageId: page.id ?? '',
                accessToken: page.access_token ?? '',
            };

            // Step 4 — check for linked Instagram Business Account
            const igPageRes = await fetch(
                `https://graph.facebook.com/v19.0/${page.id}` +
                `?fields=instagram_business_account` +
                `&access_token=${page.access_token}`
            );
            const igPageData = await igPageRes.json();

            if (igPageData.instagram_business_account?.id) {
                const igId: string = igPageData.instagram_business_account.id;
                const igInfoRes = await fetch(
                    `https://graph.facebook.com/v19.0/${igId}?fields=username&access_token=${page.access_token}`
                );
                const igInfo = await igInfoRes.json();
                settings.instagram = {
                    ...(settings.instagram || {}),
                    connected: 'true',
                    username: igInfo.username ?? '',
                    accountId: igId,
                    accessToken: page.access_token,
                };
            }
        } else {
            // Authenticated user but no pages — save user token
            settings.facebook = {
                ...(settings.facebook || {}),
                connected: 'true',
                pageName: '',
                pageId: '',
                accessToken: longLivedToken,
            };
        }

        writeSettings(settings);
        return NextResponse.redirect(`${siteUrl}/admin/settings?connected=facebook`);
    } catch (err) {
        console.error('[Facebook OAuth] error:', err);
        return NextResponse.redirect(`${siteUrl}/admin/settings?error=facebook_failed`);
    }
}
