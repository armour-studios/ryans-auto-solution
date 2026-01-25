import { NextResponse } from 'next/server';

// Debug endpoint to check environment variables
export async function GET() {
    const envVars = {
        KV_REST_API_URL: process.env.KV_REST_API_URL ? '✓ Set' : '✗ Not set',
        KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? '✓ Set' : '✗ Not set',
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? '✓ Set' : '✗ Not set',
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? '✓ Set' : '✗ Not set',
        KV_URL: process.env.KV_URL ? '✓ Set' : '✗ Not set',
        REDIS_URL: process.env.REDIS_URL ? '✓ Set' : '✗ Not set',
        VERCEL: process.env.VERCEL ? '✓ On Vercel' : '✗ Local',
    };

    return NextResponse.json({
        message: 'Environment variable check',
        variables: envVars,
        instructions: 'You need at least one URL and one TOKEN variable set. Go to Vercel → Project → Storage → Create Database → KV'
    });
}
