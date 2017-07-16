const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const passport = require('passport')

//  routes
const apiRouter = require('./routes/api/api-router.js')
const pageRouter = require('./routes/page-router.js')
const localAuthRouter = require('./routes/local-auth-router.js')

//  Express, port, and static assets directory 
const app = express()
app.set('port', process.env.PORT || 3000)
app.use(express.static(path.join(__dirname, 'public')))

// ---START MIDDLEWARE---

//  Mounting handlebars as app view engine
  app.engine('handlebars', exphbs({defaultLayout: 'layout'}))
  app.set('view engine', 'handlebars')

//  Mounting body-parser/cookie-parser middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.text())
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
  app.use(cookieParser())

//  definine static assets folder
  app.use(express.static(path.join(__dirname, 'public')))

//  Mounting express-session
  app.use(session({
      secret: 'secret',
      saveUninitialized: true,
      resave: true,
      cookie: {
      }
  }))

// Passport Init, passport session init, loading strategy (dependency injection)
  app.use(passport.initialize())
  app.use(passport.session())
  require('./auth/localStrategy.js')(passport)

// ---END MIDDLEWARE---

//  load sequelize models, associations (dependency injection)
var db = require('./db/models')
require('./db/associations')(db)

//  load app routes
app.use('/', pageRouter)
app.use('/api', apiRouter)
app.use('/user', localAuthRouter)

//  TODO:   remove once deploying to production.
const locationSeeds = require('./db/seed-locations.js')
const tripSeeds = require('./db/seed-trips.js')

db.sequelize.sync({ force: process.env.FORCESYNC || true})
    .then(function() {
      console.log(db.Sequelize.models)
      db.Location.bulkCreate(locationSeeds).then((res) => {
        console.log(res ? 'Location Seeds loaded' : 'ERROR:  Something went wrong in the seed-locations.js file')

        db.Trip.create(tripSeeds)
        .then(dbTrip => {
          let tripLocArr = tripSeeds.locations.map((ele, idx) => {
             return { sequenceNumber: idx + 1, LocationId:  ele, TripId: dbTrip.dataValues.id}
          })
          db.TripLocation.bulkCreate(tripLocArr)
          .then((dbTripLocations) => {

            return db.Trip.findOne({
              where: { id: dbTrip.id },
              include: [
                {
                  model: db.Location,
                  through: {}
              }]
            })

          })
          .then((res) => {'Trip Seeder Loaded.'})

        })
      app.listen(app.get('port'), function() {
        console.log('App listening on PORT ' + app.get('port'))
      })
    })
  })
