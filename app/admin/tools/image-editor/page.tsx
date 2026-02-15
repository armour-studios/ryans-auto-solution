"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import ImageEditor from '@/components/tools/ImageEditor';

export default function ImageToolsPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
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
                <h1 style={{ marginTop: '1rem', color: '#fff' }}>Image Editing Tool</h1>
                <p style={{ color: '#888' }}>Upload, crop, and enhance photos for your inventory or blog.</p>
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
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Click or Drag Photo Here</h3>
                <p style={{ margin: 0, color: '#666' }}>Supports JPG, PNG, WEBP</p>
            </div>

            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                    <h4 style={{ color: 'var(--primary-color)', margin: '0 0 1rem 0' }}>💡 Pro Tip</h4>
                    <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Use the <strong>Auto Enhance</strong> feature to automatically adjust lighting and colors for vehicle photos. It makes them pop!
                    </p>
                </div>
                <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
                    <h4 style={{ color: 'var(--primary-color)', margin: '0 0 1rem 0' }}>📏 Aspect Ratio</h4>
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
