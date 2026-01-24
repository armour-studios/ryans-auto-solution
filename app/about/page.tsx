import Image from 'next/image';

export const metadata = {
    title: 'About Us | Ryan\'s Auto Solution',
    description: 'Ryan\'s Auto Solution is an independent marketplace offering quality dependable used vehicles in Bemidji, MN.',
};

export default function AboutPage() {
    return (
        <div style={{ padding: '4rem 0', color: '#fff', minHeight: '80vh' }}>
            <div className="container">
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textTransform: 'uppercase', color: 'var(--primary-color)' }}>About Us</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                    {/* Main Content */}
                    <div>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#ccc' }}>
                            Ryan&apos;s Auto Solution is an independent marketplace that offers quality dependable used vehicles. We strive for true customer service when it comes to finding your next vehicle.
                        </p>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem', color: '#ccc' }}>
                            Our inventory is carefully selected which focuses on used cars, trucks and SUVS. We strive for true customer service when it comes to finding your next vehicle.
                        </p>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '2rem', color: '#ccc' }}>
                            Vehicles in our inventory can be located at <strong>King of The Road Trailers</strong> in Bemidji. Feel free to stop in and take a test drive with any of our quality used vehicles.
                        </p>

                        <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#222', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Business Hours</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #444', paddingBottom: '0.5rem' }}>
                                <span>Monday - Friday</span>
                                <span style={{ fontWeight: 'bold' }}>08:00 - 17:00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                                <span>After Hours & Weekends</span>
                                <span>By Appointment</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Location Info */}
                    <div>
                        <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#333', borderRadius: '8px', marginBottom: '2rem', overflow: 'hidden' }}>
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

                        <div style={{ backgroundColor: '#222', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
                            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Location</h3>
                            <address style={{ fontStyle: 'normal', lineHeight: '1.6', fontSize: '1.1rem' }}>
                                <strong>Ryan&apos;s Auto Solution</strong><br />
                                325 Oak Hills Rd SE<br />
                                Bemidji, MN 56601
                            </address>

                            <div style={{ marginTop: '1.5rem' }}>
                                <a href="tel:2184690183" className="btn btn-accent" style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                    Call (218) 469-0183
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
