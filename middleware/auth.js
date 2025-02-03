const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError("No token available")
    }
    const token = authHeader.split(' ')[1]
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRETS)
        const { userID, name } = decode
        req.user = { userID, name }
    } catch(error) {
        throw new UnauthenticatedError('Not authorized to access this route.')
    }
    next()
}

module.exports = authenticationMiddleware   
