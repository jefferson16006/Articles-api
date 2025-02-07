const express = require('express')
const router = express.Router()
const upload = require('../config/multerConfig');
const Article = require('../models/Article')
const { StatusCodes } = require('http-status-codes')
const {
    getAllArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    likeArticle,
    unlikeArticle,
    uploadArticle
} = require('../controller/articles')

router.route('/').get(getAllArticles).post(createArticle)
router.route('/:id').get(getArticle).patch(updateArticle).delete(deleteArticle)
router.route('/:id/like').patch(likeArticle)
router.route('/:id/unlike').patch(unlikeArticle)
router.post('/upload', upload.single('profilePicture'), async(req, res) => {
    console.log("Upload route hit!");
    try {
        console.log("Received request body:", req.body);
        console.log("Received file:", req.file);
        if (!req.file) {
            throw new BadRequestError('Image file is required.')
        }
        const { title, content } = req.body;
        const imageUrl = req.file.path; // Cloudinary returns the image URL in req.file.path

        const newArticle = new Article({ title, content, imageUrl });
        await newArticle.save();

        res.status(StatusCodes.CREATED).json({ message: 'Article uploaded successfully', article: newArticle });
    } catch (error) {
        console.log(error)
    }
})

module.exports = router