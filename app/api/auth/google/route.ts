import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (!clientId) {
        return NextResponse.redirect(
            `${siteUrl}/admin/settings?error=google_no_client_id`
        );
    }

    const redirectUri = encodeURIComponent(`${siteUrl}/api/auth/google/callback`);
    const scope = encodeURIComponent(
        [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/youtube.readonly',
        ].join(' ')
    );

    const url =
        `https://accounts.google.com/o/oauth2/v2/auth` +
        `?client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&scope=${scope}` +
        `&response_type=code` +
        `&access_type=offline` +
        `&prompt=consent`;

    return NextResponse.redirect(url);
}
