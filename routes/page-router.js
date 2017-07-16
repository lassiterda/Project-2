const express = require('express')
const router = express.Router();

const checkAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
  else {
    res.redirect('/')
	}
}

router.get("/",(req, res) => {
	res.render('landing')
})

router.get("/register", (req, res) => {
	res.render('register')
})

router.get("/login", (req, res) => {
	if (req.user) {
		res.redirect('/home')
	}
	res.render('login')
})

router.get("/home", checkAuthenticated, (req, res) => {
	res.render('home')
})

router.get("/profile",checkAuthenticated, (req, res) => {
	console.log(req.user)
	res.render('profile')
})

module.exports = router
