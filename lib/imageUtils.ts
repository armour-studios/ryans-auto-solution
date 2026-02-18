export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });

export function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated shape.
 */
export function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation);

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

/**
 * This function was adapted from the one in the react-easy-crop documentation
 */
/**
 * Professional Unsharp Mask Sharpening
 */
async function unsharpMask(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, amount: number, radius: number) {
    const w = canvas.width;
    const h = canvas.height;

    // 1. Get original image data
    const originalData = ctx.getImageData(0, 0, w, h);
    const original = originalData.data;

    // 2. Create a blurred version on a temporary canvas
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = w;
    blurCanvas.height = h;
    const blurCtx = blurCanvas.getContext('2d');
    if (!blurCtx) return;

    blurCtx.filter = `blur(${radius}px)`;
    blurCtx.drawImage(canvas, 0, 0);
    const blurred = blurCtx.getImageData(0, 0, w, h).data;

    // 3. Blend: Pixel = Original + (Original - Blurred) * Amount
    // We modify life data in originalData
    for (let i = 0; i < original.length; i += 4) {
        for (let j = 0; j < 3; j++) { // R, G, B
            const idx = i + j;
            const diff = original[idx] - blurred[idx];
            // amount 0.6-0.8 is good for "clean" sharpen without grain
            original[idx] = Math.min(255, Math.max(0, original[idx] + diff * amount));
        }
        // Alpha (original[i+3]) remains unchanged
    }

    ctx.putImageData(originalData, 0, 0);
}

/**
 * Subtle Denoise (Median approximation) 
 * Helps clean up image grain before sharpening
 */
function applyShowroomDenoise(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // We use a very light blur blend to smooth out noise while preserving edges
    const originalData = ctx.getImageData(0, 0, w, h);
    ctx.globalAlpha = 0.2; // 20% blend of smooth version
    ctx.filter = 'blur(0.5px)';
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.globalAlpha = 1.0;
    ctx.filter = 'none';
}

export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    autoEnhance = false,
    mimeType = 'image/jpeg'
): Promise<Blob | null> {
    const image = await createImage(imageSrc);

    // 1. Create a workspace canvas for rotation/flip
    const workCanvas = document.createElement('canvas');
    const workCtx = workCanvas.getContext('2d', { willReadFrequently: true });
    if (!workCtx) return null;

    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    );

    workCanvas.width = bBoxWidth;
    workCanvas.height = bBoxHeight;

    workCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
    workCtx.rotate(getRadianAngle(rotation));
    workCtx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    workCtx.translate(-image.width / 2, -image.height / 2);
    workCtx.drawImage(image, 0, 0);

    // 2. Create the final cropped canvas
    const resultCanvas = document.createElement('canvas');
    const resultCtx = resultCanvas.getContext('2d', { willReadFrequently: true });
    if (!resultCtx) return null;

    resultCanvas.width = pixelCrop.width;
    resultCanvas.height = pixelCrop.height;

    // Apply auto-enhance filter to the context BEFORE drawing
    if (autoEnhance) {
        // High-Quality "Showroom Clean" Filter:
        // - contrast(1.15): Deepens blacks
        // - brightness(1.05): Keeps it professional and airy
        // - saturate(1.3): Makes car paint look fresh and vibrant
        // - contrast(1.1): Secondary push for mid-tone definition
        resultCtx.filter = 'brightness(1.03) contrast(1.18) saturate(1.3) contrast(1.05)';
    }

    // Draw the cropped portion
    resultCtx.drawImage(
        workCanvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    // 3. Post-processing (Pro Sharpening & Denoise)
    if (autoEnhance) {
        // First Pass: Denoise to clean up sensor grain
        applyShowroomDenoise(resultCtx, resultCanvas.width, resultCanvas.height);

        // Second Pass: Unsharp Mask for professional edge clarity
        await unsharpMask(resultCtx, resultCanvas, 0.75, 1);
    }

    return new Promise((resolve) => {
        resultCanvas.toBlob((file) => {
            resolve(file);
        }, mimeType, 0.98); // Ultra high quality output
    });
}
