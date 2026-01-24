import { getVehicleById, getInventory } from '@/lib/inventory';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import VehicleCard from '@/components/VehicleCard';

export async function generateStaticParams() {
    const inventory = getInventory();
    return inventory.map((vehicle) => ({
        id: vehicle.id.toString(),
    }));
}

export default async function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const vehicle = getVehicleById(parseInt(id));

    if (!vehicle) {
        notFound();
    }

    // specific type explicit cast for filtering
    const allInventory = getInventory();
    const relatedVehicles = allInventory
        .filter(v => v.type === vehicle.type && v.id !== vehicle.id)
        .slice(0, 3);

    return (
        <div style={{ padding: '2rem 0', color: '#fff' }}>
            <div className="container">
                {/* Breadcrumbs */}
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: '#888' }}>
                    <Link href="/" className='hover:text-primary'>Home</Link>
                    <span>/</span>
                    <Link href="/inventory" className='hover:text-primary'>Inventory</Link>
                    <span>/</span>
                    <span style={{ color: 'var(--primary-color)' }}>{vehicle.type}</span>
                    <span>/</span>
                    <span style={{ color: '#fff' }}>{vehicle.year} {vehicle.make}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'start' }} className="details-grid">
                    {/* Main Content (Left) */}
                    <div>
                        {/* Main Image */}
                        <div style={{ position: 'relative', height: '500px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid #333' }}>
                            <Image
                                src={vehicle.image}
                                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                            {vehicle.status !== 'Available' && (
                                <div style={{
                                    position: 'absolute', top: '20px', left: '20px',
                                    backgroundColor: vehicle.status === 'Sold' ? '#c92a37' : '#ffa500',
                                    color: '#fff', padding: '0.5rem 1rem', fontWeight: 'bold', textTransform: 'uppercase',
                                    borderRadius: '4px'
                                }}>
                                    {vehicle.status}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                            {vehicle.images && vehicle.images.map((img, idx) => (
                                <div key={idx} style={{
                                    position: 'relative', width: '120px', height: '80px', flexShrink: 0,
                                    borderRadius: '4px', overflow: 'hidden', cursor: 'pointer',
                                    border: vehicle.image === img ? '2px solid var(--primary-color)' : '1px solid #333'
                                }}>
                                    <Image src={img} alt="Thumbnail" fill style={{ objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>

                        {/* Video Section */}
                        {(vehicle.video || vehicle.youtubeUrl) && (
                            <div style={{ marginTop: '3rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem', color: '#fff' }}>Video Walkthrough</h3>
                                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
                                    {vehicle.youtubeUrl ? (
                                        <iframe
                                            src={vehicle.youtubeUrl.replace('watch?v=', 'embed/')}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <video
                                            src={vehicle.video}
                                            controls
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Description & Features */}
                        <div style={{ marginTop: '3rem', display: 'grid', gap: '3rem' }}>
                            <section>
                                <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', paddingBottom: '0.25rem' }}>Vehicle Description</h3>
                                <p style={{ lineHeight: '1.8', color: '#ccc', fontSize: '1.05rem' }}>{vehicle.description}</p>
                            </section>

                            <section>
                                <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', paddingBottom: '0.25rem' }}>Key Features</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {vehicle.features && vehicle.features.map(feature => (
                                        <div key={feature} style={{
                                            backgroundColor: '#222', padding: '0.75rem', borderRadius: '4px',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #333'
                                        }}>
                                            <span style={{ color: 'var(--primary-color)' }}>✓</span>
                                            <span style={{ fontSize: '0.9rem' }}>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Sidebar (Right) - Sticky */}
                    <div style={{
                        backgroundColor: 'var(--card-bg)', padding: '2rem', borderRadius: '4px',
                        position: 'sticky', top: '100px', border: '1px solid #333', color: 'var(--text-color)'
                    }}>
                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #444', paddingBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textTransform: 'uppercase', lineHeight: '1.2' }}>
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </h1>
                            <p style={{ fontSize: '0.9rem', color: '#888' }}>Stock #: {vehicle.id}</p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                ${vehicle.price.toLocaleString()}
                            </span>
                        </div>

                        <div style={{ marginBottom: '2rem', backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #333' }}>
                                <span style={{ color: '#888' }}>Mileage</span>
                                <strong>{vehicle.mileage.toLocaleString()} mi</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #333' }}>
                                <span style={{ color: '#888' }}>Status</span>
                                <strong style={{ color: vehicle.status === 'Available' ? 'var(--primary-color)' : '#c92a37' }}>{vehicle.status}</strong>
                            </div>
                            {vehicle.vin && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #333' }}>
                                    <span style={{ color: '#888' }}>VIN</span>
                                    <strong style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{vehicle.vin}</strong>
                                </div>
                            )}
                            {Object.entries(vehicle.specs || {}).map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #333' }}>
                                    <span style={{ color: '#888' }}>{key}</span>
                                    <strong>{value}</strong>
                                </div>
                            ))}
                        </div>

                        <Link href="/contact" className="btn" style={{ width: '100%', display: 'block', textAlign: 'center', fontSize: '1.1rem', padding: '1rem' }}>
                            CONTACT DEALER
                        </Link>
                        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
                            * Price excludes tax, title, and license.
                        </p>
                    </div>
                </div>

                {/* Related Inventory Section */}
                {relatedVehicles.length > 0 && (
                    <div style={{ marginTop: '6rem', borderTop: '1px solid #333', paddingTop: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '2rem', color: '#fff' }}>Similar {vehicle.type}s</h2>
                            <Link href="/inventory" className="btn btn-accent" style={{ fontSize: '0.9rem' }}>
                                VIEW ALL
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {relatedVehicles.map(v => (
                                <VehicleCard key={v.id} vehicle={v as any} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
