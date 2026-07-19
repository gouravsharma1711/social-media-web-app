const ImageKit = require('@imagekit/nodejs');
const ApiError = require('./ApiError');
const fs = require('fs');

const client = new ImageKit({
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
})


const uploadSingleFileToImageKit = async function (file, folderPath) {
    try {

        if (!file || !folderPath) {
            return null;
        }
        console.log("File is Uplording on ImageKit wait .... ");
        const response = await client.files.upload({
            file: fs.createReadStream(file.path),
            fileName: file.filename,
            folder: `/social-media-app/${folderPath}`
        })
        console.log("File is Uplorded Successfully by ImageKit");

        return response;
    } catch (error) {

        throw new ApiError(
            error.statusCode || 500,
            error.message || "Internal Server Error",
            error.stack
        );

    } finally {
        if (fs.existsSync(file.path)) {
            await fs.promises.unlink(file.path);
        }
    }
}


const removeTheFileFromImageKit = async function (fileId) {
    try {
        if (!fileId) {
            throw new ApiError(400, "File Id is missing for deletion of file from ImageKit")
        }
        console.log("File is deleting from ImageKit wait .... ");
        await client.files.delete(fileId);
        console.log("File is deleting from ImageKit done ");
    } catch (error) {
        throw new ApiError(

            error.statusCode || 500,
            error.message || "Internal Server Error",
            error.stack
        );

    }
}


module.exports = {
    client,
    uploadSingleFileToImageKit,
    removeTheFileFromImageKit
};