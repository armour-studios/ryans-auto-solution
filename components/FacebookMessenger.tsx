'use client';

import { useState, useEffect } from 'react';

// Fallback Facebook Messenger Button
// Links directly to Messenger since SDK requires domain whitelisting

const FACEBOOK_PAGE_ID = '683212018213046';

export default function FacebookMessenger() {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Small delay to fade in
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Direct Messenger Link
    const messengerUrl = `https://m.me/${FACEBOOK_PAGE_ID}`;

    return (
        <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: '#0084ff',
                color: '#fff',
                borderRadius: '28px',
                padding: isHovered ? '0 24px 0 16px' : '0',
                width: isHovered ? 'auto' : '56px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 132, 255, 0.4)',
                cursor: 'pointer',
                zIndex: 9999,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textDecoration: 'none',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                overflow: 'hidden'
            }}
            aria-label="Chat with us on Facebook Messenger"
        >
            {/* Messenger Icon */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.906 1.438 5.503 3.686 7.197V22l3.452-1.897c.92.256 1.895.393 2.862.393 5.523 0 10-4.145 10-9.253C22 6.145 17.523 2 12 2zm1.016 12.469l-2.553-2.725-4.985 2.725 5.479-5.813 2.614 2.725 4.924-2.725-5.479 5.813z" />
                </svg>
            </div>

            {/* Expandable Text */}
            <div style={{
                width: isHovered ? 'auto' : '0',
                opacity: isHovered ? 1 : 0,
                visibility: isHovered ? 'visible' : 'hidden',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                fontSize: '15px',
                transition: 'all 0.3s ease'
            }}>
                Chat with us
            </div>
        </a>
    );
}
