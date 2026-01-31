import Link from 'next/link';

export const metadata = {
    title: 'Financing | Ryan\'s Auto Solution',
    description: 'Apply for financing at Ryan\'s Auto Solution in Bemidji, MN. All credit welcome.',
};

export default function FinancingPage() {
    return (
        <div style={{ padding: '4rem 0', color: '#fff', minHeight: '80vh' }}>
            <div className="container">
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
                        <span style={{ color: 'var(--primary-color)' }}>Financing</span> Made Easy
                    </h1>
                    <p style={{ fontSize: '1.3rem', color: '#888', maxWidth: '700px', margin: '0 auto' }}>
                        We work with lenders to help find financing options for you.
                        Get behind the wheel faster with Ryan&apos;s Auto Solution.
                    </p>
                </div>

                {/* Financing Tools Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '5rem' }}>
                    {/* Apply For Financing - Link to Lotus PF */}
                    <a href="https://lotuspf.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(0,123,255,0.15) 0%, rgba(0,123,255,0.05) 100%)',
                            border: '1px solid rgba(0,123,255,0.3)',
                            borderRadius: '16px',
                            padding: '2.5rem',
                            height: '100%',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, var(--primary-color), #00d4ff)'
                            }} />
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📝</div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Apply For Financing</h2>
                            <p style={{ color: '#999', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                Apply online through our financing partner. Quick approval process with competitive rates for all credit situations.
                            </p>
                            <span style={{
                                color: 'var(--primary-color)',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontSize: '0.9rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                Apply Now →
                            </span>
                        </div>
                    </a>

                    {/* Value Your Trade - Kelly Blue Book */}
                    <a href="https://www.kbb.com/whats-my-car-worth/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)',
                            border: '1px solid rgba(16,185,129,0.3)',
                            borderRadius: '16px',
                            padding: '2.5rem',
                            height: '100%',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #10b981, #34d399)'
                            }} />
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>💰</div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#10b981' }}>Value Your Trade</h2>
                            <p style={{ color: '#999', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                Get an instant estimate on your current vehicle. We offer competitive trade-in values to lower your purchase price.
                            </p>
                            <span style={{
                                color: '#10b981',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontSize: '0.9rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                Get Trade Value →
                            </span>
                        </div>
                    </a>

                    {/* Payment Calculator */}
                    <Link href="/financing/calculator" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)',
                            border: '1px solid rgba(245,158,11,0.3)',
                            borderRadius: '16px',
                            padding: '2.5rem',
                            height: '100%',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                            }} />
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🧮</div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f59e0b' }}>Payment Calculator</h2>
                            <p style={{ color: '#999', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                Estimate your monthly payment before you apply. Adjust price, down payment, and terms to find your budget.
                            </p>
                            <span style={{
                                color: '#f59e0b',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontSize: '0.9rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                Calculate Payment →
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Why Finance With Us */}
                <div style={{
                    background: 'linear-gradient(135deg, #0a1628 0%, #111 100%)',
                    borderRadius: '16px',
                    padding: '4rem',
                    marginBottom: '4rem'
                }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', textTransform: 'uppercase' }}>
                        Why Finance With <span style={{ color: 'var(--primary-color)' }}>Us</span>
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏠</div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Local & Personal</h3>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>Work with real people who care about your needs</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Quick Process</h3>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>We work to get you answers quickly</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💵</div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Competitive Rates</h3>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>We shop multiple lenders for the best rate</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤝</div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Personal Service</h3>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>Work directly with our local team</p>
                        </div>
                    </div>
                </div>

                {/* Quick Contact */}
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    backgroundColor: '#111',
                    borderRadius: '16px',
                    border: '1px solid #333'
                }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Have Questions?</h2>
                    <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.1rem' }}>
                        Call us directly and we&apos;ll help you find the right financing option for your situation.
                    </p>
                    <a href="tel:2184690183" className="btn btn-accent" style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}>
                        📞 Call (218) 469-0183
                    </a>
                </div>
            </div>
        </div>
    );
}
