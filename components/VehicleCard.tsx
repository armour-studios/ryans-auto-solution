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
    status: string; // Changed from union literal to string
    type: string; // Kept as string
    trending?: boolean; // Added for the new "Featured" badge
};

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
    const isSold = vehicle.status === 'Sold';

    return (
        <div style={{
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-color)',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)', /* Darker shadow */
            border: '1px solid #333',
            transition: 'transform 0.2s',
            display: 'flex',
            flexDirection: 'column',
            opacity: isSold ? 0.8 : 1
        }}
            className="vehicle-card"
        >
            <div style={{ position: 'relative', height: '220px' }}>
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
                            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' // Angled badge
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
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--primary-color)' }}>
                            ${vehicle.price.toLocaleString()}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <Link href={`/inventory/${vehicle.id}`} className="btn" style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}>
                            DETAILS
                        </Link>
                        <Link href={`/contact`} className="btn" style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem', backgroundColor: '#333', color: '#fff' }}>
                            CONTACT
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
