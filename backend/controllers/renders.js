const renderRouter = require('express').Router()
const scrapeContent = require('../utils/scrapePrice').scrapeContent

renderRouter.get('/', async (request, response, next) => {
    const url = request.query.url
    if(!url){
        return response.status(400).send('URL parameter is required')
    }

    try{
        response.setHeader('Content-Type', 'text/html');
        const content = await scrapeContent(url)
        return response.send(content)
    }
    catch(error){
        console.error('Error rendering the URL:', error)
        response.status(500).json({error: 'Error rendering the URL'})
    }

})

module.exports = renderRouter