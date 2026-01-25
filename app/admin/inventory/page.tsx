import { getInventory } from '@/lib/inventory';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';

export const metadata = {
    title: 'Inventory Management',
};

export const dynamic = 'force-dynamic'; // Always fetch fresh data

export default async function InventoryAdminPage() {
    const inventory = await getInventory();

    return (
        <div style={{ padding: '4rem 0' }}>
            <div className="container">
                <Link href="/admin" style={{ display: 'inline-block', marginBottom: '2rem', color: '#888' }}>&larr; Back to Dashboard</Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem' }}>Inventory Management</h1>
                    <Link href="/admin/inventory/add" className="btn btn-accent">
                        + ADD NEW VEHICLE
                    </Link>
                </div>

                <div style={{ backgroundColor: '#222', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #333' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                        <thead style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>Vehicle</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>Price</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'right', color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(vehicle => (
                                <tr key={vehicle.id} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '1rem', color: '#666' }}>{vehicle.id}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{vehicle.year} {vehicle.make} {vehicle.model}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>{vehicle.mileage.toLocaleString()} miles</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>${vehicle.price.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold',
                                            backgroundColor: vehicle.status === 'Sold' ? 'rgba(201, 42, 55, 0.2)' : 'rgba(40, 167, 69, 0.2)',
                                            color: vehicle.status === 'Sold' ? '#ff6b6b' : '#4cd137'
                                        }}>
                                            {vehicle.status || 'Available'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <Link href={`/admin/inventory/edit/${vehicle.id}`} className="btn" style={{ marginRight: '0.5rem', padding: '0.25rem 0.75rem', fontSize: '0.8rem', backgroundColor: '#333' }}>Edit</Link>
                                        <DeleteButton id={vehicle.id} endpoint="/api/inventory" />
                                    </td>
                                </tr>
                            ))}
                            {inventory.length === 0 && (
                                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>No inventory found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
