import Link from "next/link";
import Image from "next/image";

type Vehicle = {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    image: string;
    description: string;
    status: string;
    type: string;
    trending?: boolean;
};

export default function VehicleCard({ vehicle, estPayment }: { vehicle: Vehicle; estPayment?: number }) {
    const isSold = vehicle.status === 'Sold';

    return (
        <div style={{
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-color)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px var(--card-shadow)',
            border: '1px solid var(--card-border)',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            opacity: isSold ? 0.75 : 1
        }}
            className="vehicle-card card-glow"
        >
            <div style={{ position: 'relative', height: '300px' }}>
                <Image
                    src={vehicle.image || '/assets/img3.png'}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    fill
                    style={{ objectFit: 'cover', filter: isSold ? 'grayscale(100%)' : 'none' }}
                />
                {/* Badges - Top Left */}
                <div style={{ position: 'absolute', top: '10px', left: '0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {vehicle.status !== 'Available' && (
                        <span style={{
                            backgroundColor: isSold ? '#c92a37' : '#ffa500',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            fontSize: '0.8rem',
                            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)'
                        }}>
                            {vehicle.status}
                        </span>
                    )}
                    {vehicle.trending && (
                        <span style={{
                            backgroundColor: 'var(--primary-color)',
                            color: '#fff',
                            padding: '0.25rem 0.75rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            fontSize: '0.8rem',
                            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)'
                        }}>
                            Featured
                        </span>
                    )}
                </div>
            </div>
            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', borderTop: '4px solid var(--primary-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    Stock #: {vehicle.id}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--heading-color)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: isSold ? '#c92a37' : 'var(--primary-color)' }}>
                            {isSold ? 'SOLD' : `$${vehicle.price.toLocaleString()}`}
                        </span>
                    </div>

                    {/* Estimated Monthly Payment */}
                    {!isSold && estPayment && estPayment > 0 && (
                        <div className="est-payment-line">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                            <span>Est. ${estPayment}/mo</span>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <Link href={`/inventory/${vehicle.id}`} className="btn" style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}>
                            DETAILS
                        </Link>
                        <Link href={`/contact`} className="btn btn-contact" style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}>
                            CONTACT
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
