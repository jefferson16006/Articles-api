const mongoose = require('mongoose')
const bcrypyt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email."
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6
    },
    bio: {
        type: String,
        minlength: 5,
        required: false
    },
    profilePicture: {
        type: String,
        required: false
    }
})

UserSchema.pre('save', async function() {
    const salt = await bcrypyt.genSalt(10)
    this.password = await bcrypyt.hash(this.password, salt)
})
UserSchema.methods.createJWT = function() {
    return jwt.sign(
        { userID: this._id, name: this.name },
        process.env.JWT_SECRETS,
        { expiresIn: process.env.JWT_LIFETIME }
    )
}
UserSchema.methods.comparePasswords = async function(candidatePassword) {
    const match = await bcrypyt.compare(candidatePassword, this.password)
    return match
}

module.exports = mongoose.model('User', UserSchema)