const db = require('./../db/models');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ResponeObj = require('./api-response-constructor.js');

//defining local login strategy using brypt to compare hashed pass with input
passport.use(new LocalStrategy(
  (username, password, done) => {

    db.User.findOne({ where: {username: username} })
      .then((dbUser) => {
        if(!dbUser) {
          console.log("Incorrect Username");
          return done(null, false, {message: "Incorrect Username"})
        }
        else {

          return bcrypt.compare(password, dbUser.password)
          .then((isMatch) => {
            if(isMatch) {
              return done(null, dbUser)
            }
            else {
              return done(null, false, {message: "Incorrect Password"})
            }
          })
          .catch((err) => { done(err) })

        }
      })
  })
)

module.exports = function(app) {

  app.post("/user/register", (req, res) => {
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      req.body.password = hash;
      console.log(req.body);

      db.User.create(req.body)
        .then((dbUser) => {
          delete dbUser.dataValues.password;
          delete dbUser.dataValues.userType;
          console.log(dbUser);
          res.json(new ResponeObj(dbUser, "Success, user created.")) })
        .catch(err => {
          console.log(err);
          res.json(new ResponeObj(null, "Something went wrong, see error message for details.", err) ) })
    })
    })
  })


  app.post('/user/login',
  passport.authenticate('local',
    {
      successRedirect: '/home',
      failureRedirect: '/login',
      failureFlash: true
  }))

  app.get("/user/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You have been logged out.")
    res.render("landing")
  })

}
