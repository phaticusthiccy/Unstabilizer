const { createCanvas } = require('canvas');
const fs = require('fs');
const console = require('pino')()

/**
 *
 * @param {object} imageData - Pixel information of image
 * @param {string} output - Path to save decayed image
 * @returns undefined
 */
async function createImage(imageData, output) {
    return new Promise((resolve, reject) => { 
        if (!imageData || imageData.length === 0) {
            console.warn("imageData is empty or invalid, skipping image creation.");
            resolve();
            return;
        }

        const lastPixel = imageData[imageData.length - 1];
        const canvasWidth = lastPixel.x + 1;
        const canvasHeight = lastPixel.y + 1;

        if (canvasWidth <= 0 || canvasHeight <= 0) {
            console.warn("Invalid canvas dimensions, skipping image creation.");
            resolve();
            return;
        }

        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        for (let i = 0; i < imageData.length; i++) {
            const pixel = imageData[i];
            const { x, y, color } = pixel;
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
            ctx.fillRect(x, y, 1, 1);
        }

        const out = fs.createWriteStream(output);
        const stream = canvas.createPNGStream();
        stream.pipe(out);

        out.on('finish', () => {
            console.info("done " + output);
            resolve();
        });

        out.on('error', (err) => {
            console.error("Error writing to stream:", err);
            reject(err);
        });

        stream.on('error', (err) => {
            console.error("Error creating PNG stream:", err);
            reject(err);
        });
    });
}

module.exports = createImage