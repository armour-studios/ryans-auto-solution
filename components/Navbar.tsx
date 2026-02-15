"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Bar - "King of the Road" style info bar */}
      <div style={{ backgroundColor: 'var(--primary-color)', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold', padding: '0.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <span className="hide-on-mobile">📞 (218) 469-0183</span>
            <span className="hide-on-mobile">📍 325 Oak Hills Rd SE, Bemidji, MN 56601</span>
            <a href="https://maps.app.goo.gl/sfenz9gjqzi62AtK9" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '4px', textTransform: 'uppercase', textDecoration: 'none' }}>
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
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            style={{ display: 'none' }}
          >
            ☰
          </button>

          <ul className={`nav-links ${isOpen ? 'open' : ''}`} style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0 }}>
            {['Home', 'Inventory', 'Financing', 'Blog', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  style={{
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    letterSpacing: '1px'
                  }}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
