const fs = require("fs")
const getPixels = require("../lib/getPixels")
const decay = require("../lib/decay")
const createImage = require("../lib/createImage")

async function Test_fastDecay() {
    let pixels = await getPixels(fs.readFileSync("src/example.png"))
    let decayData = decay(pixels)
    await createImage(decayData, "src/result.png")
    return;
}

async function Test_randomDecay() {
    let pixels = await getPixels(fs.readFileSync("src/example2.png"))
    let decayData = decay(pixels, 0, 0, "random")
    await createImage(decayData, "src/result.png")
    return;
}

async function Test_balancedDecay() {
    let pixels = await getPixels(fs.readFileSync("src/example3.png"))
    let decayData = decay(pixels, 1, 32, "linear")
    await createImage(decayData, "src/result.png")
    return;
}

async function Test_complexDecay() {
    let pixels = await getPixels(fs.readFileSync("src/example.png"))
    let decayData = decay(pixels, 1, 16, "complex")
    await createImage(decayData, "src/result.png")
    return;
}