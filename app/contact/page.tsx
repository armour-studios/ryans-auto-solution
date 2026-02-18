export const metadata = {
    title: 'Contact & About Us | Ryan\'s Auto Solution',
};

export default function ContactPage() {
    return (
        <div style={{ padding: '4rem 0', color: '#fff', backgroundColor: '#050505', minHeight: '100vh' }}>
            {/* Hero Section */}
            <div className="container" style={{ maxWidth: '1100px', marginBottom: '6rem', textAlign: 'center' }}>
                <span className="cta-glow" style={{
                    color: 'var(--primary-color)',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    display: 'inline-block',
                    marginBottom: '1rem'
                }}>
                    Established & Trusted
                </span>
                <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Quality Used Cars <span style={{ color: 'var(--primary-color)' }}>With Trust</span>
                </h1>
                <p style={{ fontSize: '1.4rem', color: '#ccc', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                    Ryan&apos;s Auto Solution is an independent marketplace offering dependable vehicles and true small-town customer service in Bemidji, MN.
                </p>
            </div>

            {/* About & Mission Section */}
            <div className="container" style={{ maxWidth: '1100px', marginBottom: '8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center' }}>
                    <div className="glass-card card-glow" style={{ padding: '3.5rem', border: '1px solid rgba(15, 113, 177, 0.2)' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Our <span style={{ color: 'var(--primary-color)' }}>Mission</span>
                        </h2>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#eee' }}>
                            We strive for excellence when it comes to finding your next vehicle. Our inventory is carefully hand-selected, focusing on used cars, trucks, and SUVs that meet our high standards for reliability.
                        </p>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#eee' }}>
                            Located at <strong>King of The Road Trailers</strong> in Bemidji, we invite you to stop in and experience the difference of a dealership that knows what works for Northern Minnesota drivers.
                        </p>
                    </div>
                    <div style={{ position: 'relative', height: '400px', overflow: 'hidden', borderRadius: '20px', border: '1px solid #333' }}>
                        <iframe
                            title="Ryan's Auto Solution Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2666.678229654764!2d-94.85244592351853!3d47.46820577117769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b82d0263300000%3A0x1d36800000000000!2s325%20Oak%20Hills%20Rd%20SE%2C%20Bemidji%2C%20MN%2056601!5e0!3m2!1sen!2sus!4v1705726000000!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Contact Info & CTA */}
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Get In <span style={{ color: 'var(--primary-color)' }}>Touch</span></h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {/* Call Card */}
                    <div className="glass-card card-glow" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                        </div>
                        <h3 style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Call Us</h3>
                        <a href="tel:2184690183" style={{ fontSize: '1.8rem', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
                            (218) 469-0183
                        </a>
                    </div>

                    {/* Address Card */}
                    <div className="glass-card card-glow" style={{ padding: '3rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <h3 style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Location</h3>
                        <p style={{ fontSize: '1.2rem', color: '#ccc', lineHeight: '1.6' }}>
                            325 Oak Hills Rd SE<br />
                            Bemidji, MN 56601
                        </p>
                    </div>

                    {/* Hours Card */}
                    <div className="glass-card card-glow" style={{ padding: '3rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <h3 style={{ textTransform: 'uppercase', marginBottom: '1.5rem' }}>Business Hours</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                                <span style={{ color: '#888' }}>Mon - Fri</span>
                                <span style={{ fontWeight: 'bold' }}>8:00 AM - 5:00 PM</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#888' }}>Sat - Sun</span>
                                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>By Appointment</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Directions CTA */}
                <div style={{ marginTop: '5rem', textAlign: 'center' }}>
                    <a href="https://maps.app.goo.gl/sfenz9gjqzi62AtK9" target="_blank" rel="noopener noreferrer" className="btn btn-primary cta-glow" style={{
                        padding: '1.5rem 4rem',
                        fontSize: '1.2rem',
                        borderRadius: '50px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        Get Directions Online
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
