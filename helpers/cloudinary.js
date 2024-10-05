const cloudinary = require('cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    // api_environment_variable: "CLOUDINARY_URL=cloudinary://629657629159538:zn2bU6xqYVzTilgXAz3iwWd6aKU@dledh25lw",
});

const storage = new multer.memoryStorage();

async function imageUploadUtils(file) {
    const result = await cloudinary.uploader.upload(file, {
        redource_type: 'auto',
    });

    return result;
}

const upload = multer({storage});

module.exports = {upload, imageUploadUtils} 