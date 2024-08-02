import axios from 'axios'

const baseUrl = '/api/links'
const renderUrl = '/api/render'


const getHtml = async (url) => {
    return (await axios.get(`${renderUrl}?url=${url}`))
}

export default {getHtml}