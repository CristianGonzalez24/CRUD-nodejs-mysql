import sharp from 'sharp';

export const getMetadata = async (buffer) => {
    try {
        const metadata = await sharp(buffer).metadata();
        return metadata;
    } catch (error) {
        console.log('An error occurred during metadata extraction:', error);
    }
}

export const resizeImage = async (buffer, width, height) => {
    try {
        const resizedBuffer = await sharp(buffer).resize(width, height).toFormat('jpeg', { quality: 80, mozjpeg: true }).toBuffer();
        return resizedBuffer;
    } catch (error) {
        console.log('An error occurred during image resizing:', error);
    }
}

export const cropImage = async (buffer, width, height, left, top) => {
    try {
        const croppedBuffer = await sharp(buffer).extract({ width, height, left, top }).grayscale().toBuffer();
        return croppedBuffer;
    } catch (error) {
        console.log('An error occurred during image cropping:', error);
    }
}

export const rotateImage = async (buffer, angle) => {
    try {
        const rotatedBuffer = await sharp(buffer).rotate(angle, { r: 0, g: 0, b: 0, alpha: 0 }).blur(4).toBuffer();
        return rotatedBuffer;
    } catch (error) {
        console.log('An error occurred during image rotation:', error);
    }
}

export const compositeImages = async (backgroundBuffer, foregroundBuffer, left, top) => {
    try {
        const compositeBuffer = await sharp(backgroundBuffer).composite([{ input: foregroundBuffer, left, top }]).toBuffer();
        return compositeBuffer;
    } catch (error) {
        console.log('An error occurred during image compositing:', error);
    }
}

export const addTextOnImage = async (buffer, text, x, y, width, height) => {
    try {
        const svg = `
        <svg width="${width}" height="${height}">
            <style>
            .title { fill: #001; font-size: 70px; font-weight: bold;}
            </style>
            <text x="${x}%" y="${y}%" text-anchor="middle" class="title">${text}</text>
        </svg>
        `;

        const textBuffer = await sharp(buffer).composite([{ input: svg, top: 0, left: 0 }]).toBuffer();
        return textBuffer;
    } catch (error) {
        console.log('An error occurred during text addition:', error);
    }
}