const initialLinks = 
[
    {
        name: 'buty vans',
        link: 'https://www.zalando.pl/vans-authentic-tenisowki-niskie-czarny-va212z002-802.html?size=43',
        regularSelector: 'span.sDq_FX._4sa1cA.dgII7d.HlZ_Tf',
        discountSelector: 'span.sDq_FX._4sa1cA.dgII7d.HlZ_Tf'
    }
]

const createUser = async (api) => {
    const response = await api
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send({
            username: 'user',
            password: 'password',
            email: 'user@user.com'
        })
    console.log('helper create user: ', response.body)
    return response.body.id
}   
const getJwtToken = async (api) => {
    const response = await api
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
            username: 'user',
            password: 'password'
        })
    console.log('helper token: ', response.body.token)
    return response.body.token
}

const createLinkForUser = async (api, token, link) => {
    const response = await api
        .post('/api/links')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(link)
        console.log('helper created link: ', response.body)
    return response.body
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = { initialLinks, usersInDb, createUser, getJwtToken, createLinkForUser}