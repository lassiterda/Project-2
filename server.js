
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const passport = require('passport');

//Setup Express App and define PORT number
const app = express();

//Mounting body-parser/cookie-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(cookieParser());

//mounting static assets middleware
app.use(express.static(__dirname + "/public"));


//mounting handlebars as app view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set("view engine", "handlebars");

//express session?

//express validator?

//flash - for flash messages?
// //flsh variables
// app.use(passport.initialize());
// app.use(passport.session());


var db = require("./db/models");
// require("./db/associations")(db);

require('./routes/html-routes.js')(app);

app.set('port', process.env.PORT || 3000);

db.sequelize.sync({ force: process.env.FORCESYNC || true})
  .then(function() {
    app.listen(app.get('port'), function() {
      console.log("App listening on PORT " + app.get('port'));
    });
  });
