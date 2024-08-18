const puppeteer = require('puppeteer')
const Link = require('../models/link')
const User = require('../models/user')
const logger = require('./logger')
const sendEmail = require('./mailing').send

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
]
const TIMEOUT = 15000
const generateRandomUA = () => {    
    const randomUAIndex = Math.floor(Math.random() * userAgents.length);
    return userAgents[randomUAIndex];
}

const scrapePrice = async (link , selectorNoDiscount, selectorDiscount) => {
  const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
  })

  const [page] = await browser.pages()
  await page.setUserAgent(generateRandomUA())
  await page.goto(link,{
      waitUntil: 'networkidle2',
  })
  const content = await page.evaluate(() => document.body.textContent);

  //only regular selector
  if(!selectorDiscount){
    try{
      logger.info("only regular selector specified, looking for regular price")
      const priceElement = await page.waitForSelector(selectorNoDiscount)
      const price = await page.evaluate(element => element.textContent, priceElement);
      const priceAsNumber = +(price.replace(/[A-Za-złŁ ]/g,'').replace(',','.'))
      await browser.close()
      return priceAsNumber
    }
    catch(error){
      if(error.name == "TimeoutError"){ 
        logger.error('check timed out')
        return null
      }   
      else{
        logger.error('scrape price error: ', error, ' returning null')
        return null
      }
    }
  }


  //both selectors
  else{
    try{
      
      page.setDefaultTimeout(TIMEOUT)
      const priceElement = await page.waitForSelector(selectorDiscount)
      
      const discountedPrice = await page.evaluate(element => element.textContent, priceElement);
      const priceAsNumber = +discountedPrice.replace(/[A-Za-złŁ ]/g,'').replace(',','.')
      await browser.close()
      return priceAsNumber
    } catch(error){
      if(error.name == "TimeoutError"){
        logger.info("no discount, looking for regular price")
        try{
          logger.info("only regular selector specified, looking for regular price")
          const priceElement = await page.waitForSelector(selectorNoDiscount)
          const price = await page.evaluate(element => element.textContent, priceElement);
          const priceAsNumber = +(price.replace(/[A-Za-złŁ ]/g,'').replace(',','.'))
          await browser.close()
          return priceAsNumber
        }
        catch(error){
          if(error.name == "TimeoutError"){ 
            logger.error('check timed out')
            return null
          }   
          else{
            logger.error('scrape price error: ', error, ' returning null')
            return null
          }
        }
      }
      else{
        throw error
      }
    }
  }
}
const scrapeContent = async (url) => {

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  })

  const [page] = await browser.pages()
  await page.setUserAgent(generateRandomUA())
  await page.goto(url,{
      waitUntil: 'networkidle2',
  })

 


  const content = await page.evaluate(() => document.querySelector('*').outerHTML)
  logger.info('content scraped')
  await browser.close()
  return content


}

const checkForNewPrices = async () => {
    let links = await Link.find()
    links = links.map(link => link.toJSON())
    logger.info('checker, new links: ', links)
    const promises = links.map( async (link) => {
        const discountLink = link.link
        const selectorDiscount = link.regularSelector
        const selectorNoDiscount = link.discountSelector
        let price = null
        try{
          price = await scrapePrice(discountLink, selectorNoDiscount, selectorDiscount)
        }
        catch(error){
          logger.error(`error scraping price for ${link.name} with id ${link.id}, latest price: ${link.latestPrice}`)
          const linkWithError = {
            ...link,
            scrapeError: true
          }

          await Link.findByIdAndUpdate(link.id, linkWithError, {new: true, context: 'query'})
        }

        if(!price){
          logger.error('found price, but its falsy: ', price)
          const linkWithError = {
            ...link,
            scrapeError: true
          }
          await Link.findByIdAndUpdate(link.id, linkWithError, {new: true, context: 'query'})
          return
        }

        if(!link.latestPrice){
            logger.info(`no price in database found for ${link.name}, inserting ${price}`)
            let updatedLink ={
              ...link,
              latestPrice: price,
              priceError: false
            } 

            const returnedUpdatedLink = await Link.findByIdAndUpdate(link.id, updatedLink, {new: true, runValidators: true, context: 'query'})
        
          }
        else{
            if(price != link.latestPrice){
                logger.info(`price for ${link.name} changed, it's now ${price}, used to be ${link.latestPrice}`)
                let updatedLink ={
                  ...link,
                  latestPrice: price,
                  isPriceSeen: false,
                  priceError: false
                } 

                const returnedUpdatedLink = await Link.findByIdAndUpdate(link.id, updatedLink, {new: true, runValidators: true, context: 'query'})
                logger.info('updated link from db: ', returnedUpdatedLink)

                const user =  await User.findById(link.user.toString())

                try{
                  await sendEmail(
                    user.email, 
                    `Price changed for ${link.name}!`, 
                    `Hi ${user.username}!\nPrice for one of items you have on your watchlist, ${link.name}, has changed from ${link.latestPrice} to ${price}`
                  )
                }
                catch(error){
                  logger.error(`error sending e-mail about ${link.name} for user: ${user.username}: `, error)
                }
              


            }
            else{
              logger.info(`price for ${link.name} has not changed, it's still ${price}`)
            }
        }

    })
    await Promise.all(promises)

}

module.exports = { scrapePrice, checkForNewPrices, scrapeContent }