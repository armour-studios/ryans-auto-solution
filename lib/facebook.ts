// Facebook Graph API utility for posting to your business page
// 
// SETUP REQUIRED:
// 1. Go to https://developers.facebook.com and create an app
// 2. Add "Facebook Login for Business" product
// 3. Generate a Page Access Token with pages_manage_posts permission
// 4. Add your credentials to .env.local

const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

export type FacebookPostResult = {
    success: boolean;
    postId?: string;
    error?: string;
};

export type VehiclePostData = {
    year: number;
    make: string;
    model: string;
    price: number;
    mileage: number;
    description?: string;
    image?: string;
    websiteUrl?: string;
};

/**
 * Post a vehicle to the Facebook page
 */
export async function postVehicleToFacebook(vehicle: VehiclePostData): Promise<FacebookPostResult> {
    if (!FACEBOOK_PAGE_ID || !FACEBOOK_ACCESS_TOKEN) {
        return {
            success: false,
            error: 'Facebook credentials not configured. Add FACEBOOK_PAGE_ID and FACEBOOK_ACCESS_TOKEN to .env.local'
        };
    }

    // Create the post message
    const message = createVehiclePostMessage(vehicle);

    try {
        // If there's an image, post with photo
        if (vehicle.image) {
            return await postWithPhoto(message, vehicle.image);
        } else {
            return await postTextOnly(message, vehicle.websiteUrl);
        }
    } catch (error) {
        console.error('Facebook post error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to post to Facebook'
        };
    }
}

/**
 * Create a formatted message for the vehicle post
 */
function createVehiclePostMessage(vehicle: VehiclePostData): string {
    const priceFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(vehicle.price);

    const mileageFormatted = new Intl.NumberFormat('en-US').format(vehicle.mileage);

    let message = `🚗 NEW ARRIVAL! 🚗\n\n`;
    message += `${vehicle.year} ${vehicle.make} ${vehicle.model}\n\n`;
    message += `💰 Price: ${priceFormatted}\n`;
    message += `📍 Mileage: ${mileageFormatted} miles\n\n`;

    if (vehicle.description) {
        message += `${vehicle.description}\n\n`;
    }

    message += `📞 Call (218) 469-0183 to schedule a test drive!\n`;
    message += `📍 325 Oak Hills Rd SE, Bemidji, MN 56601\n\n`;
    message += `#BemidjiCars #UsedCars #RyansAutoSolution #NorthernMinnesota`;

    return message;
}

/**
 * Post with a photo attachment
 */
async function postWithPhoto(message: string, imageUrl: string): Promise<FacebookPostResult> {
    const url = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/photos`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: imageUrl,
            caption: message,
            access_token: FACEBOOK_ACCESS_TOKEN
        })
    });

    const data = await response.json();

    if (data.error) {
        return {
            success: false,
            error: data.error.message
        };
    }

    return {
        success: true,
        postId: data.post_id || data.id
    };
}

/**
 * Post text only (with optional link)
 */
async function postTextOnly(message: string, link?: string): Promise<FacebookPostResult> {
    const url = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}/feed`;

    const body: Record<string, string> = {
        message,
        access_token: FACEBOOK_ACCESS_TOKEN!
    };

    if (link) {
        body.link = link;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    if (data.error) {
        return {
            success: false,
            error: data.error.message
        };
    }

    return {
        success: true,
        postId: data.id
    };
}

/**
 * Verify Facebook credentials are valid
 */
export async function verifyFacebookCredentials(): Promise<{ valid: boolean; pageName?: string; error?: string }> {
    if (!FACEBOOK_PAGE_ID || !FACEBOOK_ACCESS_TOKEN) {
        return { valid: false, error: 'Credentials not configured' };
    }

    try {
        const url = `https://graph.facebook.com/v18.0/${FACEBOOK_PAGE_ID}?fields=name&access_token=${FACEBOOK_ACCESS_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            return { valid: false, error: data.error.message };
        }

        return { valid: true, pageName: data.name };
    } catch (error) {
        return { valid: false, error: 'Failed to verify credentials' };
    }
}
