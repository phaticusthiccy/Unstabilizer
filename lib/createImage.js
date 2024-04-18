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
    return new Promise(async (resolve, reject) => {
      const canvasWidth = (imageData[imageData.length - 1].x) + 1;
      const canvasHeight = (imageData[imageData.length - 1].y) + 1
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = canvas.getContext('2d');
      await imageData.forEach(pixel => {
        const { x, y, color } = pixel;
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
        ctx.fillRect(x, y, 1, 1);
      });
      const out = fs.createWriteStream(output)
      canvas.createPNGStream().pipe(out)
      out.on('finish', async () => {
        console.info("done " + output);
        resolve();
      })
    });
}

module.exports = createImage