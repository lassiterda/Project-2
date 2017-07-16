const express = require('express')
const router = express.Router()

//import CRUD routes for each db model
  const locationRouter = require('./locations')
  const tripRouter = require('./trips')
  const userRouter = require('./user.js')

//mount routes
  router.use('/location', locationRouter)
  router.use('/trips', tripRouter)
  router.use('/user', userRouter)

module.exports = router
