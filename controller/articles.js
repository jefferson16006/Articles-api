const Article = require('../models/Article')
const { StatusCodes } = require('http-status-codes')
const {
    NotFoundError,
    BadRequestError,
    UnauthenticatedError 
} = require('../errors')

const getAllArticles = async (req, res) => {
    const article = await Article.find({ author: req.user.userID }).sort('createdAt')
    res.status(StatusCodes.OK).json({ article, count: article.length })
}
const getArticle = async (req, res) => {
    const { id: articleID } = req.params                         
    const singleArticle = await Article.findById(articleID)
    if(!singleArticle) {
        throw new NotFoundError(`There's no article with the id: ${articleID}`)
    }
    res.status(StatusCodes.OK).json({ singleArticle })
}
const createArticle = async (req, res) => {
    req.body.author = req.user.userID
    const article = await Article.create(req.body)
    res.status(StatusCodes.CREATED).json({ article })
}
const updateArticle = async (req, res) => {
    const { 
        body: { title, content }, 
        user: { userID },
        params: { id: articleID }
    } = req
    if(!title || !content) {
        throw new BadRequestError('Title and Content cannot be empty.')
    }
    const author = await Article.findById(articleID)
    if(userID !== author.author.toString()) {
        throw new UnauthenticatedError('You do not have access to modify this article.')
    }
    const article = await Article.findByIdAndUpdate({ _id: articleID, author: userID }, req.body, {
        new: true,
        runValidators: true
    })
    if(!article) {
        throw new NotFoundError(`No article with the id: ${articleID} was found.`)
    }
    res.status(StatusCodes.OK).json({ article })
}
const deleteArticle = async (req, res) => {
    const {
        user: { userID },
        params: { id: articleID }
    } = req
    const author = await Article.findById(articleID)
    if(userID !== author.author.toString()) {
        throw new UnauthenticatedError('You do not have access to delete this article.')
    }
    const deletedArticle = await Article.findByIdAndDelete({ _id: articleID, author: userID })
    if(!deletedArticle) {
        throw new NotFoundError(`No article with the id: ${articleID} was found`)
    }
    const article = await Article.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({ article })
}
const likeArticle = async (req, res) => {
    const { user: { userID }, params: { id: articleID } } = req
    try {
        const article = await Article.findById(articleID)
        if(!article) {
            throw new NotFoundError(`There's no article with the id: ${articleID}`)
        }
        if(article.likes.includes(userID)) {
            throw new BadRequestError("You've already likes this post")
        }
        article.likes.push(userID)
        await article.save()
        res.status(StatusCodes.OK).json({ message: "Article liked.", likes: article.likes.length })
    } catch(error) {
        console.log(error)
    }
}
const unlikeArticle = async (req, res) => {
    const { user: { userID }, params: { id: articleID } } = req
    try {
        const article = await Article.findById(articleID)
        if(!article) {
            throw new NotFoundError(`There's no article with the id: ${articleID}`)
        }
        if(!article.likes.includes(userID)) {
            throw new BadRequestError("You've not liked this post")
        }
        article.likes = article.likes.filter(userId => userId.toString() !== userID)
        await article.save()
        res.status(StatusCodes.OK).json({ message: "Article unliked.", likes: article.likes.length })
    } catch(error) {
        console.log(error)
    }
}

module.exports = {
    getAllArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    likeArticle,
    unlikeArticle
}