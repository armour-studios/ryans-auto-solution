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
                autoEnhance
            );

            if (croppedImageBlob) {
                const url = URL.createObjectURL(croppedImageBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `edited-image-${Date.now()}.jpg`;
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
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#fff' }}>
                <h2 style={{ margin: 0 }}>Edit Image</h2>
                <button onClick={onClose} style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                }}>✕</button>
            </div>

            <div style={{
                position: 'relative',
                flex: 1,
                backgroundColor: '#111',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            <div style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                backgroundColor: '#222',
                borderRadius: '8px',
                color: '#fff',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                alignItems: 'center'
            }}>
                {/* Zoom Slider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: '#888' }}>Zoom</label>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                    />
                </div>

                {/* Rotation Slider */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: '#888' }}>Rotation</label>
                    <input
                        type="range"
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        aria-labelledby="Rotation"
                        onChange={(e) => setRotation(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary-color)' }}
                    />
                </div>

                {/* Auto Enhance Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        padding: '0.5rem 1rem',
                        backgroundColor: autoEnhance ? 'var(--primary-color)' : '#333',
                        color: autoEnhance ? '#000' : '#fff',
                        borderRadius: '20px',
                        transition: 'all 0.2s',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}>
                        <input
                            type="checkbox"
                            checked={autoEnhance}
                            onChange={(e) => setAutoEnhance(e.target.checked)}
                            style={{ display: 'none' }}
                        />
                        ✨ Auto Enhance
                    </label>
                </div>

                {/* Action Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleProcessAndDownload}
                        disabled={processing}
                        className="btn btn-accent"
                        style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '30px',
                            fontSize: '1rem',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                            backgroundColor: processing ? '#444' : 'var(--primary-color)',
                            color: processing ? '#888' : '#000'
                        }}
                    >
                        {processing ? 'Processing...' : 'Download Processed Image (JPG)'}
                    </button>
                </div>
            </div>
        </div>
    );
}
