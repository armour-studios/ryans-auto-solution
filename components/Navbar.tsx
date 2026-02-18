"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for admin_user cookie
    const checkAuth = () => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; admin_user=`);
      if (parts.length === 2) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkAuth();

    // Check occasionally in case of login/logout in other tabs
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Bar - "King of the Road" style info bar */}
      <div style={{ backgroundColor: 'var(--primary-color)', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', padding: '0.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <span className="hide-on-mobile" style={{ alignItems: 'center', gap: '0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              (218) 469-0183
            </span>
            <span className="hide-on-mobile" style={{ alignItems: 'center', gap: '0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              325 Oak Hills Rd SE, Bemidji, MN 56601
            </span>
            <a href="https://maps.app.goo.gl/sfenz9gjqzi62AtK9" target="_blank" rel="noopener noreferrer" className="cta-glow" style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', padding: '0.35rem 1rem', borderRadius: '4px', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
              Directions
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav style={{ backgroundColor: '#000', color: '#fff', padding: '1rem 0', borderBottom: '4px solid #333' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              src="/uploads/ras1+copy+2 (1).webp"
              alt="Ryan's Auto Solution Logo"
              width={220}
              height={60}
              style={{ objectFit: 'contain', maxWidth: '160px', height: 'auto' }}
              className="logo-img"
              priority
            />
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '2rem',
              cursor: 'pointer',
              display: 'none' // Controlled by CSS media query
            }}
          >
            {isOpen ? '✕' : '☰'}
          </button>

          <ul className={`nav-links ${isOpen ? 'open' : ''}`} style={{
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            margin: 0,
            transition: 'all 0.3s ease'
          }}>
            {(() => {
              const items = ['Home', 'Inventory', 'Trailers', 'Financing', 'Blog', 'Contact'];
              if (isAdmin) items.push('Admin');
              return items.map((item) => (
                <li key={item} onClick={() => setIsOpen(false)}>
                  <Link
                    href={item === 'Home' ? '/' : item === 'Trailers' ? 'https://www.kingoftheroadtrailer.com' : item === 'Admin' ? '/admin' : `/${item.toLowerCase()}`}
                    target={item === 'Trailers' ? '_blank' : undefined}
                    rel={item === 'Trailers' ? 'noopener noreferrer' : undefined}
                    style={{
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      letterSpacing: '1px',
                      color: item === 'Admin' ? 'var(--primary-color)' : '#fff'
                    }}
                  >
                    {item}
                  </Link>
                </li>
              ));
            })()}
          </ul>
        </div>
      </nav>
    </header>
  );
}
