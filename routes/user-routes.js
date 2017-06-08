const db = require('./../db/models');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  (username, password, done) => {
    db.Users.findOne({ where: {username: username} })
      .then((dbUser) => {
        if(!dbUser) {
          console.log("Incorrect Username");
          return done(null, false, {message: "Incorrect Username"})
        }
        bcrypt.compare(password, dbUser.password, (err, isMatch) => {
          if(isMatch) { return done(null, dbUser) }
          else        { return done(null, false, {message: "Incorrect Password"})}
        })
      })
  })
)


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.Users.findById()
    .then((dbUser) => { done(null, dbUser) })
    .catch((err) => { done(err, null)})
});


module.exports = (app) => {

  app.post("/user/register", (req, res) => {
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      db.Users.create({
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
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
);

}
