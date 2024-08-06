import { useState } from 'react'
import loginService from '../../services/userService'
import linkService from '../../services/linkService'

const LoginForm = ({ setStatus, setUser }) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        try{ 
          const user = await loginService.login({
            username, password
          })
    
          window.localStorage.setItem(
            'loggedPriceTrackAppUser', JSON.stringify(user)
          )
          linkService.setToken(user.token)
          setUser(user)
          setUsername('')
          setPassword('')
    
        }
        catch(error) {
          setStatus(error.response.data.error)
          setTimeout(() => {
            setStatus('')
          }, 5000)
        }
      }

    return (
        <form onSubmit={handleLogin}>
        <h3>Log in</h3>
        <div>
            username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
            password 
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
        </form>  
    )
}

export default LoginForm