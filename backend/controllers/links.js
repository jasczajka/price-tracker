const linksRouter = require('express').Router()
const Link = require('../models/link')

linksRouter.get('/', async (request, response, next) => {
    try{
        const links = await Link.find()
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
        const link = new Link(request.body)
        const savedLink = await link.save()
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