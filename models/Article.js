const mongoose = require('mongoose')

const ArticleSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title for your article."],
        minlength: 5
    },
    content: {
        type: String,
        required: [true, "Please provide the content for your article."],
        minlength: 5
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide a user"]
    }
}, { timestamps: true })


module.exports = mongoose.model('Article', ArticleSchema)