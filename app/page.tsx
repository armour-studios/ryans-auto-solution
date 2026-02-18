import Link from 'next/link';
import Image from 'next/image';
import { getTestimonials } from '@/lib/testimonials';
import { getInventory } from '@/lib/inventory';
import FeaturedVehicles from '@/components/FeaturedVehicles';
import RecentlySoldCarousel from '@/components/RecentlySoldCarousel';
import Testimonials from '@/components/Testimonials';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const allTestimonials = await getTestimonials();
  const testimonials = allTestimonials.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  // Get featured/trending vehicles
  const inventory = await getInventory();
  const featuredVehicles = inventory.filter(v => v.trending && v.status === 'Available').slice(0, 6);
  const soldVehicles = inventory.filter(v => v.status === 'Sold').slice(0, 5);

  return (
    <main>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff',
        overflow: 'hidden'
      }}>
        {/* Background Video */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          zIndex: -2
        }}>
          <video
            src="/uploads/main.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.5)' // Darken the video
            }}
          />
        </div>


        <div className="container animate-fade-in" style={{ zIndex: 1, position: 'relative', width: '100%' }}>
          <div className="glass-card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 className="animate-fade-in-up" style={{
              fontSize: '4.2rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              letterSpacing: '2px',
              color: '#ffffff',
              whiteSpace: 'nowrap',
              textShadow: '0 10px 20px rgba(0,0,0,0.3)'
            }}>
              Find Your Dream Ride
            </h1>
            <p className="animate-fade-in-up" style={{
              fontSize: '1.4rem',
              marginBottom: '2.5rem',
              maxWidth: '650px',
              margin: '0 auto 2.5rem',
              color: 'rgba(255,255,255,0.9)',
              animationDelay: '0.2s'
            }}>
              Quality pre-owned vehicles at unbeatable prices.<br />
              Experience the Ryan&apos;s Auto Solution difference today.
            </p>
            <div className="animate-fade-in-up" style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              animationDelay: '0.4s'
            }}>
              <Link href="/inventory" className="btn btn-primary cta-glow" style={{ fontSize: '1.1rem', padding: '1.2rem 2.5rem', borderRadius: '50px' }}>
                View Inventory
              </Link>
              <a href="https://lotuspf.com/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary cta-glow" style={{
                fontSize: '1.1rem',
                padding: '1.2rem 2.5rem',
                borderRadius: '50px',
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.2)'
              }}>
                Get Financing
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce" style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          color: 'rgba(255,255,255,0.5)',
          fontSize: '2rem'
        }}>
          ↓
        </div>
      </section>

      {/* Featured Vehicles Carousel */}
      {featuredVehicles.length > 0 && (
        <FeaturedVehicles vehicles={featuredVehicles} />
      )}

      {/* Features Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#000' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', color: '#fff', textAlign: 'center' }}>
            <div style={{ padding: '2rem', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#111' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--primary-color)', display: 'flex', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Quality Assured</h3>
              <p style={{ color: '#aaa' }}>Every vehicle passes a rigorous multi-point inspection before it hits our lot.</p>
            </div>
            <div style={{ padding: '2rem', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#111' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--primary-color)', display: 'flex', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Fair Pricing</h3>
              <p style={{ color: '#aaa' }}>No hidden fees. Just honest pricing and great deals on all our inventory.</p>
            </div>
            <div style={{ padding: '2rem', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#111' }}>
              <div style={{ marginBottom: '1rem', color: 'var(--primary-color)', display: 'flex', justifyContent: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <polyline points="17 11 19 13 23 9"></polyline>
                </svg>
              </div>
              <h3 style={{ marginBottom: '1rem' }}>Easy Financing</h3>
              <p style={{ color: '#aaa' }}>We work with multiple lenders to get you approved regardless of your credit history.</p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials initialTestimonials={testimonials} />

      {/* Why Buy From Us Section */}
      <section style={{
        padding: '6rem 0',
        background: 'linear-gradient(180deg, #000 0%, #0a0a0a 50%, #000 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(0, 123, 255, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{
              display: 'inline-block',
              color: 'var(--primary-color)',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              marginBottom: '1rem',
              fontWeight: 'bold'
            }}>
              The Ryan&apos;s Difference
            </span>
            <h2 style={{
              fontSize: '3rem',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              letterSpacing: '2px',
              fontWeight: 'bold'
            }}>
              Why Choose <span style={{
                background: 'linear-gradient(90deg, var(--primary-color), #00d4ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Us</span>
            </h2>
            <p style={{
              color: '#888',
              maxWidth: '600px',
              margin: '0 auto',
              fontSize: '1.1rem',
              lineHeight: '1.7'
            }}>
              We&apos;re your neighbors first, and car sellers second. Experience the difference of buying from people who genuinely care.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Card 1: Locally Owned */}
            <div className="card-glow" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(10px)',
              padding: '2.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, var(--primary-color), #00d4ff)'
              }} />
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0, 123, 255, 0.2) 0%, rgba(0, 123, 255, 0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3 style={{
                marginBottom: '1rem',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}>Locally Owned</h3>
              <p style={{ color: '#999', lineHeight: '1.7', fontSize: '1rem' }}>
                We live and work right here in Bemidji. When you buy from us, you&apos;re supporting a local family—not a faceless corporation.
              </p>
            </div>

            {/* Card 2: Winter Ready */}
            <div className="card-glow" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(10px)',
              padding: '2.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #00d4ff, var(--primary-color))'
              }} />
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 212, 255, 0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <line x1="12" y1="2" x2="12" y2="22"></line>
                  <path d="M20 12H4"></path>
                  <path d="M18 6l-6 6l6 6"></path>
                  <path d="M6 18l6-6l-6-6"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h3 style={{
                marginBottom: '1rem',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}>Winter-Ready</h3>
              <p style={{ color: '#999', lineHeight: '1.7', fontSize: '1rem' }}>
                Every vehicle is hand-selected for Northern Minnesota winters. We know what works when it&apos;s -30°F outside.
              </p>
            </div>

            {/* Card 3: Financing Options */}
            <div className="card-glow" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(10px)',
              padding: '2.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #10b981, #00d4ff)'
              }} />
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <h3 style={{
                marginBottom: '1rem',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}>Financing Assistance</h3>
              <p style={{ color: '#999', lineHeight: '1.7', fontSize: '1rem' }}>
                We work with lenders to help find financing options that may work for your situation.
              </p>
            </div>

            {/* Card 4: Inspected & Ready */}
            <div className="card-glow" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(10px)',
              padding: '2.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, #f59e0b, #ef4444)'
              }} />
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3 style={{
                marginBottom: '1rem',
                fontSize: '1.4rem',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}>Inspected & Ready</h3>
              <p style={{ color: '#999', lineHeight: '1.7', fontSize: '1rem' }}>
                Every vehicle undergoes a thorough inspection for rust, mechanical issues, and true winter readiness.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link href="/about" className="cta-glow" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2.5rem',
              background: 'transparent',
              border: '2px solid var(--primary-color)',
              color: 'var(--primary-color)',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}>
              Learn More About Us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>



      <RecentlySoldCarousel initialVehicles={soldVehicles} />

      {/* Final Conversion CTA */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, #000 0%, #0a1628 100%)',
        borderTop: '1px solid #333',
        textAlign: 'center'
      }}>
        <div className="container">
          <div className="glass-card" style={{ padding: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3rem', color: '#fff', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              Ready to find your <span style={{ color: 'var(--primary-color)' }}>next vehicle?</span>
            </h2>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
              Browse our current inventory or visit us today for a test drive. We&apos;re here to help you get on the road.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/inventory" className="btn btn-primary cta-glow" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem' }}>
                View Inventory
              </Link>
              <Link href="/contact" className="btn btn-outline cta-glow" style={{
                padding: '1.2rem 2.5rem',
                fontSize: '1.1rem',
                border: '2px solid var(--primary-color)',
                backgroundColor: 'transparent',
                color: 'var(--primary-color)'
              }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main >
  );
}
