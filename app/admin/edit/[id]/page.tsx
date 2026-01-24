import AdminVehicleForm from '@/components/AdminVehicleForm';
import { getVehicleById } from '@/lib/inventory';
import { notFound } from 'next/navigation';

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const vehicle = getVehicleById(parseInt(id));

    if (!vehicle) {
        notFound();
    }

    return (
        <div style={{ padding: '4rem 0', backgroundColor: '#f4f4f9' }}>
            <div className="container">
                <AdminVehicleForm initialData={vehicle} />
            </div>
        </div>
    );
}
