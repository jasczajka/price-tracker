import getSelectorsFromUser from './getSelectorsFromUser'
import linkService from '../../services/linkService'
const TIMEOUT = 15000
const timeoutPromise = (ms) => {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('time out error'))
        }, ms)
    })
}

const addNewLink = async (setNotification) => {
    const url = prompt('Please give the url of the product')
    if(!url) return
    setNotification({
        message: 'loading the url...',
        type: 'info'
    })

    try{
        
        
        const response = await Promise.race([linkService.getHtml(url), timeoutPromise(TIMEOUT)])

        console.log(response)
    
        const encodedPageContent = response.data

        if(encodedPageContent){
            const openedWindow = window.open()
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = encodedPageContent
            const decodedPageContent = tempDiv.innerHTML

            const parser = new DOMParser();
            const doc = parser.parseFromString(decodedPageContent, 'text/html');

            const headContent = doc.head.innerHTML;
            const bodyContent = doc.body.innerHTML;

            if(openedWindow){
                setNotification({message: '', type: ''})
                openedWindow.document.open()
                openedWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>${headContent}</head>
                    <body>${bodyContent}</body>
                    </html>
                `)
                openedWindow.document.close()
                setNotification({
                    message: 'waiting for user to choose the price on url',
                    type: 'info'
                })
                const selectors = await getSelectorsFromUser(openedWindow)
                const newLinkName = prompt('Please give the name of the product')
                
                setNotification({
                    message: 'waiting for price from server...',
                    type: 'info'
                })
                const price = await linkService.getPrice(url, selectors[0], selectors[1])
                console.log('price scraped: ', price)
                if (confirm(`is the price correct?: ${price}`)){
                    const newLinkObject = {
                        name: newLinkName,
                        link: url,
                        regularSelector: selectors[0],
                        discountSelector: selectors[1],
                        latestPrice: price,
                        isPriceSeen: true
                    }
                    console.log('object to send: ', newLinkObject)
                    const newLink = await linkService.postNewLink(newLinkObject)
                    return newLink
                }
                setNotification({message: '', type: ''})
                openedWindow.close()
            }

        }
        else{
            setNotification({message: '', type: ''})
            return null
        }
        
    }
    catch(error){
        alert('Error loading the product page')
        setNotification({message: '', type: ''})
        console.log(error)
    }
}

export default addNewLink