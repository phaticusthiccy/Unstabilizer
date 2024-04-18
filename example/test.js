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
    var typeBuffer = JSON.parse(process.env.npm_config_argv).original.includes("--buffer")
    console.info("using image " + (typeBuffer == true ? "buffer" : "path"))
    let pixels = await getPixels(
        (
            typeBuffer == true ? 
            fs.readFileSync("src/" + 
                fs.readdirSync("src/").filter((names) => !names.includes("result"))[
                    Math.floor(
                        Math.random() * fs.readdirSync("src/").filter((names) => !names.includes("result")).length
                    )
                ]
            ) : 
            "src/" + (fs.readdirSync("src/").filter((names) => !names.includes("result"))[
                Math.floor(
                    Math.random() * fs.readdirSync("src/").filter((names) => !names.includes("result")).length
                )
            ])
        )
    )
    let decayData = decay(pixels)
    await createImage(decayData, "src/result.png")
    return;
}
start()