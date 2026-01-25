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
        process.env.REDIS_URL;
    const token = process.env.KV_REST_API_TOKEN ||
        process.env.UPSTASH_REDIS_REST_TOKEN ||
        process.env.REDIS_TOKEN;

    if (url && token && !url.includes('provisioning')) {
        return new Redis({ url, token });
    }
    return null;
}

// Check if we have a working Redis connection
const hasRedis = () => {
    const client = getRedisClient();
    return client !== null;
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
    if (!redis) throw new Error('Redis not configured');

    await redis.set(KV_KEY, inventory);
}

// Export unified async functions
export async function getInventory(): Promise<Vehicle[]> {
    if (hasRedis()) {
        return getInventoryRedis();
    }
    return getInventoryLocal();
}

export async function saveInventory(inventory: Vehicle[]) {
    if (hasRedis()) {
        await saveInventoryRedis(inventory);
    } else {
        saveInventoryLocal(inventory);
    }
}

export async function getVehicleById(id: number): Promise<Vehicle | undefined> {
    const inventory = await getInventory();
    return inventory.find(v => v.id === id);
}
