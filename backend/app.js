const config = require('./utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

const linksRouter = require('./controllers/links')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

logger.info('connecting to ', config.MONGODB_URI)

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/links', linksRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app