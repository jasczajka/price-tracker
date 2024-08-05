import axios from 'axios'

const baseUrl = '/api/links'
const renderUrl = '/api/render'
const priceUrl = '/api/prices'

const getHtml = async (url) => {
    return (await axios.get(`${renderUrl}?url=${url}`))
}

const getAll = async() => {
    const response = await axios.get(`${baseUrl}`)
    const links = response.data
    return links.map(link => {
        return{
            ...link,
            createdAt: new Date(link.createdAt),
            updatedAt: new Date(link.updatedAt)
        }
    })
}
const getPrice = async(url, regularSelector, discountSelector) => {
    
    let apiUrl

    let encodedUrl = encodeURIComponent(url)
    let encodedRegularSelector = encodeURIComponent(regularSelector)

    if(!discountSelector){
        apiUrl = `${priceUrl}?url=${encodedUrl}&regularSelector=${encodedRegularSelector}`
    }
    else{
        let encodedDiscountSelector = encodeURIComponent(discountSelector)
        apiUrl = `${priceUrl}?url=${encodedUrl}&regularSelector=${encodedRegularSelector}&discountSelector=${encodedDiscountSelector}`
    }
    const response = await axios.get(apiUrl)
    return response.data.price
}
const postNewLink = async(newLinkObject) => {
    const response = await axios.post(baseUrl, newLinkObject)
    console.log(response)
    const newLink = response.data
    return {
        ...newLink,
        createdAt: new Date(newLink.createdAt),
        updatedAt: new Date(newLink.updatedAt)
    }
}

const deleteLink = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`)
    return response.data
}

export default {getHtml, getAll, getPrice, postNewLink, deleteLink}