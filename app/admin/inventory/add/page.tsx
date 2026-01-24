import AdminVehicleForm from '@/components/AdminVehicleForm';
import Link from 'next/link';

export const metadata = {
    title: 'Add New Vehicle',
};

export default function AddVehiclePage() {
    return (
        <div style={{ padding: '4rem 0' }}>
            <div className="container">
                <Link href="/admin/inventory" style={{ display: 'inline-block', marginBottom: '2rem', color: '#888' }}>&larr; Back to Inventory</Link>
                <AdminVehicleForm />
            </div>
        </div>
    );
}
