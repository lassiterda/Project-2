const passport = require('passport')
const express = require('express')
const router  = express.Router()

router.post('/login',
  passport.authenticate('local',
    {
      successRedirect: '/home',
      failureRedirect: '/login',
      failureFlash: true
    }
  )
  )

router.get("/logout", (req, res) => {
  req.logout()
  res.render("landing")
})

module.exports = router
