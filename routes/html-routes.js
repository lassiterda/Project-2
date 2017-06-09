const db = require('./../db/models');

module.exports = app => {

  //landing page
  app.get("/",(req, res) => {
    res.render('index')
  })

  //main page
  app.get("/home",checkAuthenticated, (req, res) => {
    res.render('home')
  })

  app.get("/profile",checkAuthenticated, (req, res) => {
    res.render('profile')
  })

  //registration page
  app.get("/register", (req, res) => {
    res.render('register')
  })

  // login page
  app.get("/login", (req, res) => {
    res.render('login')
  })
}

const checkAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
    res.json("Logged in: " + req.isAuthenticated())
		// req.flash('error_msg','You are not logged in');
		// res.redirect('/login');
	}
}
