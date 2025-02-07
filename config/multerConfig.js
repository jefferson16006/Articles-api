const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'articles',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage }); // This should be a multer instance

module.exports = upload;  // Ensure you export the multer instance

