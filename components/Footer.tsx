'use client';

import Link from 'next/link';
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
        setIsLoggedIn(isAdminPage || false);
    }, [isAdminPage]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <footer style={{ backgroundColor: '#000', color: '#fff', padding: '3rem 0', marginTop: 'auto', borderTop: '4px solid var(--primary-color)' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '2px' }}>Ryan's Auto Solution</h3>
                <p style={{ marginBottom: '1rem' }}>Quality Used Cars | Fair Prices | Small Town Trust</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span>📍 325 Oak Hills Rd SE, Bemidji, MN 56601</span>
                    <span>📞 (218) 469-0183</span>
                    <span>✉️ ryan@ryansautosolution.com</span>
                </div>
                <p style={{ opacity: 0.5, fontSize: '0.8rem', marginBottom: '1rem' }}>&copy; {new Date().getFullYear()} Ryan's Auto Solution. All rights reserved.</p>

                {isLoggedIn ? (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                        <Link href="/admin" style={{ fontSize: '0.75rem', color: '#666', textDecoration: 'none' }}>
                            Admin Dashboard
                        </Link>
                        <span style={{ color: '#333' }}>|</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                fontSize: '0.75rem',
                                color: '#ef4444',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link href="/admin/login" style={{ fontSize: '0.75rem', color: '#444', textDecoration: 'none' }}>
                        Admin Login
                    </Link>
                )}
            </div>
        </footer>
    );
}
