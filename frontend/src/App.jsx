import { useState, useEffect } from 'react'
import Header from './components/Header'
import LinkTable from './components/LinkTable'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import LogoutButton from './components/LogoutButton'
import linkService from '../services/linkService'


function App() {
  
  const [status, setStatus] = useState('')
  const [links, setLinks] = useState([])
  const [user, setUser] = useState(null)



  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
  }

  const handleDelete = (id) => {
    const linkToDelete = links.find(link => link.id === id)
    console.log('link to delete: ', linkToDelete)
    if(confirm(`delete ${linkToDelete.name} ?`)){
        linkService.deleteLink(id)
        .then(setLinks(links.filter(link => link.id !== id)))
    }
  }


  useEffect(()=> {
    const loggedUserJSON = window.localStorage.getItem('loggedPriceTrackAppUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      linkService.setToken(user.token)
    }
    
  }, [])


  useEffect(() => {
    async function awaitLinks(){
      if (user) {
          try{
          const receivedLinks = await linkService.getAll()
          setLinks(receivedLinks)
          console.log(receivedLinks)
          //linkService.getAll().then(receivedLinks => setLinks(receivedLinks))
        }
        catch(error){
          console.log(error)
          if(error.response){
            if(error.response.data.error === 'TokenExpiredError'){
              window.localStorage.clear()
              setUser(null)
              setStatus('Login expired')
              setTimeout(() => {
                setStatus('')
              }, 5000)
            }
          }
        }
      }
    }
    awaitLinks()

  }, [user])


      

  return (
    <>
      <h1>Price Track</h1>
      <h1>{status}</h1>
      {user === null ? 
        
        (
          <>
            <LoginForm setStatus = {setStatus}  setUser = {setUser} />
            <RegisterForm setStatus = {setStatus} />
          </>
        )  
        
        :
        
        (
          <>
            <Header setLinks = {setLinks } links = {links} status = {status} setStatus = {setStatus} user = {user} />
            <LogoutButton handleLogout={handleLogout}/>
            <LinkTable links = {links} setLinks = {setLinks} handleDelete={handleDelete}/>
          </>
        )
      }
      
    </>
  )
}

export default App
