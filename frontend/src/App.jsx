import { useState, useEffect, useMemo } from 'react'
import LinkTable from './components/LinkTable'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import LogoutPanel from './components/LogoutPanel'
import linkService from '../services/linkService'
import NewLinkButton from './components/NewLinkButton'
import TitlePanel from './components/TitlePanel'
import LinkFilter from './components/LinkFilter'


function App() {
  
  const [notification, setNotification] = useState({message: '', type: ''})
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'desc'})
  const [links, setLinks] = useState([])
  const [filter, setFilter] = useState('');
  const [user, setUser] = useState(null)


  const sortedLinks = useMemo(() => {
        return [...links]
        .filter(link => link.name.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => {
          if( a[sortConfig.key] < b[sortConfig.key]){
            return sortConfig.direction === 'asc' ? -1 : 1
          }
          if( a[sortConfig.key] > b[sortConfig.key]){
            return sortConfig.direction === 'asc' ? 1 : -1
          }
          return 0
        })
      }
    , [links, sortConfig, filter])
    


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


  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc'){
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const notificationClass = notification.message
  ? `notification visible ${notification.type}`
  : 'notification'
  
      

  return (
    <>
      <TitlePanel/>
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
            <LogoutPanel handleLogout = {handleLogout} user = {user}/>
            <NewLinkButton setLinks = {setLinks } links = {sortedLinks} notification = {notification} setNotification = {setNotification} user = {user} />
            <LinkFilter filter = {filter} setFilter = {setFilter}/>
            <LinkTable links = {sortedLinks} setLinks = {setLinks} handleDelete = {handleDelete} handleSort = {handleSort} sortConfig = {sortConfig} />
          </>
        )
      }
      
    </>
  )
}

export default App
