const JIMP = require("jimp");
const bufferImageControl = require("./bufferImageControl");

/**
 * The `getPixel` function reads an image file, extracts pixel data, and returns an array of pixel
 * objects containing their coordinates and color information.
 * @param image - The `image` parameter in the `getPixel` function is expected to be either a Buffer
 * object containing image data or a path to an image file. The function first checks if the `image` is
 * a Buffer object using `Buffer.isBuffer(image)`. If it is a Buffer object, it
 * @returns The `getPixel` function returns a Promise that resolves to an array of objects representing
 * each pixel in the image. Each object contains the x and y coordinates of the pixel, as well as the
 * color information in RGBA format.
 */
async function getPixel(image) {
    if (!image) {
        throw new Error("Image source is required.");
    }

    if (Buffer.isBuffer(image) && !bufferImageControl(image)) {
        throw new Error("Payload buffer is not a valid image data. Must be png or jpg");
    }

    return new Promise((resolve, reject) => {
        JIMP.read(image, (err, j_image) => {
            if (err) {
                reject(new Error("JIMP error: " + err));
                return;
            }

            const width = j_image.getWidth();
            const height = j_image.getHeight();
            const pixels = [];

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const rgbaInt = j_image.getPixelColor(x, y);
                    const color = JIMP.intToRGBA(rgbaInt);
                    pixels.push({
                        x: x,
                        y: y,
                        color: color
                    });
                }
            }

            resolve(pixels);
        });
    });
}

module.exports = getPixel;