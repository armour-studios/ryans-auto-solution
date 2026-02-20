"use client";

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
    mainImage: string;
    vehicleName: string;
}

export default function ImageGallery({ images, mainImage, vehicleName }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Ensure all images are unique and non-empty
    const allImages = Array.from(new Set([mainImage, ...images])).filter(Boolean);

    const openLightbox = (index: number) => {
        setActiveIndex(index);
        setIsLightboxOpen(true);
        document.body.style.overflow = 'hidden'; // Lock scrolling
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    const nextImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveIndex((prev) => (prev + 1) % allImages.length);
    }, [allImages.length]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }, [allImages.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!isLightboxOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeLightbox();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, nextImage, prevImage]);

    // Simple swipe logic
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 50) nextImage();
        if (distance < -50) prevImage();
    };

    return (
        <div className="image-gallery">
            {/* Main Stage */}
            <div
                onClick={() => openLightbox(activeIndex)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    border: '1px solid #333',
                    cursor: 'zoom-in',
                    backgroundColor: '#111',
                    transition: 'transform 0.3s ease'
                }}
                className="hover-card gallery-main-stage w-full"
            >
                <Image
                    src={allImages[activeIndex]}
                    alt={vehicleName}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>

            {/* Thumbnails Row */}
            <div style={{
                display: 'flex',
                gap: '0.75rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                scrollbarWidth: 'thin',
                scrollbarColor: '#444 transparent'
            }}>
                {allImages.map((img, idx) => (
                    <div
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        style={{
                            position: 'relative',
                            width: '100px',
                            height: '70px',
                            flexShrink: 0,
                            borderRadius: '4px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: activeIndex === idx ? '2px solid var(--primary-color)' : '1px solid #333',
                            transition: 'all 0.2s ease',
                            opacity: activeIndex === idx ? 1 : 0.6
                        }}
                        className="thumbnail-item"
                    >
                        <Image src={img} alt={`${vehicleName} view ${idx + 1}`} fill style={{ objectFit: 'cover' }} />
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    onClick={closeLightbox}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'fadeIn 0.3s ease'
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            zIndex: 10001,
                            padding: '0.5rem'
                        }}
                    >
                        ✕
                    </button>

                    {/* Navigation buttons */}
                    {allImages.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                style={{
                                    position: 'absolute',
                                    left: '2rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid #444',
                                    color: '#fff',
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    zIndex: 10001,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                ←
                            </button>
                            <button
                                onClick={nextImage}
                                style={{
                                    position: 'absolute',
                                    right: '2rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid #444',
                                    color: '#fff',
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    zIndex: 10001,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                →
                            </button>
                        </>
                    )}

                    {/* Image Container */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            width: '90%',
                            height: '80%',
                            maxWidth: '1400px'
                        }}
                    >
                        <Image
                            src={allImages[activeIndex]}
                            alt={vehicleName}
                            fill
                            style={{ objectFit: 'contain' }}
                        />

                        {/* Caption */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-3rem',
                            left: 0,
                            right: 0,
                            textAlign: 'center',
                            color: '#fff',
                            fontSize: '0.9rem'
                        }}>
                            {activeIndex + 1} / {allImages.length} — {vehicleName}
                        </div>
                    </div>

                    <style jsx>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}
