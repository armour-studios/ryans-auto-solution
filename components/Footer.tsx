'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Footer() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [siteInfo, setSiteInfo] = useState({
        address: '325 Oak Hills Rd SE, Bemidji, MN',
        phone:   '(218) 469-0183',
        email:   'ryan@ryansautosolution.com',
    });

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

        // Fetch public site info (address, phone, email)
        fetch('/api/site-info')
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data) setSiteInfo({ address: data.address, phone: data.phone, email: data.email }); })
            .catch(() => {/* keep defaults */});
    }, [isAdminPage, pathname]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    const navLinks = ['Home', 'Inventory', 'Financing', 'Blog', 'Contact'];

    return (
        <>
            <footer className="site-footer">
                {/* Top white divider + blue accent — mirrors the nav bottom */}
                <div className="footer-top-rule" />

                <div className="container footer-inner">
                    {/* Logo + tagline */}
                    <div className="footer-brand">
                        <Image
                            src="/uploads/ryansautowhite.png"
                            alt="Ryan's Auto Solution Logo"
                            width={180}
                            height={48}
                            style={{ objectFit: 'contain' }}
                        />
                        <p className="footer-tagline">Quality Used Cars &nbsp;·&nbsp; Fair Prices &nbsp;·&nbsp; Small Town Trust</p>
                    </div>

                    {/* Nav links column */}
                    <div className="footer-col">
                        <span className="footer-col-heading">Quick Links</span>
                        <ul className="footer-links">
                            {navLinks.map(item => (
                                <li key={item}>
                                    <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="footer-link">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact column */}
                    <div className="footer-col">
                        <span className="footer-col-heading">Contact</span>
                        <ul className="footer-contact-list">
                            <li>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f71b1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                                </svg>
                                <a href="https://maps.app.goo.gl/sfenz9gjqzi62AtK9" target="_blank" rel="noopener noreferrer" className="footer-contact-link uppercase">
                                    {siteInfo.address}
                                </a>
                            </li>
                            <li>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f71b1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                                <a href={`tel:+1${siteInfo.phone.replace(/\D/g, '')}`} className="footer-contact-link">{siteInfo.phone}</a>
                            </li>
                            <li>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f71b1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                                </svg>
                                <a href={`mailto:${siteInfo.email}`} className="footer-contact-link">{siteInfo.email}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="footer-bottom">
                    <div className="container footer-bottom-inner">
                        <span className="footer-copy">&copy; {new Date().getFullYear()} Ryan&apos;s Auto Solution. All rights reserved.</span>
                        <a
                            href="https://www.armourstudioshq.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-powered"
                        >
                            <img
                                src="/uploads/armourstudiospng.png"
                                alt="Armour Studios"
                                style={{ height: '18px', width: 'auto', maxWidth: '120px', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.5, display: 'block', flexShrink: 0 }}
                            />
                            POWERED BY ARMOUR STUDIOS
                        </a>
                        <div className="footer-bottom-actions">
                            {isLoggedIn ? (
                                <>
                                    <Link href="/admin" className="footer-staff-btn">Staff Dashboard</Link>
                                    <button onClick={handleLogout} className="footer-logout-btn">Logout</button>
                                </>
                            ) : (
                                <Link href="/admin/login" className="footer-staff-btn">Staff Dashboard</Link>
                            )}
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                .site-footer {
                    background: #111111;
                    color: #f4f4f9;
                    margin-top: auto;
                    position: relative;
                }

                /* Top rule: white hairline + brand-blue accent (mirrors nav bottom/top) */
                .footer-top-rule {
                    height: 2px;
                    background: rgba(255,255,255,0.22);
                    position: relative;
                }
                .footer-top-rule::after {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 0; right: 0;
                    height: 2px;
                    background: linear-gradient(90deg,
                        #111111 0%,
                        rgba(15,113,177,0.3) 20%,
                        #0f71b1 50%,
                        rgba(15,113,177,0.3) 80%,
                        #111111 100%
                    );
                }

                .footer-inner {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 3rem;
                    padding: 3rem 0 2rem;
                    border-bottom: 1px solid #333333;
                }

                .footer-brand {
                    display: flex;
                    flex-direction: column;
                    gap: 0.9rem;
                }

                .footer-tagline {
                    font-size: 0.78rem;
                    color: #aaaaaa;
                    letter-spacing: 0.5px;
                    margin: 0;
                }

                .footer-col {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .footer-col-heading {
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: #0f71b1;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #333333;
                }

                .footer-links {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .footer-link {
                    font-size: 0.82rem;
                    font-weight: 600;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    color: rgba(244,244,249,0.7);
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer-link:hover { color: #f4f4f9; }

                .footer-contact-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.65rem;
                }

                .footer-contact-list li {
                    display: flex;
                    align-items: center;
                    gap: 0.55rem;
                }

                .footer-contact-link {
                    font-size: 0.82rem;
                    color: rgba(244,244,249,0.75);
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer-contact-link.uppercase {
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    font-size: 0.78rem;
                }
                .footer-contact-link:hover { color: #f4f4f9; }

                .footer-bottom {
                    background: #0d0d0d;
                }

                .footer-bottom-inner {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    padding: 0.9rem 0;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .footer-copy {
                    font-size: 0.72rem;
                    color: #aaaaaa;
                    letter-spacing: 0.4px;
                }

                .footer-powered {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.62rem;
                    font-weight: 800;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                    color: #555555;
                    text-decoration: none;
                    transition: opacity 0.2s;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    white-space: nowrap;
                }
                .footer-powered img { opacity: 0.5; transition: opacity 0.2s; filter: brightness(0) invert(1); }
                .footer-powered:hover { color: #aaaaaa; }
                .footer-powered:hover img { opacity: 0.85; }

                .footer-bottom-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .footer-staff-btn {
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: #f4f4f9;
                    text-decoration: none;
                    padding: 0.38rem 0.9rem;
                    border: 1px solid #333333;
                    border-radius: 4px;
                    background: #1a1a1a;
                    transition: border-color 0.2s, background 0.2s;
                }
                .footer-staff-btn:hover {
                    border-color: #0f71b1;
                    background: rgba(15,113,177,0.1);
                }

                .footer-logout-btn {
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: #ef4444;
                    padding: 0.38rem 0.9rem;
                    border: 1px solid #333333;
                    border-radius: 4px;
                    background: transparent;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                .footer-logout-btn:hover { border-color: #ef4444; }

                @media (max-width: 768px) {
                    .footer-inner {
                        grid-template-columns: 1fr;
                        gap: 0;
                        padding: 0;
                        border-bottom: none;
                    }

                    .footer-brand {
                        align-items: center;
                        text-align: center;
                        padding: 2rem 1.25rem 1.75rem;
                        border-bottom: 1px solid #1e1e1e;
                    }

                    .footer-col {
                        padding: 1.5rem 1.25rem;
                        border-bottom: 1px solid #1e1e1e;
                        align-items: center;
                        text-align: center;
                    }

                    .footer-links {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 0.4rem 1rem;
                        width: 100%;
                        justify-items: center;
                    }

                    .footer-link {
                        font-size: 0.84rem;
                    }

                    .footer-contact-list {
                        align-items: center;
                    }

                    .footer-contact-list li {
                        align-items: center;
                        justify-content: center;
                    }

                    .footer-contact-list li svg {
                        flex-shrink: 0;
                    }

                    .footer-contact-link {
                        font-size: 0.84rem;
                        word-break: break-word;
                        overflow-wrap: break-word;
                        line-height: 1.5;
                    }

                    .footer-bottom-inner {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        gap: 0.6rem;
                        padding: 1.1rem 1.25rem;
                    }

                    .footer-powered {
                        position: static;
                        transform: none;
                        left: auto;
                        order: 2;
                    }

                    .footer-copy { order: 1; }

                    .footer-bottom-actions {
                        justify-content: center;
                        order: 3;
                    }
                }

                @media (max-width: 480px) {
                    .footer-links {
                        grid-template-columns: 1fr;
                    }
                    .footer-copy,
                    .footer-powered {
                        font-size: 0.7rem;
                    }
                }
            `}</style>
        </>
    );
}
