const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const Link = require('../models/link')
const schedule = require('node-schedule')

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
      //waitUntil: "domcontentloaded",
      waitUntil: 'networkidle2',
  })
  const content = await page.evaluate(() => document.body.textContent);
  //console.log(content)

  //only regular selector
  if(!selectorDiscount){
    try{
      console.log("only regular selector specified, looking for regular price")
      const priceElement = await page.waitForSelector(selectorNoDiscount)
      const price = await page.evaluate(element => element.textContent, priceElement);
      const priceAsNumber = +(price.replace(/[A-Za-złŁ ]/g,'').replace(',','.'))
      await browser.close()
      return priceAsNumber
    }
    catch(error){
      if(error.name == "TimeoutError"){ 
        console.log('check timed out')
      }   
      else{
        throw error
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
      //console.log(priceAsNumber)
      await browser.close()
      return priceAsNumber
    } catch(error){
      console.log(error.name)
      if(error.name == "TimeoutError"){
        console.log("no discount, looking for regular price")
        try{
          console.log("only regular selector specified, looking for regular price")
          const priceElement = await page.waitForSelector(selectorNoDiscount)
          const price = await page.evaluate(element => element.textContent, priceElement);
          const priceAsNumber = +(price.replace(/[A-Za-złŁ ]/g,'').replace(',','.'))
          await browser.close()
          return priceAsNumber
        }
        catch(error){
          if(error.name == "TimeoutError"){ 
            console.log('check timed out')
          }   
          else{
            throw error
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
  //const content = await page.content()
  console.log('content scraped')
  await browser.close()
  return content


}

const checkForNewPrices = async () => {
    let links = await Link.find()
    links = links.map(link => link.toJSON())
    console.log('checker, new links: ', links)
    const promises = links.map( async (link) => {
        const discountLink = link.link
        const selectorDiscount = link.regularSelector
        const selectorNoDiscount = link.discountSelector
        const price = await scrapePrice(discountLink, selectorNoDiscount, selectorDiscount)

        if(!link.latestPrice){
            console.log(`no price in database found for ${link.name}, inserting ${price}`)
            let updatedLink = link
                updatedLink.latestPrice = price
                const returnedUpdatedLink = await Link.findByIdAndUpdate(link.id, updatedLink, {new: true})
        }
        else{
            if(price !== link.latestPrice){
                console.log(`price for ${link.name} changed, it's now ${price}, used to be ${link.price}`)
                let updatedLink = link
                updatedLink.latestPrice = price
                const returnedUpdatedLink = await Link.findByIdAndUpdate(link.id, updatedLink, {new: true})
                console.log('updated link from db: ', returnedUpdatedLink)
            }
            else{
                console.log(`price for ${link.name} has not changed, it's still ${price}`)
            }
        }

    })
    await Promise.all(promises)

}

module.exports = {scrapePrice, checkForNewPrices, scrapeContent}