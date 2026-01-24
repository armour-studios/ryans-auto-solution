'use client';

import { useState } from 'react';

// Facebook Messenger floating button
// Links directly to your Facebook page Messenger

const FACEBOOK_PAGE_USERNAME = 'ryansautosolution';

export default function FacebookMessenger() {
    const [isHovered, setIsHovered] = useState(false);

    const messengerUrl = `https://m.me/${FACEBOOK_PAGE_USERNAME}`;

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
                width: isHovered ? 'auto' : '60px',
                height: '60px',
                backgroundColor: '#0084ff',
                borderRadius: isHovered ? '30px' : '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: isHovered ? '0 20px' : '0',
                boxShadow: '0 4px 20px rgba(0, 132, 255, 0.4)',
                cursor: 'pointer',
                zIndex: 9999,
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                color: '#fff'
            }}
            title="Chat with us on Messenger"
        >
            {/* Messenger Icon */}
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
            >
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.906 1.438 5.503 3.686 7.197V22l3.452-1.897c.92.256 1.895.393 2.862.393 5.523 0 10-4.145 10-9.253C22 6.145 17.523 2 12 2zm1.016 12.469l-2.553-2.725-4.985 2.725 5.479-5.813 2.614 2.725 4.924-2.725-5.479 5.813z" />
            </svg>

            {isHovered && (
                <span style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    whiteSpace: 'nowrap'
                }}>
                    Chat with us
                </span>
            )}
        </a>
    );
}
