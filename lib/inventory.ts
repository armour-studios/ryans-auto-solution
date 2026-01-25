import { Redis } from '@upstash/redis';
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
};

const dataFilePath = path.join(process.cwd(), 'data/inventory.json');
const KV_KEY = 'inventory';

// Create Redis client with flexible env var detection
function getRedisClient(): Redis | null {
    // Check for various Upstash/Vercel KV environment variable patterns
    const url = process.env.KV_REST_API_URL ||
        process.env.UPSTASH_REDIS_REST_URL ||
        process.env.KV_URL ||
        process.env.REDIS_URL;
    const token = process.env.KV_REST_API_TOKEN ||
        process.env.UPSTASH_REDIS_REST_TOKEN ||
        process.env.KV_TOKEN ||
        process.env.REDIS_TOKEN;

    console.log('[Redis] URL env check:', url ? 'Found' : 'Not found');
    console.log('[Redis] Token env check:', token ? 'Found' : 'Not found');

    if (url && token && !url.includes('provisioning')) {
        try {
            return new Redis({ url, token });
        } catch (e) {
            console.error('[Redis] Failed to create client:', e);
            return null;
        }
    }
    return null;
}

// Check if we're on Vercel (read-only filesystem)
const isVercel = () => Boolean(process.env.VERCEL);

// Check if we have a working Redis connection
const hasRedis = () => getRedisClient() !== null;

// Local filesystem functions (only works locally, not on Vercel)
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

// Redis functions
async function getInventoryRedis(): Promise<Vehicle[]> {
    const redis = getRedisClient();
    if (!redis) return [];

    try {
        const data = await redis.get<Vehicle[]>(KV_KEY);
        return data || [];
    } catch (error) {
        console.error("Error reading inventory from Redis:", error);
        return [];
    }
}

async function saveInventoryRedis(inventory: Vehicle[]) {
    const redis = getRedisClient();
    if (!redis) {
        throw new Error('Redis not configured. Please set up Vercel KV or Upstash Redis.');
    }

    await redis.set(KV_KEY, inventory);
}

// Export unified async functions
export async function getInventory(): Promise<Vehicle[]> {
    if (hasRedis()) {
        console.log('[Inventory] Using Redis');
        return getInventoryRedis();
    }
    console.log('[Inventory] Using Local filesystem');
    return getInventoryLocal();
}

export async function saveInventory(inventory: Vehicle[]) {
    if (hasRedis()) {
        console.log('[Inventory] Saving to Redis');
        await saveInventoryRedis(inventory);
    } else if (isVercel()) {
        // On Vercel without Redis, we can't save
        throw new Error('Database not configured. Please set up Vercel KV in your Vercel dashboard: Project → Storage → Create Database → KV');
    } else {
        console.log('[Inventory] Saving to Local filesystem');
        saveInventoryLocal(inventory);
    }
}

export async function getVehicleById(id: number): Promise<Vehicle | undefined> {
    const inventory = await getInventory();
    return inventory.find(v => v.id === id);
}
