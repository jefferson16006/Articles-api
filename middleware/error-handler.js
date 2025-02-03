const { customAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong. Please try agian later." 
    }
    // if(err instanceof customAPIError) {
    //     return res.status(err.statusCode).json({ msg: err.message })
    // }
    if(err.name === 'ValidationError') {
        customError.msg = Object.values(err.error).map(item => item.message).join(', ')
        customError.statusCode = 400
    }
    if(err.code || err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field.`
        customError.statusCode = 400
    }
    if(err.name === 'CastError') {
        customError.msg = `No job found with id: ${ err.value }`
        customError.statusCode = 404
    }
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err })
    return res.status(customError.statusCode).json({ msg: customError.message })
}

module.exports = errorHandlerMiddleware