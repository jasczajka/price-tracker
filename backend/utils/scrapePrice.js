const puppeteer = require('puppeteer')

const defaultLink = 'https://www.zalando.pl/vans-authentic-tenisowki-niskie-czarny-va212z002-802.html?size=43'
const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
  ]
const selectorNoDiscount = '#product-module-price > div.product-price > div'
const selectorDiscount ='#main-content > div.I7OI1O.C3wGFf > div > div._5qdMrS.VHXqc_.rceRmQ._4NtqZU.mIlIve.ypPCAR.KwRvru.DgFgr2 > x-wrapper-re-1-3 > div.hD5J5m > div > div > p > span.sDq_FX._4sa1cA.dgII7d.Km7l2y'
const TIMEOUT = 8000
const generateRandomUA = () => {    
    const randomUAIndex = Math.floor(Math.random() * userAgents.length);
    return userAgents[randomUAIndex];
}

const scrapePrice = async (link = defaultLink, selectorNoDiscount, selectorDiscount) => {
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
      //seraching for non-discounted price
      const priceElement = await page.waitForSelector(selectorNoDiscount)
      const price = await page.evaluate(element => element.textContent, priceElement);
      const priceAsNumber = +(price.replace(/[A-Za-złŁ ]/g,'').replace(',','.'))
      await browser.close()
      return priceAsNumber
    }
    else{
      throw error
    }
  }
}

module.exports = scrapePrice