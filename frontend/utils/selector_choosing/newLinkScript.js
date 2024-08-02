import getSelectorsFromUser from './getSelectorsFromUser'
import linkService from '../../services/linkService'
const addNewLink = async (loadingHook) => {
    const url = prompt('Please give the url of the product')
    if(!url) return
    loadingHook('loading the url...')

    try{
        
        const response = await linkService.getHtml(url)
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
                loadingHook('')
                openedWindow.document.open()
                openedWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>${headContent}</head>
                    <body>${bodyContent}</body>
                    </html>
                `)
                openedWindow.document.close()
                loadingHook('waiting for user to choose the price on url')
                const selectors = await getSelectorsFromUser(openedWindow)
                const newLinkName = prompt('Please give the name of the product')
                console.log('object to send: ', {name: newLinkName, selectors: selectors})
                loadingHook('')
                openedWindow.close()
            }

        }
        else{
            loadingHook('')
            return null
        }
        
    }
    catch(error){
        alert('Error loading the product page')
        loadingHook('')
        console.log(error)
    }
}

export default addNewLink