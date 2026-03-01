import { getVehicleById, getInventory } from '@/lib/inventory';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import VehicleCard from '@/components/VehicleCard';
import { getYouTubeEmbedUrl } from '@/lib/youtubeUtils';
import ImageGallery from '@/components/ImageGallery';

const BASE_URL = 'https://ryansautosolution.com';

export async function generateStaticParams() {
    const inventory = await getInventory();
    return inventory.map((vehicle) => ({
        id: vehicle.id.toString(),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const vehicle = await getVehicleById(parseInt(id));
    if (!vehicle) return {};

    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} for Sale in Bemidji, MN`;
    const description = vehicle.description
        ? vehicle.description.slice(0, 155)
        : `${vehicle.year} ${vehicle.make} ${vehicle.model} — ${vehicle.mileage.toLocaleString()} miles — $${vehicle.price.toLocaleString()}. Available at Ryan's Auto Solution in Bemidji, Minnesota.`;
    const imageUrl = vehicle.image?.startsWith('http') ? vehicle.image : `${BASE_URL}${vehicle.image}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${BASE_URL}/inventory/${vehicle.id}`,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `${BASE_URL}/inventory/${vehicle.id}`,
        },
    };
}

export default async function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const vehicle = await getVehicleById(parseInt(id));

    if (!vehicle) {
        notFound();
    }

    // JSON-LD structured data for Google (Car schema)
    const imageUrl = vehicle.image?.startsWith('http') ? vehicle.image : `${BASE_URL}${vehicle.image}`;
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Car',
        name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        description: vehicle.description,
        brand: { '@type': 'Brand', name: vehicle.make },
        model: vehicle.model,
        modelDate: vehicle.year.toString(),
        vehicleIdentificationNumber: vehicle.vin ?? undefined,
        mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: vehicle.mileage,
            unitCode: 'SMI',
        },
        image: imageUrl,
        url: `${BASE_URL}/inventory/${vehicle.id}`,
        offers: {
            '@type': 'Offer',
            price: vehicle.price,
            priceCurrency: 'USD',
            availability: vehicle.status === 'Available'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/SoldOut',
            seller: {
                '@type': 'AutoDealer',
                name: "Ryan's Auto Solution",
                url: BASE_URL,
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Bemidji',
                    addressRegion: 'MN',
                    addressCountry: 'US',
                },
            },
        },
    };

    // specific type explicit cast for filtering
    const allInventory = await getInventory();
    const relatedVehicles = allInventory
        .filter(v => v.type === vehicle.type && v.id !== vehicle.id)
        .slice(0, 3);

    return (
        <div style={{ padding: '2rem 0', color: 'var(--text-color)' }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container">
                {/* Breadcrumbs */}
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <Link href="/" className='hover:text-primary'>Home</Link>
                    <span>/</span>
                    <Link href="/inventory" className='hover:text-primary'>Inventory</Link>
                    <span>/</span>
                    <span style={{ color: 'var(--primary-color)' }}>{vehicle.type}</span>
                    <span>/</span>
                    <span style={{ color: 'var(--text-color)' }}>{vehicle.year} {vehicle.make}</span>
                </div>

                {/* DESKTOP LAYOUT (Preserves original aesthetics exactly) */}
                <div className="desktop-only" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'start' }}>
                    {/* Main Content (Left) */}
                    <div>
                        <ImageGallery
                            images={vehicle.images}
                            mainImage={vehicle.image}
                            vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        />

                        {/* Video Section */}
                        {(vehicle.video || vehicle.youtubeUrl) && (
                            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Video Walkthrough</h3>
                                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                    {vehicle.youtubeUrl ? (
                                        <iframe
                                            src={getYouTubeEmbedUrl(vehicle.youtubeUrl) || ''}
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
                                <p style={{ lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '1.05rem' }}>{vehicle.description}</p>
                            </section>

                            <section>
                                <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--primary-color)', display: 'inline-block', paddingBottom: '0.25rem' }}>Key Features</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {vehicle.features && vehicle.features.map(feature => (
                                        <div key={feature} className="detail-feature-chip" style={{
                                            backgroundColor: 'var(--card-bg)', padding: '0.75rem', borderRadius: '4px',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-color)'
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
                        position: 'sticky', top: '100px', border: '1px solid var(--card-border)', color: 'var(--text-color)'
                    }}>
                        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', textTransform: 'uppercase', lineHeight: '1.2' }}>
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </h1>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Stock #: {vehicle.id}</p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            {vehicle.status === 'Sold' ? (
                                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#e53e3e', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    Sold
                                </span>
                            ) : (
                                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    ${vehicle.price.toLocaleString()}
                                </span>
                            )}
                        </div>

                        <div className="detail-specs-table" style={{ marginBottom: '2rem', backgroundColor: 'var(--subtle-bg)', padding: '1rem', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Mileage</span>
                                <strong>{vehicle.mileage.toLocaleString()} mi</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                                <strong style={{ color: vehicle.status === 'Available' ? 'var(--primary-color)' : '#c92a37' }}>{vehicle.status}</strong>
                            </div>
                            {vehicle.vin && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>VIN</span>
                                    <strong style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{vehicle.vin}</strong>
                                </div>
                            )}
                            {Object.entries(vehicle.specs || {}).map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{key}</span>
                                    <strong>{value}</strong>
                                </div>
                            ))}
                        </div>

                        <Link href="/contact" className="btn" style={{ width: '100%', display: 'block', textAlign: 'center', fontSize: '1.1rem', padding: '1rem' }}>
                            CONTACT DEALER
                        </Link>
                        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            * Price excludes tax, title, and license.
                        </p>
                    </div>
                </div>

                {/* MOBILE LAYOUT (Optimized for small screens) */}
                <div className="mobile-only">
                    <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', lineHeight: '1.2' }}>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </h1>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {vehicle.status === 'Sold' ? (
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e53e3e', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    Sold
                                </span>
                            ) : (
                                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    ${vehicle.price.toLocaleString()}
                                </span>
                            )}
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stock: {vehicle.id}</span>
                        </div>
                    </div>

                    <ImageGallery
                        images={vehicle.images}
                        mainImage={vehicle.image}
                        vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    />

                    <div style={{ marginTop: '2rem', display: 'grid', gap: '2rem' }}>
                        {/* Quick Specs for Mobile */}
                        <div className="detail-specs-table" style={{ backgroundColor: 'var(--subtle-bg)', padding: '1.25rem', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Mileage</span>
                                <strong>{vehicle.mileage.toLocaleString()} mi</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                                <strong style={{ color: vehicle.status === 'Available' ? 'var(--primary-color)' : '#c92a37' }}>{vehicle.status}</strong>
                            </div>
                        </div>

                        <Link href="/contact" className="btn" style={{ width: '100%', padding: '1.25rem' }}>
                            CONTACT DEALER
                        </Link>

                        {/* Video for Mobile */}
                        {(vehicle.video || vehicle.youtubeUrl) && (
                            <section>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Video Walkthrough</h3>
                                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                                    {vehicle.youtubeUrl ? (
                                        <iframe
                                            src={getYouTubeEmbedUrl(vehicle.youtubeUrl) || ''}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                            frameBorder="0"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <video src={vehicle.video} controls style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Full Specs, Description, etc. */}
                        <section>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--primary-color)', display: 'inline-block' }}>Description</h3>
                            <p style={{ lineHeight: '1.6', color: 'var(--text-muted)' }}>{vehicle.description}</p>
                        </section>

                        <section>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid var(--primary-color)', display: 'inline-block' }}>Key Features</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {vehicle.features?.map(feature => (
                                    <div key={feature} className="detail-feature-chip" style={{ backgroundColor: 'var(--card-bg)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                                        ✓ {feature}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Related Inventory Section */}
                {relatedVehicles.length > 0 && (
                    <div style={{ marginTop: '6rem', borderTop: '2px solid var(--section-divider)', paddingTop: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: '600' }}>More From Our Lot</p>
                                <h2 style={{ fontSize: '2rem', lineHeight: '1.2' }}>You May Also Like</h2>
                            </div>
                            <Link href="/inventory" style={{
                                fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                                color: 'var(--text-color)', padding: '0.75rem 1.75rem', border: '1px solid var(--border-color)',
                                borderRadius: '4px', textDecoration: 'none', transition: 'all 0.2s ease',
                                fontWeight: '500'
                            }}>
                                Browse All Inventory →
                            </Link>
                        </div>
                        <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
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
