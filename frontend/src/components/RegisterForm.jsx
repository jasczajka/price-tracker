import { useState } from 'react'
import loginService from '../../services/userService'


const RegisterForm = ({ setStatus }) => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = async (event) => {
        event.preventDefault()
        try{ 
          const newUser = await loginService.register({
            username, email, password
          })
          console.log('new user : ', newUser)

          setStatus('Sucess!')
          setTimeout(() => {
            setStatus('')
          }, 5000)
    

          setUsername('')
          setEmail('')
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
        <form onSubmit={handleRegister}>
        <h3>Register</h3>
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
        email
        <input
            type="email"
            value={email}
            name="Email"
            onChange={({ target }) => setEmail(target.value)}
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
        <button type="submit">Register</button>
        </form>  
    )
}

export default RegisterForm