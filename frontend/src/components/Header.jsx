import addNewLink from '../../utils/selector_choosing/newLinkScript'
const Header = ({links, setLinks, setStatus}) => {

    const handleNewLink = async (event) => {
        event.preventDefault()
        setStatus('waiting for server confirmation')
        const newLink = await addNewLink(setStatus)
        if(newLink){
            setStatus('')
            console.log('new link from server: ', newLink)
            setLinks(links.concat(newLink))
        }
        setStatus('')

    }
    return ( 
    <>
    
    


        <button 
            title = "Choose a regular selector if you want to track only one element, in case of 2 price elements, choose also the discounted element"
            onClick={handleNewLink}>
            New link
        </button>
        
        
    </>
    )
    
}

export default Header