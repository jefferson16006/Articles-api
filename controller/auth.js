const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}
const login = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) {
        throw new BadRequestError('Please provide email and password.')
    }
    const user = await User.findOne({ email })
    if(!user) {
        throw new NotFoundError('Invalid credential: email address cannot be found or is incorrect.')
    }
    const isPasswordCorrect = await user.comparePasswords(password)
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credential: password cannot be found or is incorrect.')
    }
    const token = await user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
    register,
    login
}