'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function DirectionsCTA() {
    const [open, setOpen] = useState(false);
    const MAPS_URL = 'https://maps.app.goo.gl/6DmndURC1jqZ5xvx6';

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="btn btn-primary cta-glow"
                style={{ padding: '1.5rem 4rem', fontSize: '1.2rem', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '1rem', border: 'none', cursor: 'pointer' }}
            >
                Get Directions Online
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

            {open && (
                <div className="ext-popup-overlay" onClick={() => setOpen(false)}>
                    <div className="ext-popup" onClick={e => e.stopPropagation()}>
                        <button className="ext-popup-close" onClick={() => setOpen(false)} aria-label="Close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        <div className="ext-popup-logo">
                            <Image src="/uploads/ryansautowhite.png" alt="Ryan's Auto Solution" width={180} height={50} style={{ objectFit: 'contain' }} />
                        </div>
                        <div className="ext-popup-divider" />
                        <div className="ext-popup-icon">
                            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                        </div>
                        <h3 className="ext-popup-title">You&apos;re Leaving Our Site</h3>
                        <p className="ext-popup-text">
                            You will be redirected to <strong>Google Maps</strong> for directions to our location. Ryan&apos;s Auto Solution is not responsible for the content on external sites.
                        </p>
                        <a
                            href={MAPS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn cta-glow ext-popup-btn"
                            onClick={() => setOpen(false)}
                        >
                            Open in Google Maps
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                            </svg>
                        </a>
                        <button className="ext-popup-cancel" onClick={() => setOpen(false)}>
                            Go Back
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
