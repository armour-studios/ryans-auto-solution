'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Footer() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if on admin pages (except login)
    const isAdminPage = pathname?.startsWith('/admin') && pathname !== '/admin/login';

    useEffect(() => {
        // Check for admin session by trying to detect if we're authenticated
        // We can check by seeing if we're on admin pages (which are protected)
        // OR if we have the admin_user cookie
        const checkLogin = () => {
            const hasCookie = document.cookie.split(';').some((item) => item.trim().startsWith('admin_user='));
            setIsLoggedIn(isAdminPage || hasCookie);
        };

        checkLogin();

        // Listen for storage events (logout in another tab) or just re-check periodically?
        // simple check on mount/update is usually enough for single-tab flow
    }, [isAdminPage, pathname]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <footer style={{ backgroundColor: '#000', color: '#fff', padding: '3rem 0', marginTop: 'auto', borderTop: '4px solid var(--primary-color)' }}>
            <div className="container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Image
                    src="/uploads/ras1+copy+2 (1).webp"
                    alt="Ryan's Auto Solution Logo"
                    width={180}
                    height={50}
                    style={{ objectFit: 'contain', marginBottom: '1.5rem' }}
                />
                <p style={{ marginBottom: '1rem' }}>Quality Used Cars | Fair Prices | Small Town Trust</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        325 Oak Hills Rd SE, Bemidji, MN 56601
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        (218) 469-0183
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        ryan@ryansautosolution.com
                    </span>
                </div>
                <p style={{ opacity: 0.5, fontSize: '0.8rem', marginBottom: '1rem' }}>&copy; {new Date().getFullYear()} Ryan's Auto Solution. All rights reserved.</p>

                {isLoggedIn ? (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                        <Link href="/admin" className="btn btn-primary cta-glow" style={{ padding: '0.6rem 1.2rem', borderRadius: '4px', textDecoration: 'none' }}>
                            Staff Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="cta-glow"
                            style={{
                                fontSize: '0.8rem',
                                color: '#ef4444',
                                background: 'transparent',
                                border: '1px solid currentColor',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                padding: '0.6rem 1.2rem'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link href="/admin/login" className="btn btn-primary cta-glow" style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', borderRadius: '4px', textDecoration: 'none' }}>
                        Staff Dashboard
                    </Link>
                )}
            </div>
        </footer>
    );
}
