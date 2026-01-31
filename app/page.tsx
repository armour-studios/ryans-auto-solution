import Link from 'next/link';
import Image from 'next/image';
import { getTestimonials } from '@/lib/testimonials';
import { getInventory } from '@/lib/inventory';
import FeaturedVehicles from '@/components/FeaturedVehicles';

export default async function Home() {
  const allTestimonials = await getTestimonials();
  const testimonials = allTestimonials.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  // Get featured/trending vehicles
  const inventory = await getInventory();
  const featuredVehicles = inventory.filter(v => v.trending && v.status === 'Available').slice(0, 6);

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
        {/* Background Image Placeholder */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#111',
          zIndex: -1
        }}>
          <Image
            src="/hero-bg.png"
            alt="RAM 1500 Truck"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <div className="container">
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px' }}>
            Find Your <span style={{ color: 'var(--primary-color)' }}>Dream Ride</span>
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Quality pre-owned vehicles at unbeatable prices. Experience the Ryan's Auto Solution difference today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/inventory" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
              View Inventory
            </Link>
            <a href="https://lotuspf.com/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
              Get Financing
            </a>
          </div>
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
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>✓</div>
              <h3 style={{ marginBottom: '1rem' }}>Quality Assured</h3>
              <p style={{ color: '#aaa' }}>Every vehicle passes a rigorous multi-point inspection before it hits our lot.</p>
            </div>
            <div style={{ padding: '2rem', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#111' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>💲</div>
              <h3 style={{ marginBottom: '1rem' }}>Fair Pricing</h3>
              <p style={{ color: '#aaa' }}>No hidden fees. Just honest pricing and great deals on all our inventory.</p>
            </div>
            <div style={{ padding: '2rem', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#111' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>🤝</div>
              <h3 style={{ marginBottom: '1rem' }}>Easy Financing</h3>
              <p style={{ color: '#aaa' }}>We work with multiple lenders to get you approved regardless of your credit history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '6rem 0', backgroundColor: '#111', color: '#fff' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '3rem', letterSpacing: '1px' }}>
            What Our <span style={{ color: 'var(--primary-color)' }}>Customers Say</span>
          </h2>

          {testimonials.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {testimonials.map(t => (
                <div key={t.id} style={{ backgroundColor: '#222', padding: '2rem', borderRadius: '8px', border: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: 'gold', marginBottom: '1rem', fontSize: '1.2rem' }}>
                    {'⭐'.repeat(t.rating)}
                  </div>
                  <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '1.1rem', flex: 1 }}>
                    "{t.content}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{t.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#222', borderRadius: '8px', color: '#888' }}>
              Customer reviews coming soon!
            </div>
          )}
        </div>
      </section>

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
            <div style={{
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <div style={{
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <div style={{
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <div style={{
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
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <Link href="/about" style={{
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

      {/* Serving Northern Minnesota Section */}
      <section style={{ padding: '6rem 0', backgroundColor: '#0a1628', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px' }}>
                Proudly Serving <span style={{ color: 'var(--primary-color)' }}>Northern Minnesota</span>
              </h2>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#ccc' }}>
                Located in Bemidji, we serve customers throughout Beltrami County and all of Northern Minnesota. Whether you&apos;re from Walker, Cass Lake, Park Rapids, or Bagley—we&apos;re here to help you find your next vehicle.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem', color: '#aaa' }}>
                Our vehicles can be viewed at <strong>King of The Road Trailers</strong> in Bemidji. Stop by for a test drive—no appointment needed!
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
                {['Bemidji', 'Walker', 'Cass Lake', 'Park Rapids', 'Bagley', 'Blackduck', 'Laporte', 'Solway'].map(city => (
                  <span key={city} style={{
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    color: 'var(--primary-color)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(0, 123, 255, 0.3)'
                  }}>
                    {city}
                  </span>
                ))}
              </div>

              <a href="https://maps.app.goo.gl/sfenz9gjqzi62AtK9" target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none' }}>
                Get Directions
              </a>
            </div>

            <div style={{ backgroundColor: '#111', padding: '2.5rem', borderRadius: '12px', border: '1px solid #333' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>📍 Visit Us Today</h3>
              <address style={{ fontStyle: 'normal', lineHeight: '2', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                <strong>Ryan&apos;s Auto Solution</strong><br />
                325 Oak Hills Rd SE<br />
                Bemidji, MN 56601
              </address>
              <div style={{ borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <strong style={{ color: '#888' }}>Phone:</strong><br />
                  <a href="tel:2184690183" style={{ color: 'var(--primary-color)', fontSize: '1.3rem', fontWeight: 'bold' }}>
                    (218) 469-0183
                  </a>
                </div>
                <div>
                  <strong style={{ color: '#888' }}>Hours:</strong><br />
                  <span>Mon-Fri: 8AM - 5PM</span><br />
                  <span style={{ color: '#888' }}>Weekends by appointment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main >
  );
}
