# Unstabilizer
[![NPM Version](https://img.shields.io/npm/v/unstabilizer)](https://www.npmjs.com/package/unstabilizer)
![Build status](https://ci.appveyor.com/api/projects/status/1kc7mwpib6fh8se4?svg=true)
[![CodeFactor](https://www.codefactor.io/repository/github/phaticusthiccy/unstabilizer/badge)](https://www.codefactor.io/repository/github/phaticusthiccy/unstabilizer)
[![GitHub repo size](https://img.shields.io/github/repo-size/phaticusthiccy/Unstabilizer?label=Size)](https://github.com/phaticusthiccy/Unstabilizer)

Pixel editing algorithm that disrupts pixel level for fine tuning ai training process.
 
## Installation
```bash
npm install unstabilizer
```
## Tests
For image path 
```bash
npm test
```
For buffer
```bash
npm test --buffer
```

## Quick Example (Async)
```javascript
const { getPixels, decay, createImage } = require("unstabilizer")

// image path or image buffer
let pixels = await getPixels(ArrayBuffer | String) 
let decayData = decay(pixels)

// result image
await createImage(decayData, "path/to/image.png")
```

## Documentation
### Core methods

* [getPixels()](#getpixels)
* [decay()](#decay)
* [createImage()](#createimage)

### getPixels()
A method of coordinating each pixel of an image to produce the colour data of that pixel.

> ```js
> // using buffer
> getPixels(fs.readFileSync("path/to/image.png"))
> // or image path
> getPixels("path/to/image.png")
> ```

### decay()
A method that arranges and mixes the payload pixels with a simple algorithm.

> ```ts
> decay(
>   pixelData: Object,
>   degradation_amount?: Number,
>   degradation_frequency?: Number,
>   mode?: String,
>   deathPixelInjection?: Boolean,
>   deathPixelInjectionValue?: Number
> )
> 
> type pixelData = Object; // data from getPixels method (required)
> type degradation_amount? = Number | 1; // The amount of distortion to add to the image (default 1) (min 1 - max 5) 
> type degradation_frequency? = Number | 20; // Frequency of the amount of distortion to be added to the image (default 20) (min 8 - max 64)
> type mode = String | "linear" | "random" | "complex"; // Degradation mode (default "linear")
> type deathPixelInjection = Boolean; // Inject death pixels to image (default true)
> type deathPixelInjectionValue = Number | 64; // Amount of death pixel to add (default 64) (min 1 - max 64)
> ```

### createImage()
A method that reads the corrupted output and converts it to an image.

> ```ts
> createImage(
>   imageData: Object,
>   output: String
> )
>
> type imageData = Object; // data from decay method (required)
> type output = String; // image path to save (required)
> ```


## License

### Unstabilizer

(GPL-3.0 license)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

See [license](./LICENSE)
