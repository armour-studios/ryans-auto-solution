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
 * Simple sharpen convolution filter
 */
function sharpen(ctx: CanvasRenderingContext2D, w: number, h: number, mix: number) {
    const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    const katet = Math.round(Math.sqrt(weights.length));
    const half = (katet * 0.5) | 0;
    const dstData = ctx.createImageData(w, h);
    const dstRaw = dstData.data;
    const srcData = ctx.getImageData(0, 0, w, h);
    const srcRaw = srcData.data;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const sy = y;
            const sx = x;
            const dstOff = (y * w + x) * 4;
            let r = 0, g = 0, b = 0;

            for (let cy = 0; cy < katet; cy++) {
                for (let cx = 0; cx < katet; cx++) {
                    const scy = sy + cy - half;
                    const scx = sx + cx - half;

                    if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                        const srcOff = (scy * w + scx) * 4;
                        const wt = weights[cy * katet + cx];
                        r += srcRaw[srcOff] * wt;
                        g += srcRaw[srcOff + 1] * wt;
                        b += srcRaw[srcOff + 2] * wt;
                    }
                }
            }

            // Alpha stays same
            dstRaw[dstOff] = srcRaw[dstOff] + (r - srcRaw[dstOff]) * mix;
            dstRaw[dstOff + 1] = srcRaw[dstOff + 1] + (g - srcRaw[dstOff + 1]) * mix;
            dstRaw[dstOff + 2] = srcRaw[dstOff + 2] + (b - srcRaw[dstOff + 2]) * mix;
            dstRaw[dstOff + 3] = srcRaw[dstOff + 3];
        }
    }
    ctx.putImageData(dstData, 0, 0);
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
        // Professional Color Grade: Brightness, Contrast, Saturation + Cinematic Tint
        // Tint: subtle warm shadows and cool highlights (standard cinematic look)
        resultCtx.filter = 'brightness(1.08) contrast(1.15) saturate(1.2) sepia(0.1) hue-rotate(-5deg)';
    }

    // Draw the cropped portion from workCanvas to resultCanvas
    // drawImage SUPPORTS filters, putImageData DOES NOT
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

    // 3. Post-processing (Sharpening)
    if (autoEnhance) {
        sharpen(resultCtx, resultCanvas.width, resultCanvas.height, 0.35); // Apply 35% sharpen
    }

    return new Promise((resolve) => {
        resultCanvas.toBlob((file) => {
            resolve(file);
        }, mimeType, 0.95); // Higher quality for pro results
    });
}
