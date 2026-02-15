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
    const workCtx = workCanvas.getContext('2d');
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
    const resultCtx = resultCanvas.getContext('2d');
    if (!resultCtx) return null;

    resultCanvas.width = pixelCrop.width;
    resultCanvas.height = pixelCrop.height;

    // Apply auto-enhance filter to the context BEFORE drawing
    if (autoEnhance) {
        // More noticeable values for better feedback
        resultCtx.filter = 'brightness(1.1) contrast(1.2) saturate(1.2)';
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

    return new Promise((resolve) => {
        resultCanvas.toBlob((file) => {
            resolve(file);
        }, mimeType, 0.9); // 0.9 quality
    });
}
