import addNewLink from '../../utils/selector_choosing/newLinkScript'
const NewLinkButton = ({links, setLinks, setNotification}) => {

    const handleNewLink = async (event) => {
        event.preventDefault()
        setNotification({
            message: 'waiting for server confirmation',
            type: 'info'
        })
        const newLink = await addNewLink(setNotification)
        if(newLink){
            setNotification({ message: '', type: '' })
            console.log('new link from server: ', newLink)
            setLinks(links.concat(newLink))
        }
        setNotification({ message: '', type: '' })

    }
    return (
        <div className='new-link-button'>
            <button 
                title = "Choose a regular selector if you want to track only one element, in case of 2 price elements, choose also the discounted element"
                onClick={handleNewLink}>
                New link
            </button>
        </div>
    )
    
}

export default NewLinkButton