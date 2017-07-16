const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('./../db/models')

module.exports = function(passport) {

    //  deserialize session for user id
  passport.serializeUser(function(user, done) {
  done(null, user.id)
  })

  //  deserialize session for user id
  passport.deserializeUser(function(id, done) {
      db.User.findById(id)
      .then((dbUser) => { done(null, dbUser) })
      .catch((err) => { done(err, null)})
  })

  passport.use(new LocalStrategy(
    (username, password, done) => {

      db.User.findOne({ where: {userName: username} })
      .then((dbUser) => {
        return !dbUser
          ? done(null, false, {message: "Incorrect Username"})
          : bcrypt.compare(password, dbUser.password)
            .then((isMatch) => {
              return isMatch 
                ? done(null, dbUser)
                : done(null, false, {message: "Incorrect Password"})
            })
      })
      .catch((err) => { done(err) })
    })
  )
}

