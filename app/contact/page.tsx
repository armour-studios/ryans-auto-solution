export const metadata = {
    title: 'Contact Us | Ryan\'s Auto Solution',
};

export default function ContactPage() {
    return (
        <div style={{ padding: '6rem 0', color: '#fff', backgroundColor: '#050505' }}>
            <div className="container" style={{ maxWidth: '1000px', textAlign: 'center' }}>
                <span style={{
                    color: 'var(--primary-color)',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    display: 'inline-block',
                    marginBottom: '1rem'
                }}>
                    Get In Touch
                </span>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                    Ready to <span style={{ color: 'var(--primary-color)' }}>Connect?</span>
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#aaa', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
                    Have questions about our inventory or want to schedule a test drive?
                    The fastest way to reach us is by phone.
                </p>

                {/* Primary CTA */}
                <div style={{ marginBottom: '5rem' }}>
                    <a href="tel:2184690183" className="btn" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '1.8rem',
                        padding: '1.5rem 3rem',
                        background: 'linear-gradient(135deg, var(--primary-color), #0056b3)',
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(0, 123, 255, 0.3)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <span style={{ fontSize: '2.4rem' }}>📞</span>
                        <div>
                            <span style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '1px' }}>Call Now</span>
                            <span>(218) 469-0183</span>
                        </div>
                    </a>
                </div>

                {/* Secondary Info Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem',
                    textAlign: 'left'
                }}>
                    {/* Location */}
                    <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📍</div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-color)' }}>Location</h3>
                        <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                            325 Oak Hills Rd SE<br />
                            Bemidji, MN 56601
                        </p>
                        <a href="https://maps.google.com/?q=325+Oak+Hills+Rd+SE+Bemidji+MN+56601" target="_blank" rel="noopener noreferrer" style={{
                            color: '#fff',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            marginTop: '1rem',
                            display: 'inline-block',
                            borderBottom: '1px solid var(--primary-color)'
                        }}>
                            Get Directions →
                        </a>
                    </div>

                    {/* Email */}
                    <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>✉️</div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-color)' }}>Email</h3>
                        <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                            Prefer traditional messaging?<br />
                            Drop us an inquiry via email.
                        </p>
                        <a href="mailto:ryan@ryansautosolution.com" style={{
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            marginTop: '1rem',
                            display: 'inline-block',
                            color: 'var(--primary-color)'
                        }}>
                            ryan@ryansautosolution.com
                        </a>
                    </div>

                    {/* Hours */}
                    <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '12px', border: '1px solid #222', gridColumn: 'span 1' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🕒</div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--primary-color)' }}>Business Hours</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#888' }}>Mon - Fri</span>
                                <span style={{ fontWeight: 'bold' }}>8:00 AM - 5:00 PM</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#888' }}>Sat - Sun</span>
                                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Appointment Only</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ marginTop: '6rem', borderTop: '1px solid #222', paddingTop: '3rem', color: '#555', fontSize: '0.9rem' }}>
                    <p>© {new Date().getFullYear()} Ryan's Auto Solution. Serving Northern Minnesota with quality inventory.</p>
                </div>
            </div>
        </div>
    );
}
