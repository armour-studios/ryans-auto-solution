import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// Debug endpoint to check environment and test/fix status updates
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Fix the status column constraint to accept new values
    if (action === 'fix-status') {
        const results: string[] = [];

        // We need to use a service role client or raw SQL to alter constraints
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!serviceKey) {
            // Try with anon key via postgrest - won't work for DDL
            // Instead, provide instructions
            return NextResponse.json({
                error: 'SUPABASE_SERVICE_ROLE_KEY not set',
                instructions: [
                    'Go to your Supabase Dashboard → SQL Editor',
                    'Run this SQL:',
                    'ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_status_check;',
                    "ALTER TABLE inventory ADD CONSTRAINT inventory_status_check CHECK (status IN ('Available', 'Sold', 'Pending', 'Coming Soon', 'Draft'));",
                    '',
                    'Or to remove the constraint entirely (recommended):',
                    'ALTER TABLE inventory DROP CONSTRAINT inventory_status_check;'
                ]
            });
        }

        // Use admin client to try raw SQL via pg_net or similar
        const adminClient = createClient(supabaseUrl!, serviceKey);

        // Try dropping and recreating the constraint
        // Note: This requires the pg_net extension or a custom function
        // Supabase REST API doesn't support DDL, so we provide instructions
        return NextResponse.json({
            message: 'Cannot run DDL via REST API',
            instructions: [
                'Go to your Supabase Dashboard → SQL Editor',
                'Run this SQL to fix the status constraint:',
                '',
                'ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_status_check;',
                '',
                'This removes the constraint so status can be any text value.',
                'Or to keep validation:',
                "ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_status_check;",
                "ALTER TABLE inventory ADD CONSTRAINT inventory_status_check CHECK (status IN ('Available', 'Sold', 'Pending', 'Coming Soon', 'Draft'));"
            ]
        });
    }

    // Test if status column accepts new values
    if (action === 'test-status') {
        const results: string[] = [];

        const { data: vehicles, error: fetchErr } = await supabase
            .from('inventory')
            .select('id, status')
            .limit(1);

        if (fetchErr || !vehicles || vehicles.length === 0) {
            return NextResponse.json({ error: 'No vehicles found', details: fetchErr?.message });
        }

        const testVehicle = vehicles[0];
        const originalStatus = testVehicle.status;
        results.push(`Vehicle ${testVehicle.id} current status: ${originalStatus}`);

        // Try updating to Draft
        const { error: draftErr } = await supabase
            .from('inventory')
            .update({ status: 'Draft' })
            .eq('id', testVehicle.id);

        if (draftErr) {
            results.push(`UPDATE to 'Draft' FAILED: ${draftErr.message} | Code: ${draftErr.code} | Details: ${draftErr.details}`);
        } else {
            results.push(`UPDATE to 'Draft' SUCCEEDED`);
            await supabase.from('inventory').update({ status: originalStatus }).eq('id', testVehicle.id);
            results.push('Reverted to original status');
        }

        // Try updating to Coming Soon
        const { error: csErr } = await supabase
            .from('inventory')
            .update({ status: 'Coming Soon' })
            .eq('id', testVehicle.id);

        if (csErr) {
            results.push(`UPDATE to 'Coming Soon' FAILED: ${csErr.message} | Code: ${csErr.code} | Details: ${csErr.details}`);
        } else {
            results.push(`UPDATE to 'Coming Soon' SUCCEEDED`);
            await supabase.from('inventory').update({ status: originalStatus }).eq('id', testVehicle.id);
            results.push('Reverted to original status');
        }

        return NextResponse.json({ results });
    }

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
