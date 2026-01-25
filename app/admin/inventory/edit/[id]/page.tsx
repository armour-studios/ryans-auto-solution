import AdminVehicleForm from '@/components/AdminVehicleForm';
import { getVehicleById } from '@/lib/inventory';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
    title: 'Edit Vehicle',
};

export const dynamic = 'force-dynamic';

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const vehicle = await getVehicleById(parseInt(id));

    if (!vehicle) {
        notFound();
    }

    return (
        <div style={{ padding: '4rem 0' }}>
            <div className="container">
                <Link href="/admin/inventory" style={{ display: 'inline-block', marginBottom: '2rem', color: '#888' }}>&larr; Back to Inventory</Link>
                <AdminVehicleForm initialData={vehicle} />
            </div>
        </div>
    );
}
