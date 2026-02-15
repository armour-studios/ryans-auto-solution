"use client";

import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { getCroppedImg } from '@/lib/imageUtils';

interface ImageEditorProps {
    imageSrc: string;
    onClose: () => void;
}

export default function ImageEditor({ imageSrc, onClose }: ImageEditorProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [autoEnhance, setAutoEnhance] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [aspect, setAspect] = useState<number | undefined>(4 / 3);
    const [format, setFormat] = useState('image/jpeg');

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleProcessAndDownload = async () => {
        if (!croppedAreaPixels) return;

        try {
            setProcessing(true);
            const croppedImageBlob = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
                rotation,
                { horizontal: false, vertical: false },
                autoEnhance,
                format
            );

            if (croppedImageBlob) {
                const extension = format.split('/')[1];
                const url = URL.createObjectURL(croppedImageBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `edited-image-${Date.now()}.${extension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (e) {
            console.error(e);
            alert('Failed to process image');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#fff', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Advanced Photo Editor</h2>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>Crop, Rotate, and Enhance</p>
                </div>
                <button onClick={onClose} style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#fff',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                }}>✕</button>
            </div>

            <div style={{
                position: 'relative',
                flex: 1,
                backgroundColor: '#000',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '1.5rem',
                backgroundColor: '#1a1a1a',
                borderRadius: '12px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                border: '1px solid #333'
            }}>

                {/* Top Row: Aspect and Format */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>

                    {/* Aspect Ratio */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Aspect Ratio</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[
                                { label: '4:3', value: 4 / 3 },
                                { label: '16:9', value: 16 / 9 },
                                { label: '1:1', value: 1 },
                                { label: 'Free', value: undefined }
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => setAspect(opt.value)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: aspect === opt.value ? 'var(--primary-color)' : '#333',
                                        color: aspect === opt.value ? '#000' : '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Download Format */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Save As</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[
                                { label: 'JPG', value: 'image/jpeg' },
                                { label: 'PNG', value: 'image/png' },
                                { label: 'WEBP', value: 'image/webp' }
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => setFormat(opt.value)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: format === opt.value ? '#fff' : '#333',
                                        color: format === opt.value ? '#000' : '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle Row: Sliders and Enhance */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    alignItems: 'center'
                }}>
                    {/* Zoom */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label style={{ fontSize: '0.8rem', color: '#888' }}>Zoom</label>
                            <span style={{ fontSize: '0.8rem' }}>{zoom.toFixed(1)}x</span>
                        </div>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                        />
                    </div>

                    {/* Rotation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label style={{ fontSize: '0.8rem', color: '#888' }}>Rotation</label>
                            <span style={{ fontSize: '0.8rem' }}>{rotation}°</span>
                        </div>
                        <input
                            type="range"
                            value={rotation}
                            min={0}
                            max={360}
                            step={1}
                            onChange={(e) => setRotation(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                        />
                    </div>

                    {/* Auto Enhance Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => setAutoEnhance(!autoEnhance)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: autoEnhance ? 'var(--primary-color)' : '#333',
                                color: autoEnhance ? '#000' : '#fff',
                                border: 'none',
                                borderRadius: '30px',
                                transition: 'all 0.2s',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            {autoEnhance ? '✨ Auto Enhance Active' : '🪄 Apply Auto Enhance'}
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Action */}
                <button
                    onClick={handleProcessAndDownload}
                    disabled={processing}
                    className="btn btn-primary"
                    style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        backgroundColor: processing ? '#444' : 'var(--primary-color)',
                        color: processing ? '#888' : '#000',
                        border: 'none',
                        cursor: processing ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    {processing ? 'Processing Final Image...' : `Download ${format.split('/')[1].toUpperCase()}`}
                </button>
            </div>
        </div>
    );
}
