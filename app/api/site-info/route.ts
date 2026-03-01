import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'data', 'settings.json');

// Fallback defaults (also used when settings fields are empty)
const DEFAULTS = {
    businessName: "Ryan's Auto Solution",
    phone: '(218) 469-0183',
    address: '325 Oak Hills Rd SE, Bemidji, MN 56601',
    email: 'ryan@ryansautosolution.com',
};

export async function GET() {
    try {
        const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8');
        const settings = JSON.parse(raw);
        const site = settings.site || {};

        return NextResponse.json({
            businessName: site.businessName || DEFAULTS.businessName,
            phone:        site.phone        || DEFAULTS.phone,
            address:      site.address      || DEFAULTS.address,
            email:        site.email        || DEFAULTS.email,
        });
    } catch {
        return NextResponse.json(DEFAULTS);
    }
}
