/**
 * The function `isImage` checks if a given buffer represents an image based on specific byte patterns.
 * @param buffer - The `isImage` function checks if the provided buffer contains the header of either a
 * JPEG or a PNG image.
 * @returns The function `isImage` checks if the provided buffer represents an image by looking at the
 * first few bytes of the buffer. It returns `true` if the buffer starts with the JPEG file signature
 * (0xFFD8) or the PNG file signature (0x89504E47), indicating that it is likely an image file. If the
 * buffer does not match these signatures, the function will return
 */
function isImage(buffer) {
    return (
        (buffer[0] === 0xFF && buffer[1] === 0xD8) ||
        (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47)
    );
}

module.exports = isImage