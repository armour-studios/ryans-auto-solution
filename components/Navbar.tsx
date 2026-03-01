"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showExtPopup, setShowExtPopup] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  useEffect(() => {
    const checkAuth = () => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; admin_user=`);
      setIsAdmin(parts.length === 2);
    };
    checkAuth();
    const interval = setInterval(checkAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["Home", "Inventory", "Trailers", "Financing", "Blog", "Contact"];

  return (
    <>
      <header className={`glass-header ${scrolled ? "scrolled" : ""}`}>
        {/* Top contact strip */}
        <div className="glass-topbar">
          <div className="glass-topbar-inner container">
            <a href="tel:+12184690183" className="glass-topbar-link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              (218) 469-0183
            </a>
            <span className="glass-topbar-separator" />
            <a href="https://maps.app.goo.gl/6DmndURC1jqZ5xvx6" target="_blank" rel="noopener noreferrer" className="glass-topbar-link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              325 Oak Hills Rd SE, Bemidji, MN
            </a>
            <a href="https://maps.app.goo.gl/6DmndURC1jqZ5xvx6" target="_blank" rel="noopener noreferrer" className="glass-topbar-directions">
              Directions
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
            </a>
            {isAdmin && (
              <>
                <span className="glass-topbar-separator" />
                <Link href="/admin" className="glass-topbar-staff-btn">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  Staff Dashboard
                </Link>
                <button onClick={handleLogout} className="glass-topbar-logout-btn">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile topbar */}
          <div className="glass-topbar-mobile">
            <a href="tel:+12184690183" className="glass-topbar-mobile-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call
            </a>
            <a href="https://maps.app.goo.gl/6DmndURC1jqZ5xvx6" target="_blank" rel="noopener noreferrer" className="glass-topbar-mobile-btn border-x">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Map
            </a>
            <a href="https://maps.app.goo.gl/6DmndURC1jqZ5xvx6" target="_blank" rel="noopener noreferrer" className="glass-topbar-mobile-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              Directions
            </a>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="glass-nav">
          <div className="glass-nav-inner container">
            <Link href="/" className="glass-logo">
              <Image
                src="/uploads/ryansautowhite.png"
                alt="Ryan's Auto Solution"
                width={220}
                height={60}
                style={{ objectFit: "contain", maxWidth: "160px", height: "auto" }}
                priority
              />
            </Link>

            {/* Desktop links */}
            <ul className="glass-nav-links">
              {navItems.map((item) => (
                <li key={item}>
                  {item === "Trailers" ? (
                    <a
                      href="#"
                      className="glass-nav-link"
                      onClick={(e) => { e.preventDefault(); setShowExtPopup(true); }}
                    >
                      {item}
                    </a>
                  ) : (
                    <Link
                      href={item === "Home" ? "/" : item === "Admin" ? "/admin" : `/${item.toLowerCase()}`}
                      className={`glass-nav-link ${item === "Admin" ? "admin-link" : ""}`}
                    >
                      {item}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <a href="tel:+12184690183" className="glass-cta-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Call Now
                </a>
              </li>
            </ul>

            {/* Hamburger */}
            <button
              className={`glass-hamburger ${isOpen ? "open" : ""}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>

          {/* Mobile Drawer */}
          <div className={`glass-mobile-drawer ${isOpen ? "open" : ""}`}>
            <div className="glass-mobile-links">
              {navItems.map((item) => (
                <div key={item} className="glass-mobile-link-wrap">
                  {item === "Trailers" ? (
                    <a
                      href="#"
                      className="glass-mobile-link"
                      onClick={(e) => { e.preventDefault(); setIsOpen(false); setShowExtPopup(true); }}
                    >
                      {item}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </a>
                  ) : (
                    <Link
                      href={item === "Home" ? "/" : item === "Admin" ? "/admin" : `/${item.toLowerCase()}`}
                      className={`glass-mobile-link ${item === "Admin" ? "admin-link" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                    </Link>
                  )}
                </div>
              ))}
              <div style={{ padding: "1rem 1.5rem" }}>
                <a href="tel:+12184690183" className="glass-mobile-cta" onClick={() => setIsOpen(false)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  (218) 469-0183
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      {isOpen && <div className="glass-overlay" onClick={() => setIsOpen(false)} />}

      {/* External Site Popup */}
      {showExtPopup && (
        <div className="ext-popup-overlay" onClick={() => setShowExtPopup(false)}>
          <div className="ext-popup" onClick={(e) => e.stopPropagation()}>
            <button className="ext-popup-close" onClick={() => setShowExtPopup(false)} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="ext-popup-logo">
              <Image src="/uploads/ryansautowhite.png" alt="Ryan's Auto Solution" width={180} height={50} style={{ objectFit: "contain" }} />
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
              You&apos;re about to visit <strong>King of the Road Trailer</strong>, our trusted trailer partner. Their site has its own privacy policy and terms.
            </p>
            <a href="https://www.kingoftheroadtrailer.com" target="_blank" rel="noopener noreferrer" className="ext-popup-btn" onClick={() => setShowExtPopup(false)}>
              Continue to King of the Road Trailer
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <button className="ext-popup-cancel" onClick={() => setShowExtPopup(false)}>Go Back</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* =============================================
           GLASS CHROME NAVBAR  —  brand: #0f71b1
           ============================================= */
        .glass-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          filter: drop-shadow(0 2px 24px rgba(15,113,177,0.08));
          transition: filter 0.3s;
        }

        .glass-header.scrolled {
          filter: drop-shadow(0 4px 32px rgba(15,113,177,0.15));
        }

        /* ---- TOP BAR ---- */
        .glass-topbar {
          background: #111111;
          border-bottom: 1px solid #333333;
        }

        .glass-topbar-inner {
          display: flex;
          align-items: center;
          gap: 1.75rem;
          padding: 0.44rem 0;
          justify-content: flex-end;
        }

        .glass-topbar-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: rgba(244,244,249,0.82);
          text-decoration: none;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.9px;
          text-transform: uppercase;
          transition: color 0.2s;
        }

        .glass-topbar-link svg { color: #0f71b1; }

        .glass-topbar-link:hover { color: #f4f4f9; }
        .glass-topbar-link:hover svg { color: #1483cc; }

        .glass-topbar-separator {
          width: 1px;
          height: 13px;
          background: #333333;
        }

        .glass-topbar-directions {
          display: flex;
          align-items: center;
          gap: 0.38rem;
          color: #f4f4f9;
          text-decoration: none;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          padding: 0.22rem 0.8rem;
          border-radius: 4px;
          border: 1px solid #333333;
          background: #1a1a1a;
          transition: all 0.22s;
        }

        .glass-topbar-directions:hover {
          background: rgba(15,113,177,0.15);
          border-color: #0f71b1;
          color: #fff;
        }

        .glass-topbar-staff-btn {
          display: flex;
          align-items: center;
          gap: 0.38rem;
          color: #f4f4f9;
          text-decoration: none;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          padding: 0.22rem 0.8rem;
          border-radius: 4px;
          border: 1px solid #333333;
          background: #1a1a1a;
          transition: all 0.22s;
        }
        .glass-topbar-staff-btn:hover {
          background: rgba(15,113,177,0.15);
          border-color: #0f71b1;
          color: #fff;
        }

        .glass-topbar-logout-btn {
          display: flex;
          align-items: center;
          color: #ef4444;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          padding: 0.22rem 0.8rem;
          border-radius: 4px;
          border: 1px solid #333333;
          background: transparent;
          cursor: pointer;
          transition: all 0.22s;
        }
        .glass-topbar-logout-btn:hover {
          border-color: #ef4444;
          background: rgba(239,68,68,0.08);
        }

        /* Mobile top bar */
        .glass-topbar-mobile {
          display: none;
          align-items: stretch;
          background: #111111;
          border-bottom: 1px solid #333333;
        }

        .glass-topbar-mobile-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          color: rgba(244,244,249,0.72);
          text-decoration: none;
          font-size: 0.74rem;
          font-weight: 600;
          padding: 0.6rem 0;
          transition: color 0.2s, background 0.2s;
        }

        .glass-topbar-mobile-btn:hover { color: #f4f4f9; background: rgba(15,113,177,0.08); }

        .glass-topbar-mobile-btn.border-x {
          border-left: 1px solid #333333;
          border-right: 1px solid #333333;
        }

        /* ---- MAIN NAV ---- */
        .glass-nav {
          background: #111111;
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border-bottom: 2px solid rgba(255,255,255,0.22);
          box-shadow: 0 2px 24px rgba(0,0,0,0.55);
          position: relative;
        }

        /* Top brand-blue accent line on nav */
        .glass-nav::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg,
            #111111 0%,
            rgba(15,113,177,0.3) 20%,
            #0f71b1 50%,
            rgba(15,113,177,0.3) 80%,
            #111111 100%
          );
        }

        .glass-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.55rem 0;
          gap: 0;
        }

        .glass-logo {
          display: flex;
          align-items: center;
          align-self: center;
          flex-shrink: 0;
          padding-right: 1.75rem;
          margin-right: 1.25rem;
          border-right: 1px solid #333333;
          transition: filter 0.2s;
        }

        .glass-logo:hover {
          filter: brightness(1.08) drop-shadow(0 0 10px rgba(15,113,177,0.45));
        }

        /* ---- NAV LINKS ---- */
        .glass-nav-links {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .glass-nav-link {
          display: block;
          padding: 0.5rem 0.9rem;
          color: rgba(244,244,249,0.8);
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.3px;
          text-transform: uppercase;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
          position: relative;
          cursor: pointer;
          background: none;
          border: none;
        }

        /* Animated underline bar */
        .glass-nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          right: 50%;
          height: 2px;
          background: #0f71b1;
          border-radius: 1px;
          transition: left 0.25s ease, right 0.25s ease, opacity 0.25s ease;
          opacity: 0;
        }

        .glass-nav-link:hover {
          color: #f4f4f9;
          background: rgba(15,113,177,0.09);
        }

        .glass-nav-link:hover::after {
          left: 0.9rem;
          right: 0.9rem;
          opacity: 1;
        }

        .glass-nav-link.admin-link { color: #0f71b1; }

        .glass-nav-link.admin-link:hover {
          background: rgba(15,113,177,0.1);
          color: #f4f4f9;
        }

        /* CTA button */
        .glass-cta-btn {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.52rem 1.2rem;
          background: linear-gradient(135deg, #0d65a0 0%, #0f71b1 50%, #1483cc 100%);
          color: #fff !important;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          border-radius: 50px;
          border: 1px solid rgba(78,170,220,0.35);
          box-shadow:
            0 2px 14px rgba(15,113,177,0.45),
            0 0 0 1px rgba(15,113,177,0.2),
            inset 0 1px 0 rgba(255,255,255,0.18);
          transition: all 0.22s;
          white-space: nowrap;
          margin-left: 0.75rem;
        }

        .glass-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow:
            0 6px 24px rgba(15,113,177,0.6),
            0 0 0 1px rgba(78,170,220,0.4),
            inset 0 1px 0 rgba(255,255,255,0.22);
          background: linear-gradient(135deg, #0f71b1 0%, #1483cc 50%, #18a0e8 100%);
        }

        .glass-cta-btn:active { transform: translateY(0); }

        /* ---- HAMBURGER ---- */
        .glass-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: #1a1a1a;
          border: 1px solid #333333;
          border-radius: 6px;
          padding: 0.58rem;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }

        .glass-hamburger:hover {
          background: rgba(15,113,177,0.12);
          border-color: #0f71b1;
        }

        .glass-hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #f4f4f9;
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
          transform-origin: center;
        }

        .glass-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .glass-hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
        .glass-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ---- MOBILE DRAWER ---- */
        .glass-mobile-drawer {
          display: none;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1);
          background: #111111;
          border-top: 1px solid #333333;
        }

        .glass-mobile-drawer.open { max-height: 620px; }

        .glass-mobile-links { padding: 0.5rem 0; }

        .glass-mobile-link-wrap { border-bottom: 1px solid #222222; }

        .glass-mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.92rem 1.5rem;
          color: rgba(244,244,249,0.82);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          cursor: pointer;
          background: none;
          border: none;
          width: 100%;
          transition: color 0.2s, background 0.2s;
        }

        .glass-mobile-link:hover {
          color: #f4f4f9;
          background: rgba(15,113,177,0.09);
        }

        .glass-mobile-link.admin-link { color: #4eaadc; }

        .glass-mobile-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.88rem;
          background: linear-gradient(135deg, #0d65a0 0%, #0f71b1 60%, #1483cc 100%);
          color: #fff;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          border-radius: 8px;
          border: 1px solid rgba(78,170,220,0.3);
          box-shadow: 0 4px 20px rgba(15,113,177,0.45);
          transition: filter 0.2s;
        }

        .glass-mobile-cta:hover { filter: brightness(1.12); }

        .glass-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2,8,18,0.6);
          z-index: 999;
          backdrop-filter: blur(3px);
        }

        @media (max-width: 768px) {
          .glass-topbar-inner { display: none !important; }
          .glass-topbar-mobile { display: flex; }
          .glass-nav-links { display: none !important; }
          .glass-hamburger { display: flex; }
          .glass-mobile-drawer { display: block; }
          .glass-logo { border-right: none; padding-right: 0; margin-right: 0; }
          .glass-nav-inner { padding: 0.5rem 0; }
          .glass-mobile-drawer.open { max-height: 85vh; overflow-y: auto; -webkit-overflow-scrolling: touch; }
          .glass-mobile-link { padding: 1rem 1.5rem; font-size: 0.92rem; min-height: 48px; }
          .glass-mobile-cta { padding: 1rem; font-size: 0.92rem; min-height: 48px; }
          .glass-topbar-mobile-btn { min-height: 40px; font-size: 0.78rem; }
        }

        @media (max-width: 480px) {
          .glass-logo img { max-width: 130px !important; }
          .glass-hamburger { padding: 0.5rem; }
          .ext-popup { padding: 1.75rem 1.25rem; border-radius: 12px; }
          .ext-popup-title { font-size: 1.1rem; }
          .ext-popup-text { font-size: 0.88rem; margin-bottom: 1.5rem; }
          .ext-popup-btn { font-size: 0.88rem; padding: 0.9rem 1rem; }
        }
      `}</style>
    </>
  );
}
