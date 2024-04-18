const fs = require("fs")
const getPixels = require("../lib/getPixels")
const decay = require("../lib/decay")
const createImage = require("../lib/createImage")
const console = require('pino')()


/**
 * The function reads an image file, processes its pixels to simulate decay, and then creates a new
 * image with the decay effect applied.
 * @returns The `start()` function is returning a Promise, as it is an async function. The Promise will
 * resolve once the entire function has completed execution.
 */
async function start() {
    console.info("using image " + (String(process.argv.slice(2)[1]) == "--buffer" ? "buffer" : "path"))
    let pixels = await getPixels(
        "src/" +
        (
            String(process.argv.slice(2)[1]) == "--buffer" ? 
            fs.readFileSync(
                fs.readdirSync("src")[
                    Math.floor(
                        Math.random() * fs.readdirSync("src").length
                    )
                ]
            ) : 
            fs.readdirSync("src")[
                Math.floor(
                    Math.random() * fs.readdirSync("src").length
                )
            ]
        )
    )
    let decayData = decay(pixels)
    await createImage(decayData, "src/result.png")
    return;
}
start()