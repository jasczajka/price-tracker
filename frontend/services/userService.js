import axios from 'axios'

const loginUrl = '/api/login'
const registerUrl = '/api/users'


const login = async credentials => {
    const response = await axios.post(loginUrl, credentials)
    return response.data
}

const register = async newAccountInfo => {
    const response = await axios.post(registerUrl, newAccountInfo)
    console.log('new account: ', response.data)
    return response.data
}

export default { login , register}