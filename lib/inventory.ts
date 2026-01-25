import { kv } from '@vercel/kv';
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
    youtubeUrl?: string; // YouTube integration
    vin?: string; // VIN support
    trending?: boolean;
    description: string;
    specs: Record<string, string>;
    features: string[];
};

const dataFilePath = path.join(process.cwd(), 'data/inventory.json');
const KV_KEY = 'inventory';

// Check if we're running on Vercel with KV configured
const isVercelKV = () => {
    return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// Local filesystem functions
function getInventoryLocal(): Vehicle[] {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const fileStats = fs.statSync(dataFilePath);
    if (fileStats.size === 0) {
        return [];
    }
    try {
        const jsonData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("Error reading inventory:", error);
        return [];
    }
}

function saveInventoryLocal(data: Vehicle[]) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Vercel KV functions
async function getInventoryKV(): Promise<Vehicle[]> {
    try {
        const data = await kv.get<Vehicle[]>(KV_KEY);
        return data || [];
    } catch (error) {
        console.error("Error reading inventory from KV:", error);
        return [];
    }
}

async function saveInventoryKV(data: Vehicle[]) {
    await kv.set(KV_KEY, data);
}

// Export unified async functions
export async function getInventory(): Promise<Vehicle[]> {
    if (isVercelKV()) {
        return getInventoryKV();
    }
    return getInventoryLocal();
}

export async function saveInventory(data: Vehicle[]) {
    if (isVercelKV()) {
        await saveInventoryKV(data);
    } else {
        saveInventoryLocal(data);
    }
}

export async function getVehicleById(id: number): Promise<Vehicle | undefined> {
    const inventory = await getInventory();
    return inventory.find(v => v.id === id);
}
