const cloudinary = require('cloudinary')
require('dotenv').config()

cloudinary.config({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecrets: process.env.CLOUDINARY_API_SECRET
})

module.exports = cloudinary