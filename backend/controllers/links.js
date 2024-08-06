const linksRouter = require('express').Router()
const Link = require('../models/link')
const User = require('../models/user')
linksRouter.get('/', async (request, response, next) => {
    try{
        console.log('get request from user: ', request.body.user)
        const links = await Link.find({user: request.body.user})
        return response.json(links)
    }
    catch(error){next(error)}
})

linksRouter.get('/:id', async (request, response, next) => {
    try{
        const link = await Link.findById(request.params.id)

        if(link){
            response.json(link)
        }
        else{
            response.status(404).end()
        }
        
    }
    catch(error){
        next(error)
    }
})

linksRouter.post('/', async (request, response, next) => {
    try{
        console.log(request)
        const user = await User.findById(request.body.user);
        if (!user) {
            return response.status(404).json({ error: 'User not found' });
        }

        const link = new Link(request.body)
        const savedLink = await link.save()

        
        user.links = user.links.concat(savedLink._id.toString());

        await user.save();

        console.log('saved link: ', savedLink)
        response.status(201).json(savedLink)

    }
    catch(error){
        next(error)
    }
})

linksRouter.delete('/:id', async (request, response, next) => {
    try{
        await Link.findByIdAndDelete(request.params.id)
        return response.status(204).end()
    }
    catch(error){
        next(error)
    }
})

module.exports = linksRouter