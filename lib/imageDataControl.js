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
    /* 
    This code defines a function `isValidData` that takes an `imageData` object as input, which
    contains pixel information of an image. The function iterates over each item in the `imageData`
    array using the `every` method. 
    */
    let final = new Boolean()
    imageData.every(item => {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
            final = false;
        }
        /* 
        This `if` statement is checking the validity of the `item` object within the `imageData`
        array. It is verifying if the `item` object has the expected properties and data types.
        Here's a breakdown of what each condition is checking: 
        */
        if (
            typeof item.x !== 'number' ||
            typeof item.y !== 'number' ||
            typeof item.color !== 'object' ||
            item.color === null ||
            Array.isArray(item.color) ||
            typeof item.color.r !== 'number' ||
            typeof item.color.g !== 'number' ||
            typeof item.color.b !== 'number' ||
            typeof item.color.a !== 'number'
        ) {
            final = false;
        }
        final = true;
    });
    return final
}

module.exports = isValidData