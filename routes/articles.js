const express = require('express')
const router = express.Router()
const {
    getAllArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    likeArticle,
    unlikeArticle
} = require('../controller/articles')

router.route('/').get(getAllArticles).post(createArticle)
router.route('/:id').get(getArticle).patch(updateArticle).delete(deleteArticle)
router.route('/:id/like').patch(likeArticle)
router.route('/:id/unlike').patch(unlikeArticle)

module.exports = router