const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response, next) => {
    try{
        const {username, password} = request.body

        const user = await User.findOne({username})
       
        console.log('found user: ', user)
        const passwordCorrect = user === null
            ? false
            : (await bcrypt.compare(password, user.passwordHash))
        console.log('password correct? : ', passwordCorrect)

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
            {expiresIn: 60 * 60}

        )
        response.status(200).send({
            token,
            username: user.username,
            email: user.email
        })
    }
    catch(error){
        console.log(error)
        next(error)
    }
})

module.exports = loginRouter