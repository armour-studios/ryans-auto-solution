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

export function getInventory(): Vehicle[] {
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

export function saveInventory(data: Vehicle[]) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

export function getVehicleById(id: number): Vehicle | undefined {
    const inventory = getInventory();
    return inventory.find(v => v.id === id);
}
