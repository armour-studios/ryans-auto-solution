import { NextResponse } from 'next/server';

export async function GET() {
    const appId = process.env.FACEBOOK_APP_ID;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (!appId) {
        return NextResponse.redirect(
            `${siteUrl}/admin/settings?error=facebook_no_app_id`
        );
    }

    const redirectUri = encodeURIComponent(`${siteUrl}/api/auth/facebook/callback`);
    const scope = [
        'pages_show_list',
        'pages_manage_posts',
        'pages_read_engagement',
    ].join(',');

    const url =
        `https://www.facebook.com/v19.0/dialog/oauth` +
        `?client_id=${appId}` +
        `&redirect_uri=${redirectUri}` +
        `&scope=${scope}` +
        `&response_type=code`;

    return NextResponse.redirect(url);
}
