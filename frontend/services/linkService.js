import axios from 'axios'

const baseUrl = '/api/links'
const renderUrl = '/api/render'
const priceUrl = '/api/prices'

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const axiosInstance = axios.create()

axiosInstance.interceptors.request.use(
    function(config) {
        if(token){
            config.headers.Authorization = token;
        }
        return config
    }
)


axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401 && error.response.data.error === 'TokenExpiredError') {
            window.localStorage.clear();
        }
        return Promise.reject(error);
    }
);


const getHtml = async (url) => {


    return (await axiosInstance.get(`${renderUrl}?url=${url}`))
}

const getAll = async() => {


    const response = await axiosInstance.get(`${baseUrl}`)
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
    const response = await axiosInstance.get(apiUrl)
    return response.data.price
}

const postNewLink = async(newLinkObject) => {



    const response = await axiosInstance.post(baseUrl, newLinkObject)
    console.log(response)
    const newLink = response.data
    return {
        ...newLink,
        createdAt: new Date(newLink.createdAt),
        updatedAt: new Date(newLink.updatedAt)
    }
}

const deleteLink = async (id) => {

    const response = await axiosInstance.delete(`${baseUrl}/${id}`)
    return response.data
}

export default {getHtml, getAll, getPrice, postNewLink, deleteLink, setToken}