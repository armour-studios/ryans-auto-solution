import Link from 'next/link';

export const metadata = {
    title: 'Financing | Ryan\'s Auto Solution',
    description: 'Apply for financing at Ryan\'s Auto Solution in Bemidji, MN. All credit welcome.',
};

export default function FinancingPage() {
    return (
        <div style={{ padding: '0', color: '#fff', backgroundColor: '#050505', minHeight: '100vh' }}>
            {/* Hero Section */}
            <div style={{
                padding: '8rem 0 6rem 0',
                background: 'radial-gradient(circle at top right, rgba(15, 113, 177, 0.15), transparent 60%)',
                textAlign: 'center'
            }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <span className="cta-glow" style={{
                        color: 'var(--primary-color)',
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        display: 'inline-block',
                        marginBottom: '1.5rem'
                    }}>
                        Streamlined Approvals
                    </span>
                    <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 'bold', lineHeight: '1.1' }}>
                        Financing <span style={{ color: 'var(--primary-color)' }}>Simplified</span>
                    </h1>
                    <p style={{ fontSize: '1.4rem', color: '#888', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
                        We partner with trusted lenders to provide flexible financing options tailored to your lifestyle. Get approved and drive home today.
                    </p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1200px', paddingBottom: '8rem' }}>
                {/* Financing Tools Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2rem',
                    marginBottom: '8rem'
                }}>
                    {/* Apply For Financing */}
                    <a href="https://lotuspf.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass-card card-glow" style={{
                            padding: '3.5rem 2.5rem',
                            height: '100%',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: '1px solid rgba(15, 113, 177, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            backgroundColor: 'rgba(5, 5, 5, 0.6)',
                            backdropFilter: 'blur(12px)'
                        }}>
                            <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Apply Online</h2>
                            <p style={{ color: '#aaa', lineHeight: '1.7', marginBottom: '2.5rem', fontSize: '1rem' }}>
                                Start your application through our secure partner portal. Fast decisions and competitive rates for all credit types.
                            </p>
                            <span className="btn btn-primary cta-glow" style={{ marginTop: 'auto', padding: '0.9rem 2.5rem', borderRadius: '4px', width: '100%' }}>
                                Begin Application
                            </span>
                        </div>
                    </a>

                    {/* Value Your Trade */}
                    <a href="https://www.kbb.com/whats-my-car-worth/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass-card card-glow" style={{
                            padding: '3.5rem 2.5rem',
                            height: '100%',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: '1px solid rgba(15, 113, 177, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            backgroundColor: 'rgba(5, 5, 5, 0.6)',
                            backdropFilter: 'blur(12px)'
                        }}>
                            <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                </svg>
                            </div>
                            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Trade-In Value</h2>
                            <p style={{ color: '#aaa', lineHeight: '1.7', marginBottom: '2.5rem', fontSize: '1rem' }}>
                                Get a market valuation for your current vehicle. We offer premium trade-in credits toward your purchase.
                            </p>
                            <span className="btn btn-primary cta-glow" style={{ marginTop: 'auto', padding: '0.9rem 2.5rem', borderRadius: '4px', width: '100%' }}>
                                Get Value
                            </span>
                        </div>
                    </a>

                    {/* Payment Calculator */}
                    <Link href="/financing/calculator" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass-card card-glow" style={{
                            padding: '3.5rem 2.5rem',
                            height: '100%',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: '1px solid rgba(15, 113, 177, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            backgroundColor: 'rgba(5, 5, 5, 0.6)',
                            backdropFilter: 'blur(12px)'
                        }}>
                            <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
                                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                                    <line x1="8" y1="6" x2="16" y2="6"></line>
                                    <line x1="16" y1="14" x2="16" y2="18"></line>
                                    <line x1="8" y1="14" x2="8" y2="18"></line>
                                    <line x1="12" y1="14" x2="12" y2="18"></line>
                                    <line x1="16" y1="10" x2="16" y2="10"></line>
                                    <line x1="12" y1="10" x2="12" y2="10"></line>
                                    <line x1="8" y1="10" x2="8" y2="10"></line>
                                </svg>
                            </div>
                            <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Calculator</h2>
                            <p style={{ color: '#aaa', lineHeight: '1.7', marginBottom: '2.5rem', fontSize: '1rem' }}>
                                Estimate your monthly payments. Adjust your down payment and terms to find your perfect fit.
                            </p>
                            <span className="btn btn-primary cta-glow" style={{ marginTop: 'auto', padding: '0.9rem 2.5rem', borderRadius: '4px', width: '100%' }}>
                                Calculate Payments
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Why Finance With Us */}
                <div style={{
                    backgroundColor: 'rgba(10, 10, 10, 0.8)',
                    borderRadius: '24px',
                    padding: '6rem 4rem',
                    marginBottom: '8rem',
                    border: '1px solid #1a1a1a',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px' }}>
                        The <span style={{ color: 'var(--primary-color)' }}>Ryan&apos;s Advantage</span>
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '3rem',
                        justifyContent: 'center'
                    }}>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Local & Personal</h3>
                            <p style={{ color: '#777', lineHeight: '1.6', fontSize: '0.95rem' }}>Small-town service with big-market results.</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Rapid Approvals</h3>
                            <p style={{ color: '#777', lineHeight: '1.6', fontSize: '0.95rem' }}>Our efficient workflow means less waiting, more driving.</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Best Rates</h3>
                            <p style={{ color: '#777', lineHeight: '1.6', fontSize: '0.95rem' }}>Competitive interest options through multiple lenders.</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Trusted Team</h3>
                            <p style={{ color: '#777', lineHeight: '1.6', fontSize: '0.95rem' }}>Honest advice from professionals you can rely on.</p>
                        </div>
                    </div>
                </div>

                {/* Conversion Zone */}
                <div style={{
                    textAlign: 'center',
                    padding: '5rem 3rem',
                    borderRadius: '24px',
                    border: '1px solid rgba(15, 113, 177, 0.4)',
                    background: 'linear-gradient(135deg, rgba(15, 113, 177, 0.08), transparent)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(15, 113, 177, 0.05) 0%, transparent 60%)',
                        zIndex: 0
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '2.8rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Still Have Questions?</h2>
                        <p style={{ color: '#888', marginBottom: '3rem', fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
                            Our financing specialists are standing by to guide you through the process and find the best fit for your budget.
                        </p>
                        <a href="tel:2184690183" className="btn btn-primary cta-glow" style={{
                            fontSize: '1.1rem',
                            padding: '1.2rem 3.5rem',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '1rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            Call (218) 469-0183
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
