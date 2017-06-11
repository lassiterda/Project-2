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
		res.render('login')
	})

	app.get("/home", (req, res) => {
		res.render('home')
	})

	app.get("/profile", (req, res) => {
		res.render('profile')
	})
}
