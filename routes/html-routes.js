const checkAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
  else {
    res.redirect('/login')
	}
}

module.exports = function(app) {
	app.get("/",(req, res) => {
		res.render('landing')
	})

	app.get("/register", (req, res) => {
		res.render('register')
	})

	app.get("/login", (req, res) => {
		if (req.user) {
			res.redirect('/home')
		}
		res.render('login')
	})

	app.get("/home", checkAuthenticated, (req, res) => {
		res.render('home')
	})

	app.get("/profile",checkAuthenticated, (req, res) => {
		res.render('profile')
	})
}
