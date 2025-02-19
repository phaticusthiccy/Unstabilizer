/**
 * The `isValidData` function checks the validity of pixel information in an `imageData` object by
 * verifying the data types and properties of each item.
 * @param imageData - The `imageData` object should have the following structure for the `isValidData`
 * function to work correctly:
 * @returns The function `isValidData` is returning a boolean value indicating whether the `imageData`
 * object is valid or not. If the `imageData` object passes all the validation checks within the
 * function, it will return `true`, indicating that the data is valid. If any of the validation checks
 * fail, it will return `false`, indicating that the data is not valid.
 */
function isValidData(imageData) {
    if (!Array.isArray(imageData)) return false;

    for (let i = 0; i < imageData.length; i++) {
        const item = imageData[i];
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
            return false;
        }

        const color = item.color;
        if (
            typeof item.x !== 'number' ||
            typeof item.y !== 'number' ||
            typeof color !== 'object' ||
            color === null ||
            Array.isArray(color) ||
            typeof color.r !== 'number' ||
            typeof color.g !== 'number' ||
            typeof color.b !== 'number' ||
            typeof color.a !== 'number'
        ) {
            return false;
        }
    }
    return true;
}

module.exports = isValidData