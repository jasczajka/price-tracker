const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response, next) => {
    try{
        const users = User.find().populate('links', {name: 1, latestPrice: 1})
        return response.json(users)
    }
    catch(error){
        next(error)
    }
})

usersRouter.post('/', async (request, response, next) => {
    try{
        const { username, email , password } = request.body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username: username,
            email: email,
            passwordHash: passwordHash
        })
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    }
    catch(error){
        next(error)
    }
})
module.exports = usersRouter