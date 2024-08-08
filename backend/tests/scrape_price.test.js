const scrapePrice = require('../utils/scrapePrice').scrapePrice
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const Link = require('../models/link')
const supertest = require('supertest')
const helper = require('./test_helper')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)


describe('price scraper', () => {
    beforeEach(async () => {
        await Link.deleteMany()
        await User.deleteMany() 
               
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

describe.only('when there is a link saved', () => {
    beforeEach(async () => {
        await User.deleteMany() 
        await Link.deleteMany()
        await helper.createUser(api)
    })
    test.only('correctly updates link from api', async () => {
        const token = await helper.getJwtToken(api)
        await helper.createLinkForUser(api, token, helper.initialLinks[0])

        const linkBeforeUpdate = (await Link.findOne()).toJSON()
        console.log('link to be updated: ' ,linkBeforeUpdate)

        const linkToBeUpdated = {
            ...linkBeforeUpdate,
            scrapeError: true
        }
        
        const response = await api
            .put(`/api/links//${linkToBeUpdated.id}`)
            .send(linkToBeUpdated) 
            .set('Authorization', `Bearer ${token}`)


        const linkAfterUpdate = response.body
        console.log('link after update ', linkAfterUpdate)
        assert.deepStrictEqual(linkAfterUpdate.scrapeError, (!linkBeforeUpdate.scrapeError))
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
        const link = await Link.findOne()

        const response = await api
            .delete(`/api/links//${link.id}`) 
            .set('Authorization', `Bearer ${token}`)

        const linksAfterDeleteCount = (await Link.find()).length
        assert.deepStrictEqual(linksAfterDeleteCount, helper.initialLinks.length - 1)
    })

    
})



after(async () => {
    await mongoose.connection.close()
})
