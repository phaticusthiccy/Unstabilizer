const imageDataControl = require("./imageDataControl")
const console = require('pino')()

/**
 * 
 * @param {object} pixelData - Pixel information of image
 * @param {number} degradation_amount - The amount of distortion to add to the image (default 1) (min 1 - max 5)
 * @param {number} degradation_frequency - Frequency of the amount of distortion to be added to the image (default 20) (min 8 - max 64)
 * @param {string} mode - degradation mode (default "linear")
 * @param {boolean} deathPixelInjection - Inject death pixels to image (default true). ⚠ If mode == "complex", this param will not work!
 * @param {number} deathPixelInjectionValue - Amount of death pixel to add (default = 64) ⚠ This will work when deathPixelInjection is true
 *  
 * @typedef {number} degradation_frequency - This value must always be +7 more than the degradation_amount value
 * @typedef {string} mode - This value must be "random", "linear" or "complex". For fastest results, use "linear"
 * @returns {object} Array[]
 */
function decay(pixelData, degradation_amount = 1, degradation_frequency = 20, mode = "linear", deathPixelInjection = true, deathPixelInjectionValue = 64) {
    if (typeof pixelData !== "object") throw new TypeError("this data cant decayable")
    if (!imageDataControl(pixelData)) throw new Error("data is corrupted")
    
    /* 
    This block of code is performing input validation and adjustment for the `degradation_amount`
    and `degradation_frequency` parameters in the `decay` function. Here's a breakdown of what each
    condition is checking and doing: 
    */
    if (typeof degradation_amount !== "number") {degradation_amount = 1; console.warn("degradation_amount must be number. using deafult values: 1") }
    if (typeof degradation_frequency !== "number") {degradation_frequency = 1; console.warn("degradation_frequency must be number. using deafult values: 20") }
    if (degradation_amount > 5) { degradation_amount = 5; console.warn("degradation_amount is higher than excepted. reducing to 5"); }
    if (degradation_amount < 1) { degradation_amount = 1; console.warn("degradation_amount is lower than excepted. increasing to 1"); }
    if (degradation_frequency > 64) { degradation_frequency = 20; console.warn("degradation_frequency is higher than excepted. reducing to 64"); }
    if (degradation_frequency < 8) { degradation_frequency = 8; console.warn("degradation_frequency is lower than excepted. increasing to 8"); }
    if (degradation_amount +6 >= degradation_frequency) { degradation_frequency = 20; degradation_amount = 1; console.warn("degradation_frequency value is very close to the degradation_amount value. using default values") } 
    if (mode !== "linear" && mode !== "complex" && mode !== "random") { console.warn("mode is not defined. using default 'linear'"); }
    if (typeof deathPixelInjection !== "boolean") {deathPixelInjection = true; console.warn("deathPixelInjection must be boolean. using deafult values: true") }
    if (typeof deathPixelInjectionValue !== "number") {deathPixelInjection = true; console.warn("deathPixelInjectionValue must be number. using deafult values: 64") }
    if (deathPixelInjectionValue < 1) { deathPixelInjectionValue = 1; console.warn("deathPixelInjectionValue is lower than excepted. increasing to 1")}
    if (deathPixelInjectionValue > 64) { deathPixelInjectionValue = 64; console.warn("deathPixelInjectionValue is higher than excepted. reducing to 64")}
    
    /* 
    This block of code is iterating over each pixel in the `pixelData` array and creating a new
    array `newImageData` with added distortion based on the `degradation_amount` and
    `degradation_frequency` parameters. Here's a breakdown of what it's doing: 
    */
    var newImageData = [];
    if (mode == "linear" || mode == "complex") {
        pixelData.forEach((pixel, index) => {
            newImageData.push(pixel);
            if ((index + 1) % degradation_frequency === 0) {
                for (let i = 0; i < degradation_amount; i++) {
                    newImageData.push({
                        x: pixel.x + i + 1,
                        y: pixel.y,
                        color: { r: 0, g: 0, b: 0, a: 255 }
                    });
                }
            }
        });
        /* 
        This block of code is swapping the colors of pixels in the `newImageData` array in groups of 64
        pixels. Here's a breakdown of what it's doing: 
        */
        if (deathPixelInjection == true) {
            for (let i = 64; i < newImageData.length; i += mode == "complex" ? degradation_frequency : 64) {
                if (i + (mode == "complex" ? degradation_frequency : 64) < newImageData.length) {
                    const tempColor = newImageData[i].color;
                    newImageData[i].color = newImageData[i + (mode == "complex" ? degradation_frequency : 64)].color;
                    newImageData[i + (mode == "complex" ? degradation_frequency : 64)].color = tempColor;
                }
            }
        }
        return newImageData; 
    } else {
        pixelData.forEach((pixel, index) => {
            newImageData.push(pixel);
            if ((index + 1) % degradation_frequency === 0) {
                const randomIndex = Math.floor(Math.random() * newImageData.length);
                for (let i = 0; i < degradation_amount; i++) {
                    newImageData.splice(randomIndex + i + 1, 0, {
                        x: pixel.x + i + 1,
                        y: pixel.y,
                        color: { r: 0, g: 0, b: 0, a: 255 }
                    });
                }
            }
        });
        if (deathPixelInjection == true) {
            for (let i = 64; i < newImageData.length; i += deathPixelInjectionValue) {
                if (i + deathPixelInjectionValue < newImageData.length) {
                    const randomIndex = Math.floor(Math.random() * deathPixelInjectionValue) + i;
                    const tempColor = newImageData[i].color;
                    newImageData[i].color = newImageData[randomIndex].color;
                    newImageData[randomIndex].color = tempColor;
                }
            }
        }
        return newImageData; 
    }
}

module.exports = decay