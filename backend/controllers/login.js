const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response, next) => {
    try{
        const {username, password} = request.body

        const user = await User.findOne({username: username})

        const passwordCorrect = user === null
            ? false
            : bcrypt.compare(password, user.passwordHash)


        if(!(user && passwordCorrect)){
            return response.status(401).json({
                error: 'Invalid username or password'
            })
        }

        const userForToken = {
            username: user.username,
            id: user._id
        }

        const token = jwt.sign(
            userForToken,
            process.env.SECRET,
            {expiresIn: 60*60}

        )
        response.status(200).json({
            token,
            username: user.username,
            email: user.email
        })
    }
    catch(error){
        next(error)
    }
})

module.exports = loginRouter