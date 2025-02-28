const imageDataControl = require("./imageDataControl");
const console = require('pino')();

/**
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
    if (!pixelData || typeof pixelData !== "object") throw new TypeError("this data cant decayable");
    if (!imageDataControl(pixelData)) throw new Error("data is corrupted");

    const warn = console.warn;

    // Validate and adjust degradation_amount
    if (typeof degradation_amount !== "number") {
        degradation_amount = 1;
        warn("degradation_amount must be number. using default values: 1");
    } else if (degradation_amount > 5) {
        degradation_amount = 5;
        warn("degradation_amount is higher than expected. reducing to 5");
    } else if (degradation_amount < 1) {
        degradation_amount = 1;
        warn("degradation_amount is lower than expected. increasing to 1");
    }

    // Validate and adjust degradation_frequency
    if (typeof degradation_frequency !== "number") {
        degradation_frequency = 20;
        warn("degradation_frequency must be number. using default values: 20");
    } else if (degradation_frequency > 64) {
        degradation_frequency = 64;
        warn("degradation_frequency is higher than expected. reducing to 64");
    } else if (degradation_frequency < 8) {
        degradation_frequency = 8;
        warn("degradation_frequency is lower than expected. increasing to 8");
    }

    // Validate relation between degradation_amount and degradation_frequency
    if (degradation_amount + 6 >= degradation_frequency) {
        degradation_frequency = 20;
        degradation_amount = 1;
        warn("degradation_frequency value is very close to the degradation_amount value. using default values");
    }

    // Validate mode
    if (mode !== "linear" && mode !== "complex" && mode !== "random") {
        console.warn("mode is not defined. using default 'linear'");
    }

    // Validate deathPixelInjection
    if (typeof deathPixelInjection !== "boolean") {
        deathPixelInjection = true;
        warn("deathPixelInjection must be boolean. using default values: true");
    }

    // Validate and adjust deathPixelInjectionValue
    if (typeof deathPixelInjectionValue !== "number") {
        deathPixelInjectionValue = 64;
        warn("deathPixelInjectionValue must be number. using default values: 64");
    } else if (deathPixelInjectionValue < 1) {
        deathPixelInjectionValue = 1;
        warn("deathPixelInjectionValue is lower than expected. increasing to 1");
    } else if (deathPixelInjectionValue > 64) {
        deathPixelInjectionValue = 64;
        warn("deathPixelInjectionValue is higher than expected. reducing to 64");
    }

    const newImageData = [];
    const freq = degradation_frequency;
    const amount = degradation_amount;

    if (mode === "linear" || mode === "complex") {
        for (let index = 0; index < pixelData.length; index++) {
            newImageData.push(pixelData[index]);
            if ((index + 1) % freq === 0) {
                for (let i = 0; i < amount; i++) {
                    newImageData.push({
                        x: pixelData[index].x + i + 1,
                        y: pixelData[index].y,
                        color: { r: 0, g: 0, b: 0, a: 255 }
                    });
                }
            }
        }

        if (deathPixelInjection) {
            const swapStep = mode === "complex" ? freq : 64;
            for (let i = 64; i < newImageData.length; i += swapStep) {
                if (i + swapStep < newImageData.length) {
                    // Swap colors directly using destructuring
                    [newImageData[i].color, newImageData[i + swapStep].color] = [newImageData[i + swapStep].color, newImageData[i].color];
                }
            }
        }
    } else { // mode === "random"
        const injectionValue = deathPixelInjectionValue;
        for (let index = 0; index < pixelData.length; index++) {
            newImageData.push(pixelData[index]);
            if ((index + 1) % freq === 0) {
                const randomIndex = Math.floor(Math.random() * newImageData.length);
                for (let i = 0; i < amount; i++) {
                    newImageData.splice(randomIndex + i + 1, 0, {
                        x: pixelData[index].x + i + 1,
                        y: pixelData[index].y,
                        color: { r: 0, g: 0, b: 0, a: 255 }
                    });
                }
            }
        }

        if (deathPixelInjection) {
            for (let i = 64; i < newImageData.length; i += injectionValue) {
                if (i + injectionValue < newImageData.length) {
                    const randomIndex = Math.floor(Math.random() * injectionValue) + i;
                    // Swap colors directly using destructuring
                    [newImageData[i].color, newImageData[randomIndex].color] = [newImageData[randomIndex].color, newImageData[i].color];
                }
            }
        }
    }

    return newImageData;
}

module.exports = decay;