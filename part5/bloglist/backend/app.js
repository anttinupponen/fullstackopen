const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger') // could replace with morgan as well
const mongoose = require('mongoose')

// Connect to MongoDB
logger.info('connecting to', config.MONGODB_URI)
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB.')
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error.message)
  })

// Middleware
app.use(cors())
app.use(express.json())
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'))
}
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor) // Extracts token from request header, 4.20

// Routes
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
// Make sure this is only added when in test mode
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./tests/testing')
  app.use('/api/testing', testingRouter)
}

// Catch-all middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app