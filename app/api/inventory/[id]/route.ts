import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getInventory, saveInventory, Vehicle } from '@/lib/inventory';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const inventory = await getInventory();

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
        await saveInventory(inventory);

        return NextResponse.json(updatedVehicle);
    } catch (error) {
        console.error('Error updating vehicle:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to update vehicle'
        }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { error } = await supabase
            .from('inventory')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to delete vehicle'
        }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const inventory = await getInventory();
        const vehicle = inventory.find(v => v.id.toString() === id);

        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        return NextResponse.json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to fetch vehicle'
        }, { status: 500 });
    }
}
