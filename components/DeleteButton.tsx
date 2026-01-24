"use client";

import { useRouter } from 'next/navigation';

export default function DeleteButton({ id, endpoint = '/api/inventory' }: { id: number; endpoint?: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const res = await fetch(`${endpoint}/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            alert('Error deleting');
        }
    };

    return (
        <button onClick={handleDelete} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
            Delete
        </button>
    );
}
