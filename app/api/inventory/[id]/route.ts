import { NextResponse } from 'next/server';
import { getInventory, saveInventory, Vehicle } from '@/lib/inventory';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const inventory = getInventory();

    const index = inventory.findIndex(v => v.id.toString() === id);
    if (index === -1) {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const updatedVehicle = {
        ...inventory[index],
        ...body,
        id: inventory[index].id // Ensure ID doesn't change
    };

    inventory[index] = updatedVehicle;
    saveInventory(inventory);

    return NextResponse.json(updatedVehicle);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let inventory = getInventory();

    const initialLength = inventory.length;
    inventory = inventory.filter(v => v.id.toString() !== id);

    if (inventory.length === initialLength) {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    saveInventory(inventory);
    return NextResponse.json({ success: true });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const inventory = getInventory();
    const vehicle = inventory.find(v => v.id.toString() === id);

    if (!vehicle) {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json(vehicle);
}
