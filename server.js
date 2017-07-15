
const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const passport = require('passport')

//  routes
const apiRouter = require('./routes/api/api-routes.js')

//  Express, Router, and port
const app = express()
app.set('port', process.env.PORT || 3000)



// ---START MIDDLEWARE---

  //  mounting handlebars as app view engine
  app.engine('handlebars', exphbs({defaultLayout: 'layout'}))
  app.set('view engine', 'handlebars')

  //Mounting body-parser/cookie-parser middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.text())
  app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
  app.use(cookieParser())

  //  mounting static assets middleware
  app.use(express.static(path.join(__dirname, 'public')))

  //  Mounting express-session
  app.use(session({
      secret: 'secret',
      saveUninitialized: true,
      resave: true,
      cookie: {
      }
  }))

  // Passport Init
  app.use(passport.initialize())
  app.use(passport.session())

  //  serialize session user id
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  //  deserialize session for user id
  passport.deserializeUser(function(id, done) {
    db.User.findById(id)
      .then((dbUser) => { done(null, dbUser) })
      .catch((err) => { done(err, null)})
  })

// ---END MIDDLEWARE---

//  load in sequelize models
var db = require('./db/models')
require('./db/associations')(db)

//  load app routes
app.use('/api', apiRouter)

require('./routes/html-routes.js')(app)
require('./routes/user-routes.js')(app)

//  Setting Port number as env variable OR 3000


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
