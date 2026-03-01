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
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                border: '1px solid #333'
            }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={aspect}
                    showGrid={true}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    classes={{
                        containerClassName: 'cropper-container',
                        mediaClassName: 'cropper-media',
                        cropAreaClassName: 'cropper-area'
                    }}
                />

                {/* Helper text for handles */}
                {aspect === undefined && (
                    <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        color: '#aaa',
                        pointerEvents: 'none',
                        border: '1px solid #444',
                        zIndex: 10
                    }}>
                        Drag edges to resize crop area
                    </div>
                )}
            </div>

            <style jsx global>{`
        .cropper-area {
          border: 2px solid var(--primary-color) !important;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6) !important;
        }
        .cropper-area::before, .cropper-area::after {
          content: '';
          position: absolute;
          width: 15px;
          height: 15px;
          border: 3px solid #fff;
          z-index: 100;
        }
        /* Top Left Handle */
        .cropper-area::before { top: -3px; left: -3px; border-right: none; border-bottom: none; }
        /* Bottom Right Handle */
        .cropper-area::after { bottom: -3px; right: -3px; border-left: none; border-top: none; }
        
        input[type=range] {
          -webkit-appearance: none;
          background: #333;
          height: 6px;
          border-radius: 5px;
          outline: none;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: var(--primary-color);
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
      `}</style>

            <div style={{
                marginTop: '1rem',
                padding: '1.5rem',
                backgroundColor: '#111',
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
                        <label style={{ fontSize: '0.7rem', color: '#555', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Aspect Ratio</label>
                        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#000', padding: '0.4rem', borderRadius: '10px', border: '1px solid #222' }}>
                            {[
                                { label: '4:3', value: 4 / 3 },
                                { label: '3:2', value: 3 / 2 },
                                { label: '16:9', value: 16 / 9 },
                                { label: '1:1', value: 1 },
                                { label: 'Free', value: undefined }
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => setAspect(opt.value)}
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        backgroundColor: aspect === opt.value ? '#222' : 'transparent',
                                        color: aspect === opt.value ? 'var(--primary-color)' : '#666',
                                        border: aspect === opt.value ? '1px solid #333' : '1px solid transparent',
                                        borderRadius: '8px',
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
                        <label style={{ fontSize: '0.7rem', color: '#555', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Output Format</label>
                        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#000', padding: '0.4rem', borderRadius: '10px', border: '1px solid #222' }}>
                            {[
                                { label: 'JPG', value: 'image/jpeg' },
                                { label: 'PNG', value: 'image/png' },
                                { label: 'WEBP', value: 'image/webp' }
                            ].map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => setFormat(opt.value)}
                                    style={{
                                        padding: '0.5rem 1.25rem',
                                        backgroundColor: format === opt.value ? '#222' : 'transparent',
                                        color: format === opt.value ? '#fff' : '#666',
                                        border: format === opt.value ? '1px solid #333' : '1px solid transparent',
                                        borderRadius: '8px',
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
                    gap: '2.5rem',
                    alignItems: 'center',
                    backgroundColor: '#0a0a0a',
                    padding: '1.25rem',
                    borderRadius: '10px',
                    border: '1px solid #1a1a1a'
                }}>
                    {/* Zoom */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                                <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600' }}>ZOOM</label>
                            </div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontFamily: 'monospace', fontWeight: 'bold' }}>{zoom.toFixed(1)}x</span>
                        </div>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* Rotation */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                                <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600' }}>ROTATION</label>
                            </div>
                            <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', fontFamily: 'monospace', fontWeight: 'bold' }}>{rotation}°</span>
                        </div>
                        <input
                            type="range"
                            value={rotation}
                            min={0}
                            max={360}
                            step={1}
                            onChange={(e) => setRotation(Number(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {/* Auto Master Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => setAutoEnhance(!autoEnhance)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.4rem',
                                cursor: 'pointer',
                                padding: '1rem',
                                background: autoEnhance
                                    ? 'linear-gradient(135deg, var(--primary-color) 0%, #00d4ff 100%)'
                                    : '#1a1a1a',
                                color: autoEnhance ? '#000' : '#fff',
                                border: autoEnhance ? 'none' : '1px solid #333',
                                borderRadius: '12px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                width: '100%',
                                justifyContent: 'center',
                                boxShadow: autoEnhance ? '0 4px 15px rgba(0,123,255,0.3)' : 'none'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {autoEnhance ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h0"/><path d="M17.8 6.2L19 5"/><path d="M3 21l9-9"/><path d="M12.2 6.2L11 5"/></svg>}
                                {autoEnhance ? 'AUTO MASTER (ENABLED)' : 'AUTOMATED CAR MASTER'}
                            </div>
                            <span style={{ fontSize: '0.65rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Pro Multi-Pass Sharpen + Color Grade
                            </span>
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Action */}
                <button
                    onClick={handleProcessAndDownload}
                    disabled={processing}
                    style={{
                        padding: '1.25rem',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: '900',
                        letterSpacing: '1px',
                        backgroundColor: processing ? '#222' : 'var(--primary-color)',
                        color: processing ? '#444' : '#000',
                        border: 'none',
                        cursor: processing ? 'default' : 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: processing ? 'none' : '0 10px 20px rgba(0,123,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        textTransform: 'uppercase'
                    }}
                >
                    {processing ? (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
                            <span>Pro Sharpening & Color Grading...</span>
                        </>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            <span>Download {format.split('/')[1].toUpperCase()} Master</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
