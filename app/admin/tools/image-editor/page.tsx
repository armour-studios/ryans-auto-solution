"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import ImageEditor from '@/components/tools/ImageEditor';

export default function ImageToolsPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            let file = e.target.files[0];

            // Handle HEIC conversion
            if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
                try {
                    setIsProcessing(true);
                    const heic2any = (await import('heic2any')).default;
                    const result = await heic2any({
                        blob: file,
                        toType: 'image/jpeg',
                        quality: 0.9
                    });

                    // result can be a blob or an array of blobs
                    const blob = Array.isArray(result) ? result[0] : result;
                    file = new File([blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
                } catch (error) {
                    console.error('HEIC conversion failed:', error);
                    alert('Could not convert HEIC file. Please try a JPG or PNG.');
                    return;
                } finally {
                    setIsProcessing(false);
                }
            }

            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="admin-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin" style={{ color: 'var(--primary-color)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    &larr; Back to Dashboard
                </Link>
                <h1 style={{ marginTop: '1rem', fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px', margin: '0.75rem 0 0.4rem' }}>Image Editor</h1>
                <p style={{ color: '#666', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>Upload, crop, and enhance photos for inventory or blog</p>
            </div>

            <div style={{
                backgroundColor: '#222',
                padding: '3rem',
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px dashed #444',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                position: 'relative'
            }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--primary-color)')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = '#444')}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                    }}
                />
                <div style={{ marginBottom: '1rem' }}>{isProcessing ? <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>}</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>
                    {isProcessing ? 'Converting HEIC to JPG...' : 'Click or Drag Photo Here'}
                </h3>
                <p style={{ margin: 0, color: '#666' }}>
                    {isProcessing ? 'Please wait a moment' : 'Supports JPG, PNG, WEBP, and HEIC (iPhone)'}
                </p>
            </div>

            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                    <h4 style={{ color: 'var(--primary-color)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg> Pro Tip</h4>
                    <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Use the <strong>Auto Enhance</strong> feature to automatically adjust lighting and colors for vehicle photos. It makes them pop!
                    </p>
                </div>
                <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                    <h4 style={{ color: 'var(--primary-color)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> iPhone Photos</h4>
                    <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Uploading an <strong>HEIC</strong> photo from an iPhone? No problem! The tool will automatically convert it to a standard JPG for you.
                    </p>
                </div>
                <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                    <h4 style={{ color: 'var(--primary-color)', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/></svg> Aspect Ratio</h4>
                    <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        The tool is preset to a <strong>4:3 aspect ratio</strong>, which is optimal for the website's gallery and vehicle listings.
                    </p>
                </div>
            </div>

            {selectedImage && (
                <ImageEditor
                    imageSrc={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}

            <style jsx>{`
        .admin-container {
          min-height: 80vh;
        }
      `}</style>
        </div>
    );
}
