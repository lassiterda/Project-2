const db = require('./../db/models');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

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
        }
      })
  })
)

module.exports = function(app) {

  app.post("/user/register", (req, res) => {
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      db.User.create({
        userName:   req.body.username,
        password:   hash,
           email:   req.body.email,
        userType:   req.body.userType
      })
        .then((dbUser) => {
          res.json({
            status: "success",
            message: "Success, user Created.",
            user: dbUser
          })
        })
        .catch((err) => {
          res.json(err)
        })
      })
    })
  });

  app.post('/user/login',
    passport.authenticate('local',
    {
      successRedirect: '/home',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  app.post("user/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You have been logged out.")
    res.redirect("/login")
  })

}
