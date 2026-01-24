import { NextResponse } from 'next/server';
import { postVehicleToFacebook, verifyFacebookCredentials, VehiclePostData } from '@/lib/facebook';

// POST - Post a vehicle to Facebook
export async function POST(request: Request) {
    try {
        const vehicle: VehiclePostData = await request.json();

        if (!vehicle.year || !vehicle.make || !vehicle.model || !vehicle.price) {
            return NextResponse.json(
                { error: 'Missing required vehicle information' },
                { status: 400 }
            );
        }

        const result = await postVehicleToFacebook(vehicle);

        if (result.success) {
            return NextResponse.json({
                success: true,
                postId: result.postId,
                message: 'Vehicle posted to Facebook successfully!'
            });
        } else {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Facebook post API error:', error);
        return NextResponse.json(
            { error: 'Failed to post to Facebook' },
            { status: 500 }
        );
    }
}

// GET - Verify Facebook credentials
export async function GET() {
    const result = await verifyFacebookCredentials();
    return NextResponse.json(result);
}
