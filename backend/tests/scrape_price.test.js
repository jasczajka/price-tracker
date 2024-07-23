const scrapePrice = require('../utils/scrapePrice')
const { test, beforeEach, describe } = require('node:test')
const assert = require('node:assert')


describe('price scraper', () => {

    test('correctly scrapes non-discounted price', async () => {
        const discountLink = 'https://www.zalando.pl/vans-authentic-tenisowki-niskie-czarny-va212z002-802.html?size=43'
        const selectorDiscount = 'span.sDq_FX._4sa1cA.dgII7d.HlZ_Tf'
        const selectorNoDiscount = 'span.sDq_FX._4sa1cA.dgII7d.HlZ_Tf'
        const price = await scrapePrice(discountLink, selectorNoDiscount, selectorDiscount)
        console.log(price)
    })

})
