import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ success: false, error: 'Invalid file type' }, { status: 400 });
        }

        // Secure filename
        const filename = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');

        // Upload to Vercel Blob storage
        const blob = await put(filename, file, {
            access: 'public',
        });

        return NextResponse.json({ success: true, url: blob.url });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed'
        }, { status: 500 });
    }
}
