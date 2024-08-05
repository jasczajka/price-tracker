const config = require('./utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const checkForNewPrices = require('./utils/scrapePrice').checkForNewPrices
const schedule = require('node-schedule')

const loginRouter = require('./controllers/login')
const linksRouter = require('./controllers/links')
const usersRouter = require('./controllers/users')
const renderRouter = require('./controllers/renders')
const pricesRouter = require('./controllers/prices')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)
logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => logger.info('connected to MongoDB'))
    .catch((error) => {
        logger.error(`error connecting to MongoDB: ${error.message}`)
    })

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/links', linksRouter)
app.use('/api/users', usersRouter)
app.use('/api/render', renderRouter)
app.use('/api/prices', pricesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
// if(process.env.NODE_ENV !== 'test'){
//     schedule.scheduleJob('* * * * *', checkForNewPrices )
// }

module.exports = app