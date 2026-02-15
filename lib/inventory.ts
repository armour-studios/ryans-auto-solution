import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export type Vehicle = {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    status: 'Available' | 'Sold' | 'Pending';
    type: string;
    image: string;
    images: string[];
    video?: string;
    youtubeUrl?: string;
    vin?: string;
    trending?: boolean;
    description: string;
    specs: Record<string, string>;
    features: string[];
    created_at?: string;
};

const dataFilePath = path.join(process.cwd(), 'data/inventory.json');

// Local filesystem functions (fallback/dev)
function getInventoryLocal(): Vehicle[] {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    try {
        const jsonData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("Error reading inventory data:", error);
        return [];
    }
}

function saveInventoryLocal(inventory: Vehicle[]) {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(inventory, null, 2));
}

// Supabase functions
async function getInventorySupabase(): Promise<Vehicle[]> {
    try {
        const { data, error } = await supabase
            .from('inventory')
            .select('*')
            .order('id', { ascending: true }); // Assuming 'id' is a good sort key

        if (error) {
            console.error("Error reading inventory from Supabase:", error);
            return [];
        }
        return data as Vehicle[] || [];
    } catch (error) {
        console.error("Error calling Supabase:", error);
        return [];
    }
}

async function saveInventorySupabase(inventory: Vehicle[]) {
    const now = new Date().toISOString();
    const inventoryToSave = inventory.map(v => ({
        ...v,
        created_at: v.created_at || now
    }));

    try {
        const { error } = await supabase
            .from('inventory')
            .upsert(inventoryToSave, { onConflict: 'id' });

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }
    } catch (e) {
        console.error("Failed to save inventory to Supabase", e);
        throw e;
    }
}

// Export unified async functions
export async function getInventory(): Promise<Vehicle[]> {
    // Try Supabase first
    try {
        const data = await getInventorySupabase();
        if (data && data.length > 0) return data;
    } catch (e) {
        console.warn("Failed to fetch from Supabase, falling back to local if available", e);
    }

    // Fallback to local if Supabase fails or is empty (optional, maybe we want to always use Supabase?)
    // The user said "not using KV", implying a switch. 
    // If Supabase returns empty, it might just be empty.
    // But for safety during migration, let's return local if Supabase is empty?
    // Actually, if Supabase is working, we should rely on it.

    // Let's assume if Supabase returns [], it's empty.
    // But if connection fails, we might want local.
    // For now, I'll stick to Supabase primarily.

    // If we're local (dev), we might want to seed Supabase from local?
    // I'll add a quick check: if Supabase is empty, maybe try loading local?
    // For now, simple logic:
    const data = await getInventorySupabase();
    if (data && data.length > 0) return data;
    return getInventoryLocal();
}

export async function saveInventory(inventory: Vehicle[]) {
    await saveInventorySupabase(inventory);
    // Optionally save local as backup?
    if (process.env.NODE_ENV === 'development') {
        saveInventoryLocal(inventory);
    }
}

export async function getVehicleById(id: number): Promise<Vehicle | undefined> {
    // Optimization: query directly by ID
    const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return undefined;
    }
    return data as Vehicle;
}

