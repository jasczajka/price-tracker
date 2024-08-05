const scrapePrice  = require('../utils/scrapePrice').scrapePrice
const pricesRouter = require('express').Router()


pricesRouter.get('/', async (request, response, next) => {
    console.log('prices router request: ', request)
    const url = request.query.url
    const regularSelector = request.query.regularSelector
    const discountSelector = request.query.discountSelector
    console.log('regular selector: ', regularSelector)
    console.log('discount selector: ', discountSelector)
    if(!url){
        return response.status(400).send('URL parameter is required')
    }
    if(!regularSelector){
        return response.status(400).send('regularSelector parameter is required')
    }
    else{
       try{
        const price = await scrapePrice(url, regularSelector, discountSelector)
        return response.json({price: price})
        }
        catch(error){
            console.error('Error getting the price:', error)
            response.status(500).json({error: 'Error getting the price'})
        }
    }

})

module.exports = pricesRouter