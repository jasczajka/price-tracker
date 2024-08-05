const scrapePrice = require('../utils/scrapePrice').scrapePrice
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const Link = require('../models/link')
const supertest = require('supertest')
const helper = require('./test_helper')

const app = require('../app')

const api = supertest(app)


describe('price scraper', () => {
    beforeEach(async () => {
        await Link.deleteMany()
        
        
        await helper.createUser(api)
    })
    test('correctly scrapes non-discounted price', async () => {

        const token = await helper.getJwtToken(api)
        await helper.createLinkForUser(api, token, helper.initialLinks[0])
        const link = await Link.findOne()
        const discountLink = link.link
        const selectorDiscount = link.regularSelector
        const selectorNoDiscount = link.discountSelector
        const price = await scrapePrice(discountLink, selectorNoDiscount, selectorDiscount)
        console.log('scraped price: ', price)
    })

})

describe('when there is a link saved', () => {
    beforeEach(async () => {

        await Link.deleteMany()
        await helper.createUser(api)
    })
    test('correctly gets the links from api', async () => {

        const token = await helper.getJwtToken(api)
        await helper.createLinkForUser(api, token, helper.initialLinks[0])


        const response = await api
            .get('/api/links')
            .set('Authorization', `Bearer ${token}`)
        // console.log('test gets link', response.body)
        assert.deepStrictEqual(response.body.length, helper.initialLinks.length)

    })

    test('correctly deletes link from api', async () => {
        const token = await helper.getJwtToken(api)
        await helper.createLinkForUser(api, token, helper.initialLinks[0])

        const linksBeforeDelete = await Link.find()
        console.log('link before delete : ', linksBeforeDelete)
        const link = await Link.findOne()

        const response = await api
            .delete(`/api/links//${link.id}`) 
            .set('Authorization', `Bearer ${token}`)
        console.log(response.body)

        const linksAfterDeleteCount = (await Link.find()).length
        console.log('link after delete count: ', linksAfterDeleteCount)
        assert.deepStrictEqual(linksAfterDeleteCount, helper.initialLinks.length - 1)
    })
})



after(async () => {
    await mongoose.connection.close()
})
