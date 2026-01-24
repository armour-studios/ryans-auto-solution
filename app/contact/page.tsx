export const metadata = {
    title: 'Contact Us | Ryan\'s Auto Solution',
};

export default function ContactPage() {
    return (
        <div style={{ padding: '4rem 0' }}>
            <div className="container">
                <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Contact Us</h1>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                    <div>
                        <h2 style={{ marginBottom: '1.5rem' }}>Get In Touch</h2>
                        <p style={{ marginBottom: '2rem' }}>
                            Have questions about a vehicle? Want to schedule a test drive?
                            Give us a call or visit our dealership. We look forward to serving you!
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📍 Location</h3>
                                <p>325 Oak Hills Rd SE<br />Bemidji, MN 56601</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📞 Phone</h3>
                                <p><a href="tel:2184690183" style={{ color: 'var(--primary-color)' }}>(218) 469-0183</a></p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>✉️ Email</h3>
                                <p><a href="mailto:ryan@ryansautosolution.com" style={{ color: 'var(--primary-color)' }}>ryan@ryansautosolution.com</a></p>
                            </div>
                        </div>

                        <div style={{ marginTop: '3rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🕒 Business Hours</h3>
                            <table style={{ width: '100%', maxWidth: '300px' }}>
                                <tbody>
                                    <tr><td style={{ padding: '0.25rem 0' }}>Monday - Friday</td><td style={{ fontWeight: 'bold' }}>9:00 AM - 6:00 PM</td></tr>
                                    <tr><td style={{ padding: '0.25rem 0' }}>Saturday</td><td style={{ fontWeight: 'bold' }}>10:00 AM - 4:00 PM</td></tr>
                                    <tr><td style={{ padding: '0.25rem 0' }}>Sunday</td><td style={{ fontWeight: 'bold' }}>Closed</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Send Us a Message</h2>
                        <form>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                                <input type="text" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="Your Name" />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                                <input type="email" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }} placeholder="Your Email" />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
                                <textarea style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '150px' }} placeholder="I'm interested in the 2013 Dodge Ram..."></textarea>
                            </div>
                            <button type="submit" className="btn" style={{ width: '100%' }}>SEND MESSAGE</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
