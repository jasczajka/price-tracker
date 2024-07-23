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
    
        const newLink = new Link(helper.initialLinks[0])
    
        await newLink.save()
    })
    test('correctly scrapes non-discounted price', async () => {

        const link = await Link.findOne()
        const discountLink = link.link
        const selectorDiscount = link.regularSelector
        const selectorNoDiscount = link.discountSelector
        const price = await scrapePrice(discountLink, selectorNoDiscount, selectorDiscount)
        console.log(price)
    })

})

describe.only('when there is a link saved', () => {
    beforeEach(async () => {
        await Link.deleteMany()
    
        const newLink = new Link(helper.initialLinks[0])
    
        await newLink.save()
    })
    test.only('correctly gets the links from api', async () => {
        const response = await api.get('/api/links')
        console.log(response.body)
        assert.deepStrictEqual(response.body.length, helper.initialLinks.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
