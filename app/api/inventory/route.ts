import { NextResponse } from 'next/server';
import { getInventory, saveInventory, Vehicle } from '@/lib/inventory';
import { postVehicleToFacebook } from '@/lib/facebook';

export async function GET() {
    const inventory = await getInventory();
    return NextResponse.json(inventory);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const inventory = await getInventory();

        const newVehicle = {
            id: Date.now(),
            ...body
        };

        inventory.push(newVehicle as Vehicle);
        await saveInventory(inventory);

        // Auto-post to Facebook if enabled
        const postToFacebook = body.postToFacebook !== false; // Default to true
        let facebookResult = null;

        if (postToFacebook && process.env.FACEBOOK_ACCESS_TOKEN) {
            try {
                // Build the website URL for this vehicle
                const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ryansautosolution.com';
                const vehicleUrl = `${baseUrl}/inventory/${newVehicle.id}`;

                // Get the first image if available
                const imageUrl = body.images && body.images.length > 0
                    ? (body.images[0].startsWith('http') ? body.images[0] : `${baseUrl}${body.images[0]}`)
                    : undefined;

                facebookResult = await postVehicleToFacebook({
                    year: body.year,
                    make: body.make,
                    model: body.model,
                    price: body.price,
                    mileage: body.mileage,
                    description: body.description,
                    image: imageUrl,
                    websiteUrl: vehicleUrl
                });

                console.log('Facebook post result:', facebookResult);
            } catch (error) {
                console.error('Facebook post failed:', error);
                facebookResult = { success: false, error: 'Failed to post to Facebook' };
            }
        }

        return NextResponse.json({
            ...newVehicle,
            facebookPost: facebookResult
        }, { status: 201 });
    } catch (error) {
        console.error('Error saving vehicle:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to save vehicle'
        }, { status: 500 });
    }
}
