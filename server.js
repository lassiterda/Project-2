
const path = require('path');
const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const passport = require('passport');
const flash = require('connect-flash');

//Setup Express App and define PORT number
const app = express();
const apiRouter = require("./routes/api-routes");
// ---START MIDDLEWARE---

  //mounting handlebars as app view engine
  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  app.set("view engine", "handlebars");

  //Mounting body-parser/cookie-parser middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());
  app.use(bodyParser.json({ type: "application/vnd.api+json" }));
  app.use(cookieParser());

  //mounting static assets middleware
  app.use(express.static(__dirname + "/public"));

  //Mounting express-session
  app.use(session({
      secret: 'secret',
      saveUninitialized: true,
      resave: true,
      cookie: {
      }
  }));

  // Passport Init
  app.use(passport.initialize());
  app.use(passport.session());

  //serialize session user id
  passport.serializeUser(function(user, done) {
    console.log("serializeUser");
    console.log(user.id);
    done(null, user.id);
  });

  //deserialize session for user id
  passport.deserializeUser(function(id, done) {
    console.log("deserializeUser");
    db.User.findById(id)
      .then((dbUser) => { done(null, dbUser) })
      .catch((err) => { done(err, null)})
  });

  // Flash messages Init
  app.use(flash());

  // //flash messge variables
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
  });

// ---END MIDDLEWARE---

//load in sequelize models
var db = require("./db/models");
require("./db/associations")(db);

//load app routes
require('./routes/html-routes.js')(app);
//require('./routes/api-routes.js')(app);
//use this router for all api routes...dont need to write api every time
app.use("/api", apiRouter);
require('./routes/user-routes.js')(app);

//Setting Port number as env variable OR 3000
app.set('port', process.env.PORT || 3000);

db.sequelize.sync({ force: process.env.FORCESYNC || true})
  .then(function() {
    app.listen(app.get('port'), function() {
      console.log("App listening on PORT " + app.get('port'));
    });
  });
