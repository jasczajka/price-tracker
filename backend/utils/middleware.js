const User = require('../models/user')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const userValidator = async (request, response, next) => {
    try{
        const authorization = request.get('Authorization')
        if(authorization && authorization.startsWith('Bearer ')){
            
            let token = authorization.replace('Bearer ', '')
            const decodedToken = jwt.verify(token, process.env.SECRET)
            if(decodedToken.id){
                const user = await User.findById(decodedToken.id)
                request.body.user = user._id.toString()
                next()
            }
            else{
                response.status(401).json({error: 'token invalid'}).end()
            }
        }
        else{
            response.status(201).json({error: 'no authorization header'}).end()
        }
    }
    catch(error){
        console.log('caught error: ', error.name)
        next(error)
    }
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    else if (error.name === 'TokenExpiredError'){
        return response.status(401).json({error: error.name})
    }
    else if (error.name === 'MongoServerError' && error.code === 11000){
        return response.status(400).json({error: 'user with this username already exists'})
    }
    else{
        console.log('unhandled error: ',  error.code)
        return response.status(500).end()
    }
}
module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    userValidator
}

