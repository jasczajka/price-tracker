import { useState, useEffect } from 'react'
import Header from './components/Header'
import LinkTable from './components/LinkTable'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import LogoutButton from './components/LogoutButton'
import linkService from '../services/linkService'


function App() {
  
  const [notification, setNotification] = useState({message: '', type: ''})
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
          receivedLinks.forEach(async link => {
            if(link.isPriceSeen === false){
              await linkService.updateLink({
                ...link,
                isPriceSeen: true
              })
            }
          })
        }
        catch(error){
          console.log(error)
          if(error.response){
            if(error.response.data.error === 'TokenExpiredError'){
              window.localStorage.clear()
              setUser(null)
              setNotification({
                message: 'Login expired',
                type: 'error'
              })
              setTimeout(() => {
                setNotification({ message: '', type: '' })
              }, 5000)
            }
          }
        }
      }
    }
    awaitLinks()

  }, [user])


  const notificationClass = notification.message
  ? `notification visible ${notification.type}`
  : 'notification'
  
      

  return (
    <>
      <div className='logo'>Price Track</div>
      {notification.message  && <div className={notificationClass}>{notification.message}</div>}
      
      {user === null ? 
        
        (
          <>
            <LoginForm setNotification = {setNotification}  setUser = {setUser} />
            <RegisterForm setNotification = {setNotification} />
          </>
        )  
        
        :
        
        (
          <>
            <Header setLinks = {setLinks } links = {links} notification = {notification} setNotification = {setNotification} user = {user} />
            <LogoutButton handleLogout={handleLogout}/>
            <LinkTable links = {links} setLinks = {setLinks} handleDelete={handleDelete}/>
          </>
        )
      }
      
    </>
  )
}

export default App
