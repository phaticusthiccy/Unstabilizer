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
    /* 
    This part of the code is checking if the `image` parameter is a Buffer object. If it is a Buffer
    object, it then calls the `bufferImageControl` function passing the `image` buffer as an
    argument.If the `bufferImageControl` function returns a
    false value (indicating the buffer is not valid image data), it throws an error.
    */
    if (Buffer.isBuffer(image)) {
        let control = bufferImageControl(image);
        if (!control) throw new Error("payload buffer is not a valid image data. must be png or jpg");
    }
    return new Promise((resolve, reject) => {
        JIMP.read(image, (err, j_image) => {
            if (err) {
                reject(new Error("jimp error, " + err));
                return;
            }
            let width = j_image.bitmap.width;
            let height = j_image.bitmap.height;
            let pixels = [];
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let color = JIMP.intToRGBA(j_image.getPixelColor(x, y));
                    var pixel = {
                        x: x,
                        y: y,
                        color: color
                    };
                    pixels.push(pixel);
                }
            }
            
            resolve(pixels);
        });
    });
}

module.exports = getPixel;
