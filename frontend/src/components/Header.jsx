import addNewLink from '../../utils/selector_choosing/newLinkScript'
import { useState } from 'react'
const Header = ({links, setLinks}) => {
    const [status, setStatus] = useState('')

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
    <h1>Price Track</h1>
    <h1>Log in</h1>
    <button onClick={handleNewLink}>
            New link
    </button>
    {<h1>{status}</h1>}
    </>
    )
    
}

export default Header