import addNewLink from '../../utils/selector_choosing/newLinkScript'
import { useState } from 'react'
const Header = () => {

    const [status, setStatus] = useState('')
    return ( 
    <>
    <h1>Price Track</h1>
    <h1>Log in</h1>
    <button onClick={async event => {
        event.preventDefault()
        await addNewLink(setStatus)
        }}>
            New link
    </button>
    {<h1>{status}</h1>}
    </>
    )
    
}

export default Header